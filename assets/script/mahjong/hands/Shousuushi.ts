import { Tile, TileType, WindType } from "../Tile";

export class Shousuushi {
    /**
     * 验证是否为小四喜和牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 是否为小四喜和牌
     */
    public static verifyShousuushi(hand: Tile[], melds: Tile[][]): boolean {
        return this.checkShousuushi(hand, melds).isComplete;
    }

    /**
     * 检查是否为小四喜听牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 是否为小四喜听牌
     */
    public static isShousuushiTenpai(hand: Tile[], melds: Tile[][]): boolean {
        return this.checkShousuushi(hand, melds).isTenpai;
    }

    /**
     * 获取小四喜听牌时的待牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 待牌数组
     */
    public static getShousuushiWaitingTiles(hand: Tile[], melds: Tile[][]): Tile[] {
        return this.checkShousuushi(hand, melds).waitingTiles;
    }

    /**
     * 检查小四喜的状态
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 包含完成状态、听牌状态和待牌的对象
     */
    private static checkShousuushi(hand: Tile[], melds: Tile[][]): { 
        isComplete: boolean; 
        isTenpai: boolean; 
        waitingTiles: Tile[];
    } {
        // 检查手牌数量
        if (hand.length !== 14) {
            return { isComplete: false, isTenpai: false, waitingTiles: [] };
        }

        // 统计风牌数量
        const windCounts: { [key in WindType]: number } = {
            [WindType.East]: 0,
            [WindType.South]: 0,
            [WindType.West]: 0,
            [WindType.North]: 0
        };

        // 统计手牌中的风牌
        hand.forEach(tile => {
            if (tile.type === TileType.Wind) {
                windCounts[tile.value as WindType]++;
            }
        });

        // 检查是否有三个风牌
        const tripletCount = Object.values(windCounts).filter(count => count >= 3).length;

        // 小四喜的条件：有三个风牌和一个其他风牌
        const isComplete = tripletCount === 1 && hand.some(tile => tile.type === TileType.Wind && windCounts[tile.value as WindType] === 1);
        const isTenpai = tripletCount === 1 && hand.some(tile => tile.type === TileType.Wind && windCounts[tile.value as WindType] === 2);

        // 获取待牌
        const waitingTiles: Tile[] = [];
        if (isTenpai) {
            for (const wind in WindType) {
                if (windCounts[wind as WindType] === 2) {
                    waitingTiles.push(new Tile(TileType.Wind, wind as WindType));
                }
            }
        }

        return { isComplete, isTenpai, waitingTiles };
    }
}





// 使用示例

// const hand: Tile[] = [
//     new Tile(TileType.Wind, WindType.East),
//     new Tile(TileType.Wind, WindType.East),
//     new Tile(TileType.Wind, WindType.East),
//     new Tile(TileType.Wind, WindType.South),
//     new Tile(TileType.Wind, WindType.South),
//     new Tile(TileType.Wind, WindType.West),
//     new Tile(TileType.Wind, WindType.North),
//     new Tile(TileType.Man, 1),
//     new Tile(TileType.Man, 2),
//     new Tile(TileType.Man, 3),
//     new Tile(TileType.Pin, 1),
//     new Tile(TileType.Pin, 2),
//     new Tile(TileType.Pin, 3),
//     new Tile(TileType.Pin, 4)
// ];

// const melds: Tile[][] = []; // 没有副露

// // 检查是否为小四喜和牌
// console.log("是否为小四喜:", Shousuushi.verifyShousuushi(hand, melds));

// // 检查是否为小四喜听牌
// console.log("是否为小四喜听牌:", Shousuushi.isShousuushiTenpai(hand, melds));

// // 获取小四喜听牌的待牌
// console.log("小四喜听牌的待牌:", Shousuushi.getShousuushiWaitingTiles(hand, melds).map(tile => tile.toString()));

