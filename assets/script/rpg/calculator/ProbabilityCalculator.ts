
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
}