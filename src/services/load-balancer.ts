export class LoadBalancer {
    private targets: number[];
    private currentIndex: number;

    constructor(targets: number[]) {
        if (!targets || targets.length === 0) {
            throw new Error("Target groups list cannot be empty");
        }
        this.targets = targets;
        this.currentIndex = 0;
    }

    /**
     * Получает ID следующей группы по кругу и обновляет счетчик
     */
    public getNextTarget(): number {
        const target = this.targets[this.currentIndex];
        // Сдвигаем индекс: (0+1)%3 -> 1 ... (2+1)%3 -> 0
        this.currentIndex = (this.currentIndex + 1) % this.targets.length;
        return target;
    }
}