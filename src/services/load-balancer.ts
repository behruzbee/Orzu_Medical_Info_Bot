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
     * 🛠 ВСПОМОГАТЕЛЬНЫЙ МЕТОД (Private)
     * Возвращает точное время 00:00:00 сегодняшнего дня по Ташкенту.
     * Используется везде, чтобы не дублировать код.
     */
    private getTashkentStartOfDay(): Date {
        const now = new Date();
        const tashkentTimeStr = now.toLocaleString("en-US", { timeZone: "Asia/Tashkent" });
        const tashkentDate = new Date(tashkentTimeStr);
        
        const yyyy = tashkentDate.getFullYear();
        const mm = String(tashkentDate.getMonth() + 1).padStart(2, '0');
        const dd = String(tashkentDate.getDate()).padStart(2, '0');
        
        // Возвращаем дату в формате ISO с явным указанием пояса +05:00
        return new Date(`${yyyy}-${mm}-${dd}T00:00:00+05:00`);
    }

    /**
     * Возвращает ID группы для отправки.
     */
    public async getNextTarget(phone: string, name: string = "", msgId: number = 0): Promise<number | null> {
        await dbConnect();
        
        // 👇 ИСПОЛЬЗУЕМ ПРАВИЛЬНОЕ ВРЕМЯ
        const startOfDay = this.getTashkentStartOfDay();

        // 1. Считаем текущее распределение
        const stats = await LeadModel.aggregate([
            { $match: { createdAt: { $gte: startOfDay }, targetGroupId: { $ne: 0 } } },
            { $group: { _id: "$targetGroupId", count: { $sum: 1 } } }
        ]);

        const countsMap = new Map<number, number>();
        stats.forEach(s => countsMap.set(s._id, s.count));

        // 2. Фильтруем группы
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

        // 4. Проверяем дубликат (за сегодня по Ташкенту)
        const existingLead = await LeadModel.findOne({
            phone: phone,
            createdAt: { $gte: startOfDay }
        });

        // Формируем ссылку на сообщение (если нужно)
        // const msgLink = `https://t.me/c/${Math.abs(config.sourceGroupId).toString().substring(3)}/${msgId}`;

        // 5. Сохраняем
        await LeadModel.create({
            phone: phone,
            name: name, // Если вы добавили поле name
            targetGroupId: targetId,
            isDuplicate: !!existingLead
        });

        return isOverflow ? null : targetId;
    }

    /**
     * Генерация отчета
     */
    public async getDailyReport(api: Api<RawApi>): Promise<string> {
        await dbConnect();

        // 👇 ИСПОЛЬЗУЕМ ПРАВИЛЬНОЕ ВРЕМЯ
        const startOfDay = this.getTashkentStartOfDay();

        // 1. Статистика
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

        // 2. Список дубликатов
        const duplicateDocs = await LeadModel.find({
            createdAt: { $gte: startOfDay },
            isDuplicate: true
        }).select("phone");

        const duplicatePhones = duplicateDocs.map(doc => doc.phone);

        let totalSent = 0;
        let totalOverflow = 0;
        let groupsText = "";

        for (const groupConf of config.groupsConfig) {
            const stat = stats.find(s => s._id === groupConf.id);
            const count = stat ? stat.count : 0;
            
            totalSent += count;

            let statusIcon = "🔹"; 
            let note = "";
            if (count >= groupConf.limit) {
                statusIcon = "✅";
                note = " (Выполнено!)";
            }

            groupsText += `${statusIcon} **${groupConf.name}**: ${count} / ${groupConf.limit}${note}\n`;
        }

        const overflowStat = stats.find(s => s._id === 0);
        if (overflowStat) totalOverflow = overflowStat.count;

        const grandTotal = totalSent + totalOverflow;

        let duplicatesSection = "";
        if (duplicatePhones.length > 0) {
            duplicatesSection = `\n🗑 **Список дубликатов (${duplicatePhones.length}):**\n` + 
                                duplicatePhones.map(p => `\`${p}\``).join(", ");
        } else {
            duplicatesSection = "\n✨ Дубликатов сегодня нет.";
        }

        return `📊 **Отчет выполнения плана**\n` +
               `📅 ${new Date().toLocaleDateString("ru-RU", { timeZone: "Asia/Tashkent" })}\n\n` +
               `📥 Всего заявок: **${grandTotal}**\n` +
               `✅ Распределено: **${totalSent}**\n` +
               `♻️ Дубликатов: **${duplicatePhones.length}**\n` +
               `⛔️ Остаток (сверх плана): **${totalOverflow}**\n\n` +
               `**Детализация:**\n` + groupsText + 
               `\n------------------` +
               duplicatesSection;
    }

    public async getAllNumbersGrouped(): Promise<Map<string, string[]>> {
        await dbConnect();
        
        const leads = await LeadModel.find()
            .sort({ createdAt: -1 })
            .select("phone createdAt -_id");

        const grouped = new Map<string, string[]>();

        leads.forEach(lead => {
            const dateStr = new Date(lead.createdAt).toLocaleDateString("ru-RU", {
                timeZone: "Asia/Tashkent" 
            });

            if (!grouped.has(dateStr)) {
                grouped.set(dateStr, []);
            }
            
            grouped.get(dateStr)?.push(lead.phone);
        });

        return grouped;
    }

    public async getQueueStatusData() {
        await dbConnect();
        // 👇 ИСПОЛЬЗУЕМ ПРАВИЛЬНОЕ ВРЕМЯ (тоже важно!)
        const startOfDay = this.getTashkentStartOfDay();

        const totalToday = await LeadModel.countDocuments({ createdAt: { $gte: startOfDay } });
        const overflow = await LeadModel.countDocuments({ createdAt: { $gte: startOfDay }, targetGroupId: 0 });

        return { totalToday, overflow };
    }

    // ... остальные методы (getLastDistribution, getGroupsList) без изменений ...
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