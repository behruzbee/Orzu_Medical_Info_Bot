import { Api, RawApi } from "grammy";

export class LoadBalancer {
    private targets: number[];
    private currentIndex: number;
    public startTime: Date;
    
    // КЭШ: Сохраняем названия групп тут: { -100111: "Отдел продаж", ... }
    private groupTitles: Map<number, string> = new Map();

    // Хранилище статистики
    public stats = {
        totalRequests: 0,
        duplicates: 0,
        uniqueProcessed: 0,
        byGroup: {} as Record<number, number>,
        startTime: new Date()
    };

    // Последнее распределение
    public lastDistribution: { phone: string; targetId: number; time: string } | null = null;

    // Сет для хранения номеров за сегодня (для проверки дублей)
    private todayNumbers: Set<string> = new Set();

    constructor(targets: number[]) {
        if (!targets || targets.length === 0) throw new Error("Target groups empty");
        this.targets = targets;
        this.currentIndex = 0;
        this.startTime = new Date();
        this.targets.forEach(id => this.stats.byGroup[id] = 0);
    }

    // --- Основной метод распределения ---
    public getNextTarget(phone: string): number {
        this.stats.totalRequests++;
        
        // Проверка на дубликат
        if (this.todayNumbers.has(phone)) {
            this.stats.duplicates++;
        } else {
            this.todayNumbers.add(phone);
            this.stats.uniqueProcessed++;
        }

        const target = this.targets[this.currentIndex];
        
        // Обновляем статистику группы
        if (!this.stats.byGroup[target]) this.stats.byGroup[target] = 0;
        this.stats.byGroup[target]++;

        // Запоминаем последний ход
        this.lastDistribution = {
            phone,
            targetId: target,
            time: new Date().toLocaleString("ru-RU", { timeZone: "Asia/Tashkent" })
        };

        // Сдвигаем очередь
        this.currentIndex = (this.currentIndex + 1) % this.targets.length;
        
        return target;
    }

    // --- Получение статуса очереди (для /status) ---
    public getQueueStatus() {
        return {
            currentIndex: this.currentIndex,
            nextTargetId: this.targets[this.currentIndex],
            totalTargets: this.targets.length
        };
    }

    // --- Получение очереди с именами (для /groups) ---
    public async getQueueStatusWithNames(api: Api<RawApi>) {
        const queue = [];
        for (let i = 0; i < this.targets.length; i++) {
            const id = this.targets[i];
            const title = await this.getGroupTitle(api, id);
            queue.push({ id, title, isNext: i === this.currentIndex });
        }
        return queue;
    }

    // --- Генерация текста отчета (для /report и CRON) ---
    public async getDailyReport(api: Api<RawApi>): Promise<string> {
        let report = `📊 **Ежедневный отчет**\n` +
                     `📅 Дата: ${new Date().toLocaleDateString("ru-RU")}\n\n` +
                     `📥 Всего заявок: **${this.stats.totalRequests}**\n` +
                     `✅ Уникальных: **${this.stats.uniqueProcessed}**\n` +
                     `♻️ Дубликатов: **${this.stats.duplicates}**\n\n` +
                     `**Распределение по группам:**\n`;

        for (const [groupIdStr, count] of Object.entries(this.stats.byGroup)) {
            const groupId = Number(groupIdStr);
            const title = await this.getGroupTitle(api, groupId);
            report += `🔹 ${title}: **${count}**\n`;
        }

        return report;
    }

    // --- Сброс статистики ---
    public resetDailyStats() {
        this.todayNumbers.clear();
        this.stats.totalRequests = 0;
        this.stats.duplicates = 0;
        this.stats.uniqueProcessed = 0;
        this.targets.forEach(id => this.stats.byGroup[id] = 0);
        this.stats.startTime = new Date();
        this.lastDistribution = null;
    }

    // Вспомогательный метод получения имени (с кэшем)
    private async getGroupTitle(api: Api<RawApi>, chatId: number): Promise<string> {
        if (this.groupTitles.has(chatId)) {
            return this.groupTitles.get(chatId)!;
        }

        try {
            const chat = await api.getChat(chatId);
            let title = "Неизвестный чат";
            if ("title" in chat) title = chat.title || title;
            else if ("first_name" in chat) title = chat.first_name;
            
            this.groupTitles.set(chatId, title);
            return title;
        } catch (e) {
            console.error(`Ошибка получения имени чата ${chatId}`);
            return `ID: ${chatId}`;
        }
    }
}