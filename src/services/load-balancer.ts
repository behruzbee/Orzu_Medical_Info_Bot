// src/services/LoadBalancer.ts

export class LoadBalancer {
    private targets: number[];
    private currentIndex: number;
    
    // 👇 Новые поля для статистики
    public totalProcessed: number = 0;
    public lastDistribution: { phone: string; targetId: number; time: string } | null = null;
    public startTime: Date;

    constructor(targets: number[]) {
        if (!targets || targets.length === 0) {
            throw new Error("Target groups list cannot be empty");
        }
        this.targets = targets;
        this.currentIndex = 0;
        this.startTime = new Date();
    }

    public getNextTarget(phone: string): number {
        const target = this.targets[this.currentIndex];
        
        // Обновляем статистику
        this.totalProcessed++;
        this.lastDistribution = {
            phone,
            targetId: target,
            time: new Date().toLocaleString("ru-RU", { timeZone: "Asia/Tashkent" })
        };

        // Сдвигаем очередь
        this.currentIndex = (this.currentIndex + 1) % this.targets.length;
        return target;
    }

    // Получить текущий статус очереди
    public getQueueStatus() {
        return {
            currentIndex: this.currentIndex,
            nextTargetId: this.targets[this.currentIndex],
            totalTargets: this.targets.length
        };
    }
}