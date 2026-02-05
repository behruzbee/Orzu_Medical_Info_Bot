import { Api, RawApi } from "grammy";
import { dbConnect } from "../db/connect";
import { StateModel, LeadModel } from "../db/models";
import { config } from "../config";

// Интерфейс ответа для Handler'а
export interface DistributionResult {
    targetId: number | null;     // ID группы (null, если переполнение)
    targetName: string;          // Имя группы
    isOverflow: boolean;         // Флаг переполнения
    isDuplicate: boolean;        // Флаг дубликата
    duplicateDetails?: string;   // Текст: "Был замечен 14:30 в ..."
}

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
     * Используется везде, чтобы не дублировать код и избежать багов с часовыми поясами.
     */
    private getTashkentStartOfDay(): Date {
        const now = new Date();
        // Получаем время в Ташкенте как строку
        const tashkentTimeStr = now.toLocaleString("en-US", { timeZone: "Asia/Tashkent" });
        const tashkentDate = new Date(tashkentTimeStr);
        
        const yyyy = tashkentDate.getFullYear();
        const mm = String(tashkentDate.getMonth() + 1).padStart(2, '0');
        const dd = String(tashkentDate.getDate()).padStart(2, '0');
        
        // Возвращаем дату в формате ISO с явным указанием пояса +05:00
        // Это гарантирует, что Mongo поймет это как 00:00 Ташкента (19:00 UTC вчера)
        return new Date(`${yyyy}-${mm}-${dd}T00:00:00+05:00`);
    }

    /**
     * Основная логика распределения.
     * Возвращает полный отчет о том, куда ушла заявка.
     */
    public async getNextTarget(phone: string, name: string = "", msgId: number = 0): Promise<DistributionResult> {
        await dbConnect();
        
        // 1. Получаем правильное начало дня
        const startOfDay = this.getTashkentStartOfDay();

        // 2. Сначала проверяем дубликат (чтобы сформировать сообщение)
        const existingLead = await LeadModel.findOne({
            phone: phone,
            createdAt: { $gte: startOfDay }
        });

        let duplicateInfo = "";
        
        // Если дубль найден, готовим инфо для админа
        if (existingLead) {
            // Ищем, в какой группе он был
            const prevGroup = config.groupsConfig.find(g => g.id === existingLead.targetGroupId);
            const prevGroupName = prevGroup ? prevGroup.name : (existingLead.targetGroupId === 0 ? "Остаток" : "Неизвестно");
            
            // Форматируем время по Ташкенту
            const timeStr = new Date(existingLead.createdAt).toLocaleTimeString("ru-RU", { 
                timeZone: "Asia/Tashkent", hour: '2-digit', minute: '2-digit' 
            });

            duplicateInfo = `🕒 Был в ${timeStr} -> ${prevGroupName}`;
        }

        // 3. Считаем текущее распределение (исключая остаток ID 0)
        const stats = await LeadModel.aggregate([
            { $match: { createdAt: { $gte: startOfDay }, targetGroupId: { $ne: 0 } } },
            { $group: { _id: "$targetGroupId", count: { $sum: 1 } } }
        ]);

        const countsMap = new Map<number, number>();
        stats.forEach(s => countsMap.set(s._id, s.count));

        // 4. Фильтруем группы (только те, где план не выполнен)
        const availableGroups = config.groupsConfig.filter(g => {
            const currentCount = countsMap.get(g.id) || 0;
            return currentCount < g.limit;
        });

        let targetId: number;
        let targetName: string;
        let isOverflow = false;

        // 5. Выбор цели (Round Robin)
        if (availableGroups.length > 0) {
            let state = await StateModel.findOneAndUpdate(
                { key: "main_queue" },
                { $setOnInsert: { currentIndex: 0, totalProcessed: 0 } },
                { new: true, upsert: true }
            );

            const index = state.currentIndex % availableGroups.length;
            const selectedGroup = availableGroups[index];
            
            targetId = selectedGroup.id;
            targetName = selectedGroup.name;

            await StateModel.updateOne(
                { key: "main_queue" },
                { $inc: { currentIndex: 1, totalProcessed: 1 } }
            );
        } else {
            // Если все группы полные
            targetId = 0; 
            targetName = "⛔️ ОСТАТОК (Лимиты полны)";
            isOverflow = true;
        }

        // 6. Сохраняем в БД (Дубликаты тоже сохраняем для статистики!)
        // Опционально: можно добавить messageLink, если нужно
        // const link = `https://t.me/c/${Math.abs(config.sourceGroupId).toString().substring(3)}/${msgId}`;

        await LeadModel.create({
            phone: phone,
            name: name,
            targetGroupId: targetId,
            isDuplicate: !!existingLead
        });

        // 7. Возвращаем результат
        return {
            targetId: isOverflow ? null : targetId,
            targetName: targetName,
            isOverflow: isOverflow,
            isDuplicate: !!existingLead,
            duplicateDetails: existingLead ? duplicateInfo : undefined
        };
    }

    /**
     * Генерация отчета для админа (/report)
     */
    public async getDailyReport(api: Api<RawApi>): Promise<string> {
        await dbConnect();

        // Используем то же самое время начала дня
        const startOfDay = this.getTashkentStartOfDay();

        // 1. Агрегация статистики
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

        // 2. Получаем список конкретных номеров-дубликатов
        const duplicateDocs = await LeadModel.find({
            createdAt: { $gte: startOfDay },
            isDuplicate: true
        }).select("phone");

        const duplicatePhones = duplicateDocs.map(doc => doc.phone);

        let totalSent = 0;
        let totalOverflow = 0;
        let groupsText = "";

        // Формируем текст по группам
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

        // Считаем остаток
        const overflowStat = stats.find(s => s._id === 0);
        if (overflowStat) totalOverflow = overflowStat.count;

        const grandTotal = totalSent + totalOverflow;

        // Блок со списком дублей
        let duplicatesSection = "";
        if (duplicatePhones.length > 0) {
            // Используем Set, чтобы убрать визуальные повторы в списке, если один номер дублировали 5 раз
            const uniqueDupes = [...new Set(duplicatePhones)];
            duplicatesSection = `\n🗑 **Список дубликатов (${duplicatePhones.length}):**\n` + 
                                uniqueDupes.map(p => `\`${p}\``).join(", ");
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

    /**
     * Получить все номера с разбивкой по датам (/getAllNumbers)
     */
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

    /**
     * Статус очереди для /status
     */
    public async getQueueStatusData() {
        await dbConnect();
        const startOfDay = this.getTashkentStartOfDay();

        const totalToday = await LeadModel.countDocuments({ createdAt: { $gte: startOfDay } });
        const overflow = await LeadModel.countDocuments({ createdAt: { $gte: startOfDay }, targetGroupId: 0 });

        return { totalToday, overflow };
    }

    /**
     * Последнее распределение для /last
     */
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