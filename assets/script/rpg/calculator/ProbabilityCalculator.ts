
export class ProbabilityCalculator {
    private static instance: ProbabilityCalculator;
    private prdTable: Map<string, number> = new Map();

    private constructor() {}

    public static getInstance(): ProbabilityCalculator {
        if (!ProbabilityCalculator.instance) {
            ProbabilityCalculator.instance = new ProbabilityCalculator();
        }
        return ProbabilityCalculator.instance;
    }

    // 通用概率检查
    public roll(probability: number): boolean {
        return Math.random() * 100 < probability;
    }

    // 伪随机分布（PRD）实现
    public prdRoll(key: string, baseProbability: number): boolean {
        let currentP = this.prdTable.get(key) || this.calculateC(baseProbability);

        if (this.roll(currentP * 100)) {
            this.prdTable.set(key, this.calculateC(baseProbability));
            return true;
        } else {
            this.prdTable.set(key, currentP + this.calculateC(baseProbability));
            return false;
        }
    }

    private calculateC(P: number): number {
        return 0.0045 / (0.0045 + P);
    }




    /**
     * 从一组带权重的列表中选择一个带权重的组
     * @param items 
     * @param getRate 
     * @param totalWeight 已经计算好的总权重(有些提前有缓存计算的)，如果没有提供，则会自动计算
     * @returns 
     */
    public selectWeightedGroup<T>(items: T[], getRate: (item: T) => number, totalWeight?: number): T | null {
        // 如果没有提供 totalWeight，则计算总权重
        if (totalWeight === undefined) {
            totalWeight = items.reduce((total, item) => total + getRate(item), 0);
        }
        
        const random = Math.random() * totalWeight;
        let cumulativeProbability = 0;

        for (const item of items) {
            cumulativeProbability += getRate(item);
            if (random < cumulativeProbability) {
                return item; // 返回选中的组
            }
        }

        return null; // 如果没有选中任何组
    }
}