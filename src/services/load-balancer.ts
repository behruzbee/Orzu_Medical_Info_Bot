import { Api, RawApi } from "grammy";
import { dbConnect } from "../db/connect";
import { StateModel, LeadModel } from "../db/models";
import { config } from "../config";

export class LoadBalancer {
    private targets: number[];
    public startTime: Date; // Нужен для команды /ping

    constructor(targets: number[]) {
        this.targets = targets;
        this.startTime = new Date();
    }

    // =========================================================================
    // 1. ОСНОВНАЯ ЛОГИКА (Для distribution.ts)
    // =========================================================================

    /**
     * Определяет следующую группу для отправки.
     * Если все лимиты исчерпаны, возвращает null (и сохраняет в базу как остаток).
     */
    public async getNextTarget(phone: string): Promise<number | null> {
        await dbConnect();
        
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        // 1. Считаем, сколько заявок УЖЕ распределено сегодня (исключая остаток ID 0)
        const stats = await LeadModel.aggregate([
            { $match: { createdAt: { $gte: startOfDay }, targetGroupId: { $ne: 0 } } },
            { $group: { _id: "$targetGroupId", count: { $sum: 1 } } }
        ]);

        // Превращаем в карту для удобства: { ID_ГРУППЫ: КОЛИЧЕСТВО }
        const countsMap = new Map<number, number>();
        stats.forEach(s => countsMap.set(s._id, s.count));

        // 2. Ищем доступные группы (у которых текущее кол-во < лимит)
        const availableGroups = config.groupsConfig.filter(g => {
            const currentCount = countsMap.get(g.id) || 0;
            return currentCount < g.limit;
        });

        let targetId: number;
        let isOverflow = false;

        // 3. Если есть свободные группы — распределяем
        if (availableGroups.length > 0) {
            // Получаем индекс очереди из БД
            let state = await StateModel.findOneAndUpdate(
                { key: "main_queue" },
                { $setOnInsert: { currentIndex: 0, totalProcessed: 0 } },
                { new: true, upsert: true }
            );

            // Крутим рулетку только среди ДОСТУПНЫХ групп
            const index = state.currentIndex % availableGroups.length;
            targetId = availableGroups[index].id;

            // Сдвигаем очередь вперед
            await StateModel.updateOne(
                { key: "main_queue" },
                { $inc: { currentIndex: 1, totalProcessed: 1 } }
            );
        } else {
            // 🛑 Все планы выполнены
            targetId = 0; // ID 0 = "Остаток"
            isOverflow = true;
        }

        // 4. Проверяем дубликат (глобально по базе за сегодня)
        const existingLead = await LeadModel.findOne({
            phone: phone,
            createdAt: { $gte: startOfDay }
        });

        // 5. Сохраняем заявку в историю
        await LeadModel.create({
            phone: phone,
            targetGroupId: targetId,
            isDuplicate: !!existingLead
        });

        // Если это Overflow, возвращаем null (чтобы бот НЕ отправлял сообщение в телеграм)
        return isOverflow ? null : targetId;
    }

    // =========================================================================
    // 2. МЕТОДЫ ДЛЯ АДМИНА (Admin Handler)
    // =========================================================================

    /**
     * Для команды /report и CRON (Ежедневный отчет)
     */
    public async getDailyReport(api: Api<RawApi>): Promise<string> {
        await dbConnect();
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        // Получаем полную статистику из БД
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

        let totalSent = 0;
        let totalOverflow = 0;
        let groupsText = "";

        // Формируем красивый список по группам
        for (const groupConf of config.groupsConfig) {
            const stat = stats.find(s => s._id === groupConf.id);
            const count = stat ? stat.count : 0;
            
            totalSent += count;

            // Логика иконки (выполнен план или нет)
            let statusIcon = "🔸"; 
            let note = "";
            
            if (count >= groupConf.limit) {
                statusIcon = "✅";
                note = " (План выполнен!)";
            } else if (count === 0) {
                statusIcon = "💤";
            }

            groupsText += `${statusIcon} **${groupConf.name}**: ${count} / ${groupConf.limit}${note}\n`;
        }

        // Считаем остаток (ID 0)
        const overflowStat = stats.find(s => s._id === 0);
        if (overflowStat) {
            totalOverflow = overflowStat.count;
        }

        const grandTotal = totalSent + totalOverflow;

        return `📊 **Отчет выполнения плана**\n` +
               `📅 ${new Date().toLocaleDateString("ru-RU")}\n\n` +
               `📥 Всего поступило заявок: **${grandTotal}**\n` +
               `✅ Распределено менеджерам: **${totalSent}**\n` +
               `⛔️ Попало в остаток (сверх плана): **${totalOverflow}**\n\n` +
               `**Детализация по филиалам:**\n` + groupsText;
    }

    /**
     * Для команды /status (Краткая сводка)
     */
    public async getQueueStatusData() {
        await dbConnect();
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        // Быстрый подсчет количества документов
        const totalToday = await LeadModel.countDocuments({ createdAt: { $gte: startOfDay } });
        const overflow = await LeadModel.countDocuments({ 
            createdAt: { $gte: startOfDay }, 
            targetGroupId: 0 
        });

        return {
            totalToday, // Сколько всего заявок упало в бота
            overflow    // Сколько из них не влезло в лимиты
        };
    }

    /**
     * Для команды /last (Куда ушел последний клиент?)
     */
    public async getLastDistribution() {
        await dbConnect();
        // Берем самую свежую запись
        const last = await LeadModel.findOne().sort({ createdAt: -1 });
        
        if (!last) return null;

        let targetName = "Неизвестно";
        
        if (last.targetGroupId === 0) {
            targetName = "⛔️ ОСТАТОК (Лимит исчерпан)";
        } else {
            const group = config.groupsConfig.find(g => g.id === last.targetGroupId);
            targetName = group ? group.name : `Неизвестная группа (ID ${last.targetGroupId})`;
        }

        return {
            phone: last.phone,
            targetName: targetName,
            targetId: last.targetGroupId,
            time: new Date(last.createdAt).toLocaleString("ru-RU", { timeZone: "Asia/Tashkent" })
        };
    }

    /**
     * Для команды /groups (Посмотреть настройки лимитов)
     */
    public async getGroupsList() {
        // Возвращаем конфигурацию (так как порядок динамический, показываем просто список планов)
        return config.groupsConfig;
    }
}