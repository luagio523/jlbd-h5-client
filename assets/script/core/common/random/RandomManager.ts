
import { _decorator, Component, Node } from 'cc';

const { ccclass, property } = _decorator;

interface WeightedItem<T> {
    item: T;
    weight: number;
}

// 基本随机数生成（整数、浮点数、布尔值）
// 数组洗牌和随机选择
// 正态分布随机数生成
// 状态保存和加载
// 带权重的随机选择
// 抽奖功能（带权重，不放回）
// 伪随机系统（用于如暴击率等）
// 严格概率抽奖系统
// 带保底机制的抽奖
// 大规模抽奖模拟和统计

@ccclass('RandomManager')
export class RandomManager extends Component {
    private static instance: RandomManager = null;
    private seed: number = 0;
    private state: number = 0;

    private static readonly INITIAL_SEED_MULTIPLIER = 1000000000;

    // 伪随机数据
    private pseudoRandomData: Map<string, { attempts: number, baseChance: number }> = new Map();

    public static getInstance(): RandomManager {
        if (!RandomManager.instance) {
            const node = new Node('RandomManager');
            RandomManager.instance = node.addComponent(RandomManager);
        }
        return RandomManager.instance;
    }

    public init(seed?: number): void {
        if (seed !== undefined) {
            this.seed = seed;
        } else {
            this.seed = Math.floor(Date.now() % RandomManager.INITIAL_SEED_MULTIPLIER);
        }
        this.state = this.seed;
        console.log(`RandomManager initialized with seed: ${this.seed}`);
    }

    public getSeed(): number {
        return this.seed;
    }

    private xorshift(): number {
        let x = this.state;
        x ^= x << 13;
        x ^= x >> 17;
        x ^= x << 5;
        this.state = x;
        return x;
    }

    public random(): number {
        return (this.xorshift() >>> 0) / 4294967296;
    }

    public randomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(this.random() * (max - min)) + min;
    }

    public randomFloat(min: number, max: number): number {
        return this.random() * (max - min) + min;
    }

    public shuffle<T>(array: T[]): T[] {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = this.randomInt(0, i + 1);
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    public choose<T>(array: T[]): T {
        return array[this.randomInt(0, array.length)];
    }

    public randomBool(probability: number = 0.5): boolean {
        return this.random() < probability;
    }

    public randomNormal(mean: number = 0, stdDev: number = 1): number {
        const u1 = this.random();
        const u2 = this.random();
        const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        return z0 * stdDev + mean;
    }

    public saveState(): number {
        return this.state;
    }

    public loadState(state: number): void {
        this.state = state;
    }

    public reset(): void {
        this.state = this.seed;
    }

    // 带权重的随机选择
    public weightedChoice<T>(items: WeightedItem<T>[]): T {
        const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
        let randomWeight = this.randomFloat(0, totalWeight);
        for (const item of items) {
            randomWeight -= item.weight;
            if (randomWeight <= 0) {
                return item.item;
            }
        }
        return items[items.length - 1].item; // 保险起见，返回最后一个元素
    }

    // 抽奖功能
    public drawLottery<T>(items: WeightedItem<T>[], draws: number): T[] {
        const results: T[] = [];
        const remainingItems = [...items];
        for (let i = 0; i < draws; i++) {
            if (remainingItems.length === 0) break;
            const chosenItem = this.weightedChoice(remainingItems);
            results.push(chosenItem);
            // 从剩余项目中移除已选中的项目（不放回抽样）
            const index = remainingItems.findIndex(item => item.item === chosenItem);
            if (index !== -1) {
                remainingItems.splice(index, 1);
            }
        }
        return results;
    }

    // 伪随机系统
    public pseudoRandom(key: string, baseChance: number): boolean {
        if (!this.pseudoRandomData.has(key)) {
            this.pseudoRandomData.set(key, { attempts: 0, baseChance });
        }

        const data = this.pseudoRandomData.get(key);
        data.attempts++;
        const currentChance = Math.min(1, data.baseChance * data.attempts);

        if (this.randomBool(currentChance)) {
            data.attempts = 0; // 重置尝试次数
            return true;
        }

        return false;
    }

    // 重置伪随机系统的特定键
    public resetPseudoRandom(key: string): void {
        if (this.pseudoRandomData.has(key)) {
            const data = this.pseudoRandomData.get(key);
            data.attempts = 0;
        }
    }

    // 重置所有伪随机系统数据
    public resetAllPseudoRandom(): void {
        this.pseudoRandomData.clear();
    }

    // 严格概率抽奖
    public strictProbabilityDraw<T>(items: WeightedItem<T>[]): T {
        const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
        const randomValue = this.randomFloat(0, totalWeight);
        let accumulatedWeight = 0;

        for (const item of items) {
            accumulatedWeight += item.weight;
            if (randomValue <= accumulatedWeight) {
                return item.item;
            }
        }

        // 理论上不应该到达这里，但为了安全返回最后一个项目
        return items[items.length - 1].item;
    }

    // 多次严格概率抽奖
    public multiStrictProbabilityDraw<T>(items: WeightedItem<T>[], draws: number): T[] {
        const results: T[] = [];
        for (let i = 0; i < draws; i++) {
            results.push(this.strictProbabilityDraw(items));
        }
        return results;
    }

    // 带保底机制的非伪随机抽奖
    public guaranteedProbabilityDraw<T>(items: WeightedItem<T>[], guaranteedItem: T, maxDraws: number): { result: T, drawCount: number } {
        let drawCount = 0;
        while (drawCount < maxDraws) {
            drawCount++;
            const result = this.strictProbabilityDraw(items);
            if (result === guaranteedItem || drawCount === maxDraws) {
                return { result, drawCount };
            }
        }
        return { result: guaranteedItem, drawCount };
    }

    // 模拟大量抽奖并返回统计结果
    public simulateLargeScaleDraw<T>(items: WeightedItem<T>[], totalDraws: number): Map<T, number> {
        const results = new Map<T, number>();
        items.forEach(item => results.set(item.item, 0));

        for (let i = 0; i < totalDraws; i++) {
            const draw = this.strictProbabilityDraw(items);
            results.set(draw, results.get(draw) + 1);
        }

        return results;
    }
}




