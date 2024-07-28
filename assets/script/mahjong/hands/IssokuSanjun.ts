import { Tile, TileType } from "../Tile";

export class IssokuSanjun {
    /**
     * 验证是否为一色三同顺和牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 是否为一色三同顺和牌
     */
    public static verifyIssokuSanjun(hand: Tile[], melds: Tile[][]): boolean {
        return this.checkIssokuSanjun(hand, melds).isComplete;
    }

    /**
     * 检查是否为一色三同顺听牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 是否为一色三同顺听牌
     */
    public static isIssokuSanjunTenpai(hand: Tile[], melds: Tile[][]): boolean {
        return this.checkIssokuSanjun(hand, melds).isTenpai;
    }

    /**
     * 获取一色三同顺听牌时的待牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 待牌数组
     */
    public static getIssokuSanjunWaitingTiles(hand: Tile[], melds: Tile[][]): Tile[] {
        return this.checkIssokuSanjun(hand, melds).waitingTiles;
    }

    /**
     * 检查一色三同顺的状态
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 包含完成状态、听牌状态和待牌的对象
     */
    private static checkIssokuSanjun(hand: Tile[], melds: Tile[][]): { 
        isComplete: boolean; 
        isTenpai: boolean; 
        waitingTiles: Tile[];
    } {
        // 检查手牌数量
        if (hand.length !== 14) {
            return { isComplete: false, isTenpai: false, waitingTiles: [] };
        }

        // 检查是否有副露
        if (melds.length > 0) {
            return { isComplete: false, isTenpai: false, waitingTiles: [] }; // 一色三同顺不允许有副露
        }

        // 统计顺子
        const sequences: Map<string, Tile[]> = new Map(); // 记录顺子
        const tileCount = new Map<string, number>(); // 记录牌的数量

        hand.forEach(tile => {
            const key = `${tile.type}-${tile.value}`;
            tileCount.set(key, (tileCount.get(key) || 0) + 1);
        });

        // 查找顺子
        for (let i = 1; i <= 7; i++) { // 只检查1到7的顺子
            const seqKey = `${TileType.Man}-${i}`; // 以万牌为例
            if (tileCount.get(seqKey) >= 1 &&
                tileCount.get(`${TileType.Man}-${i + 1}`) >= 1 &&
                tileCount.get(`${TileType.Man}-${i + 2}`) >= 1) {
                const sequence = [
                    new Tile(TileType.Man, i),
                    new Tile(TileType.Man, i + 1),
                    new Tile(TileType.Man, i + 2)
                ];
                sequences.set(seqKey, sequence);
            }
        }

        // 检查是否有三组相同的顺子
        let completeCount = 0;
        const waitingTiles: Tile[] = [];

        for (const [key, sequence] of sequences) {
            const count = Math.min(
                tileCount.get(`${key}`) || 0,
                tileCount.get(`${key}-${sequence[1].value}`) || 0,
                tileCount.get(`${key}-${sequence[2].value}`) || 0
            );

            completeCount += count;

            // 如果有待牌，添加到待牌数组
            if (count > 0) {
                waitingTiles.push(new Tile(TileType.Man, sequence[0].value)); // 可能的待牌
            }
        }

        const isComplete = completeCount === 3; // 三组相同的顺子
        const isTenpai = completeCount === 2 && waitingTiles.length > 0; // 听牌状态

        return { isComplete, isTenpai, waitingTiles: isTenpai ? waitingTiles : [] };
    }
}


// 检查手牌数量是否为14张。
// 检查是否有副露（鸣牌），一色三同顺不允许有副露。
// 统计手牌中的顺子，确保有三组相同的顺子。

// 使用示例

// const hand: Tile[] = [
//     new Tile(TileType.Man, 1),
//     new Tile(TileType.Man, 2),
//     new Tile(TileType.Man, 3), // 第一组顺子
//     new Tile(TileType.Man, 1),
//     new Tile(TileType.Man, 2),
//     new Tile(TileType.Man, 3), // 第二组顺子
//     new Tile(TileType.Man, 1),
//     new Tile(TileType.Man, 2),
//     new Tile(TileType.Man, 3), // 第三组顺子
//     new Tile(TileType.Pin, 4),
//     new Tile(TileType.Pin, 5),
//     new Tile(TileType.Pin, 6),
//     new Tile(TileType.Sou, 7),
//     new Tile(TileType.Sou, 8)
// ];

// const melds: Tile[][] = []; // 没有副露

// // 检查是否为一色三同顺和牌
// console.log("是否为一色三同顺:", IssokuSanjun.verifyIssokuSanjun(hand, melds));

// // 检查是否为一色三同顺听牌
// console.log("是否为一色三同顺听牌:", IssokuSanjun.isIssokuSanjunTenpai(hand, melds));

// // 获取一色三同顺听牌的待牌
// console.log("一色三同顺听牌的待牌:", IssokuSanjun.getIssokuSanjunWaitingTiles(hand, melds).map(tile => tile.toString()));
