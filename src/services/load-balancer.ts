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

        // 1. Считаем текущее количество заявок по группам за сегодня
        // Исключаем ID 0 (остаток) и считаем только распределенные
        const stats = await LeadModel.aggregate([
            { $match: { createdAt: { $gte: startOfDay }, targetGroupId: { $ne: 0 } } },
            { $group: { _id: "$targetGroupId", count: { $sum: 1 } } }
        ]);

        // Превращаем массив в Map для быстрого поиска: { -1001: 20, -1002: 15 }
        const countsMap = new Map<number, number>();
        stats.forEach(s => countsMap.set(s._id, s.count));

        // 2. Фильтруем группы: оставляем только те, где план НЕ выполнен
        const availableGroups = config.groupsConfig.filter(g => {
            const currentCount = countsMap.get(g.id) || 0;
            return currentCount < g.limit;
        });

        let targetId: number;
        let isOverflow = false;

        // 3. Логика выбора
        if (availableGroups.length > 0) {
            // ЕСТЬ свободные группы -> Крутим рулетку среди них
            let state = await StateModel.findOneAndUpdate(
                { key: "main_queue" },
                { $setOnInsert: { currentIndex: 0, totalProcessed: 0 } },
                { new: true, upsert: true }
            );

            // Используем индекс очереди, но берем остаток от количества ДОСТУПНЫХ групп
            const index = state.currentIndex % availableGroups.length;
            targetId = availableGroups[index].id;

            // Обновляем глобальный счетчик очереди
            await StateModel.updateOne(
                { key: "main_queue" },
                { $inc: { currentIndex: 1, totalProcessed: 1 } }
            );
        } else {
            // НЕТ свободных групп -> Все планы выполнены
            targetId = 0; // Специальный ID для "Остатка"
            isOverflow = true;
        }

        // 4. Проверяем дубликат (глобально по всем заявкам за сегодня)
        const existingLead = await LeadModel.findOne({
            phone: phone,
            createdAt: { $gte: startOfDay }
        });

        // 5. Сохраняем лид в БД
        await LeadModel.create({
            phone: phone,
            targetGroupId: targetId,
            isDuplicate: !!existingLead
        });

        // Если переполнение (isOverflow), возвращаем null, чтобы хендлер не пытался отправить сообщение
        return isOverflow ? null : targetId;
    }

    /**
     * Генерация отчета с учетом лимитов и остатков
     */
    public async getDailyReport(api: Api<RawApi>): Promise<string> {
        await dbConnect();
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        // Получаем полную статистику
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

        let totalSent = 0;     // Реально распределено
        let totalOverflow = 0; // Попало в остаток
        let groupsText = "";

        // Проходим по конфигу (активные группы)
        for (const groupConf of config.groupsConfig) {
            const stat = stats.find(s => s._id === groupConf.id);
            const count = stat ? stat.count : 0;
            
            totalSent += count;

            // Иконка статуса
            let statusIcon = "🔸"; 
            let note = "";
            
            if (count >= groupConf.limit) {
                statusIcon = "✅";
                note = " (Выполнено!)";
            }

            groupsText += `${statusIcon} **${groupConf.name}**: ${count} / ${groupConf.limit}${note}\n`;
        }

        // Ищем статистику по остатку (ID 0)
        const overflowStat = stats.find(s => s._id === 0);
        if (overflowStat) {
            totalOverflow = overflowStat.count;
        }

        const grandTotal = totalSent + totalOverflow;

        return `📊 **Отчет выполнения плана**\n` +
               `📅 ${new Date().toLocaleDateString("ru-RU")}\n\n` +
               `📥 Всего поступило: **${grandTotal}**\n` +
               `✅ Распределено: **${totalSent}**\n` +
               `⛔️ Оставлено (сверх плана): **${totalOverflow}**\n\n` +
               `**Детализация:**\n` + groupsText;
    }

    /**
     * Данные для команды /status
     */
    public async getQueueStatusData() {
        await dbConnect();
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        // Всего заявок сегодня
        const totalToday = await LeadModel.countDocuments({ createdAt: { $gte: startOfDay } });
        
        // Сколько в остатке (не отправлено)
        const overflow = await LeadModel.countDocuments({ 
            createdAt: { $gte: startOfDay }, 
            targetGroupId: 0 
        });

        return {
            totalToday,
            overflow
        };
    }

    /**
     * Данные для команды /last
     */
    public async getLastDistribution() {
        await dbConnect();
        const last = await LeadModel.findOne().sort({ createdAt: -1 });
        if (!last) return null;

        let targetName = "Неизвестно";
        
        if (last.targetGroupId === 0) {
            targetName = "⛔️ ОСТАТОК (Лимит исчерпан)";
        } else {
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

    /**
     * Данные для команды /groups
     */
    public async getGroupsList() {
        // Возвращаем просто конфиг, так как очередь теперь динамическая и зависит от заполненности
        return config.groupsConfig;
    }
}