// // 初始化
// const randomManager = RandomManager.getInstance();
// randomManager.init(12345); // 使用固定种子初始化

// // 基本随机数生成
// const randomNumber = randomManager.random();
// const randomInt = randomManager.randomInt(1, 10);
// const randomFloat = randomManager.randomFloat(0, 1);
// const randomBool = randomManager.randomBool(0.7);

// // 数组操作
// const array = [1, 2, 3, 4, 5];
// const shuffledArray = randomManager.shuffle(array);
// const chosenItem = randomManager.choose(array);

// // 带权重的随机选择
// const weightedItems = [
//     { item: 'Common', weight: 70 },
//     { item: 'Rare', weight: 25 },
//     { item: 'Epic', weight: 5 }
// ];
// const chosenWeightedItem = randomManager.weightedChoice(weightedItems);

// // 抽奖
// const lotteryResults = randomManager.drawLottery(weightedItems, 3);

// // 伪随机系统
// const isCritical = randomManager.pseudoRandom('crit', 0.2);

// // 严格概率抽奖
// const strictDraw = randomManager.strictProbabilityDraw(weightedItems);

// // 多次严格概率抽奖
// const multiDraws = randomManager.multiStrictProbabilityDraw(weightedItems, 10);

// // 带保底机制的抽奖
// const guaranteedDraw = randomManager.guaranteedProbabilityDraw(weightedItems, 'Epic', 100);

// // 大规模抽奖模拟
// const simulationResults = randomManager.simulateLargeScaleDraw(weightedItems, 10000);

// // 输出结果
// console.log('Random number:', randomNumber);
// console.log('Random integer:', randomInt);
// console.log('Random float:', randomFloat);
// console.log('Random boolean:', randomBool);
// console.log('Shuffled array:', shuffledArray);
// console.log('Chosen item:', chosenItem);
// console.log('Chosen weighted item:', chosenWeightedItem);
// console.log('Lottery results:', lotteryResults);
// console.log('Is critical hit:', isCritical);
// console.log('Strict draw result:', strictDraw);
// console.log('Multiple strict draws:', multiDraws);
// console.log('Guaranteed draw result:', guaranteedDraw.result, 'in', guaranteedDraw.drawCount, 'draws');
// console.log('Simulation results:');
// simulationResults.forEach((count, item) => {
//     console.log(`${item}: ${count} (${(count / 10000 * 100).toFixed(2)}%)`);
// });