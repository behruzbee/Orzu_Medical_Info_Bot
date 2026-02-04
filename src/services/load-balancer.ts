import { Api, RawApi } from "grammy";
import { dbConnect } from "../db/connect";
import { StateModel, LeadModel } from "../db/models";
import { config } from "../config";

export class LoadBalancer {
    private targets: number[];
    public startTime: Date;

    constructor(targets: number[]) {
        this.targets = targets;
        this.startTime = new Date();
    }

    /**
     * Возвращает ID группы для отправки.
     * Возвращает NULL, если все планы выполнены (переполнение).
     */
    public async getNextTarget(phone: string): Promise<number | null> {
        await dbConnect();
        
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        // 1. Считаем текущее распределение (исключая остаток)
        const stats = await LeadModel.aggregate([
            { $match: { createdAt: { $gte: startOfDay }, targetGroupId: { $ne: 0 } } },
            { $group: { _id: "$targetGroupId", count: { $sum: 1 } } }
        ]);

        const countsMap = new Map<number, number>();
        stats.forEach(s => countsMap.set(s._id, s.count));

        // 2. Фильтруем группы (только те, где план не выполнен)
        const availableGroups = config.groupsConfig.filter(g => {
            const currentCount = countsMap.get(g.id) || 0;
            return currentCount < g.limit;
        });

        let targetId: number;
        let isOverflow = false;

        // 3. Выбор цели
        if (availableGroups.length > 0) {
            let state = await StateModel.findOneAndUpdate(
                { key: "main_queue" },
                { $setOnInsert: { currentIndex: 0, totalProcessed: 0 } },
                { new: true, upsert: true }
            );

            const index = state.currentIndex % availableGroups.length;
            targetId = availableGroups[index].id;

            await StateModel.updateOne(
                { key: "main_queue" },
                { $inc: { currentIndex: 1, totalProcessed: 1 } }
            );
        } else {
            targetId = 0; // Переполнение
            isOverflow = true;
        }

        // 4. Проверяем дубликат
        const existingLead = await LeadModel.findOne({
            phone: phone,
            createdAt: { $gte: startOfDay }
        });

        // 5. Сохраняем
        await LeadModel.create({
            phone: phone,
            targetGroupId: targetId,
            isDuplicate: !!existingLead
        });

        return isOverflow ? null : targetId;
    }

    /**
     * Генерация отчета с именами дубликатов
     */
    public async getDailyReport(api: Api<RawApi>): Promise<string> {
        await dbConnect();
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        // 1. Получаем общую статистику (цифры)
        const stats = await LeadModel.aggregate([
            { $match: { createdAt: { $gte: startOfDay } } },
            {
                $group: {
                    _id: "$targetGroupId",
                    count: { $sum: 1 },
                    duplicates: { $sum: { $cond: ["$isDuplicate", 1, 0] } }
                }
            }
        ]);

        // 2. 👇 НОВОЕ: Получаем список конкретных номеров-дубликатов
        const duplicateDocs = await LeadModel.find({
            createdAt: { $gte: startOfDay },
            isDuplicate: true
        }).select("phone");

        // Превращаем в массив строк: ["+99890...", "+99891..."]
        const duplicatePhones = duplicateDocs.map(doc => doc.phone);

        let totalSent = 0;
        let totalOverflow = 0;
        let groupsText = "";

        // Формируем список по группам
        for (const groupConf of config.groupsConfig) {
            const stat = stats.find(s => s._id === groupConf.id);
            const count = stat ? stat.count : 0;
            
            totalSent += count;

            let statusIcon = "🔸"; 
            let note = "";
            if (count >= groupConf.limit) {
                statusIcon = "✅";
                note = " (Выполнено!)";
            }

            groupsText += `${statusIcon} **${groupConf.name}**: ${count} / ${groupConf.limit}${note}\n`;
        }

        // Считаем остаток
        const overflowStat = stats.find(s => s._id === 0);
        if (overflowStat) totalOverflow = overflowStat.count;

        const grandTotal = totalSent + totalOverflow;

        // Формируем блок текста со списком дублей
        let duplicatesSection = "";
        if (duplicatePhones.length > 0) {
            duplicatesSection = `\n🗑 **Список дубликатов (${duplicatePhones.length}):**\n` + 
                                duplicatePhones.map(p => `\`${p}\``).join(", ");
        } else {
            duplicatesSection = "\n✨ Дубликатов сегодня нет.";
        }

        return `📊 **Отчет выполнения плана**\n` +
               `📅 ${new Date().toLocaleDateString("ru-RU")}\n\n` +
               `📥 Всего заявок: **${grandTotal}**\n` +
               `✅ Распределено: **${totalSent}**\n` +
               `⛔️ Остаток (сверх плана): **${totalOverflow}**\n\n` +
               `**Детализация:**\n` + groupsText + 
               `\n------------------` +
               duplicatesSection; // 👈 Добавляем список в конец
    }

    // --- Остальные методы (без изменений) ---

    public async getQueueStatusData() {
        await dbConnect();
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const totalToday = await LeadModel.countDocuments({ createdAt: { $gte: startOfDay } });
        const overflow = await LeadModel.countDocuments({ createdAt: { $gte: startOfDay }, targetGroupId: 0 });

        return { totalToday, overflow };
    }

    public async getLastDistribution() {
        await dbConnect();
        const last = await LeadModel.findOne().sort({ createdAt: -1 });
        if (!last) return null;

        let targetName = "Неизвестно";
        if (last.targetGroupId === 0) targetName = "⛔️ ОСТАТОК";
        else {
            const group = config.groupsConfig.find(g => g.id === last.targetGroupId);
            targetName = group ? group.name : `ID ${last.targetGroupId}`;
        }

        return {
            phone: last.phone,
            targetName: targetName,
            targetId: last.targetGroupId,
            time: new Date(last.createdAt).toLocaleString("ru-RU", { timeZone: "Asia/Tashkent" })
        };
    }

    public async getGroupsList() {
        return config.groupsConfig;
    }
}