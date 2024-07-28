import { Tile, TileType } from "../Tile";

export class Chinitsu {
    /**
     * 验证是否为清一色和牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 是否为清一色和牌
     */
    public static verifyChinitsu(hand: Tile[], melds: Tile[][]): boolean {
        return this.checkChinitsu(hand, melds).isComplete;
    }

    /**
     * 检查是否为清一色听牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 是否为清一色听牌
     */
    public static isChinitsuTenpai(hand: Tile[], melds: Tile[][]): boolean {
        return this.checkChinitsu(hand, melds).isTenpai;
    }

    /**
     * 获取清一色听牌时的待牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 待牌数组
     */
    public static getChinitsuWaitingTiles(hand: Tile[], melds: Tile[][]): Tile[] {
        return this.checkChinitsu(hand, melds).waitingTiles;
    }

    /**
     * 检查清一色的状态
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 包含完成状态、听牌状态和待牌的对象
     */
    public static checkChinitsuState(hand: Tile[], melds: Tile[][]): { 
        isComplete: boolean; 
        isTenpai: boolean; 
        waitingTiles: Tile[];
        suitType?: TileType;
    } {
        return this.checkChinitsu(hand, melds);
    }

    /**
     * 检查清一色的状态
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 包含完成状态、听牌状态、待牌和花色类型的对象
     */
    private static checkChinitsu(hand: Tile[], melds: Tile[][]): { 
        isComplete: boolean; 
        isTenpai: boolean; 
        waitingTiles: Tile[];
        suitType?: TileType;
    } {
        const totalTiles = hand.length + melds.reduce((sum, meld) => sum + meld.length, 0);
        if (totalTiles !== 13 && totalTiles !== 14) {
            return { isComplete: false, isTenpai: false, waitingTiles: [] };
        }

        // const allTiles = [...hand, ...melds.flat()];
        const allTiles = [...hand, ...melds.reduce((acc, val) => acc.concat(val), [])];

        if (!allTiles.every(tile => tile.type === TileType.Man || tile.type === TileType.Pin || tile.type === TileType.Sou)) {
            return { isComplete: false, isTenpai: false, waitingTiles: [] };
        }

        const suitType = allTiles[0].type;
        if (!allTiles.every(tile => tile.type === suitType)) {
            return { isComplete: false, isTenpai: false, waitingTiles: [] };
        }

        const isComplete = totalTiles === 14;
        if (isComplete) {
            return { isComplete: true, isTenpai: false, waitingTiles: [], suitType };
        }

        // 检查听牌状态
        const tileCounts = this.countTiles(allTiles);
        const waitingTiles = this.getWaitingTiles(tileCounts, suitType);
        const isTenpai = waitingTiles.length > 0;

        return { isComplete: false, isTenpai, waitingTiles, suitType };
    }

    /**
     * 统计牌的数量
     * @param tiles 牌数组
     * @returns 牌数量统计对象
     */
    private static countTiles(tiles: Tile[]): Map<number, number> {
        const counts = new Map<number, number>();
        for (const tile of tiles) {
            counts.set(tile.value as number, (counts.get(tile.value as number) || 0) + 1);
        }
        return counts;
    }

    /**
     * 获取待牌
     * @param tileCounts 牌数量统计对象
     * @param suitType 花色类型
     * @returns 待牌数组
     */
    private static getWaitingTiles(tileCounts: Map<number, number>, suitType: TileType): Tile[] {
        const waitingTiles: Tile[] = [];
        for (let i = 1; i <= 9; i++) {
            const count = tileCounts.get(i) || 0;
            if (count === 1 || count === 4) {
                waitingTiles.push(new Tile(suitType, i));
            }
        }
        return waitingTiles;
    }
}




// 首先检查总牌数（手牌 + 鸣牌）是否为14张。
// 将手牌和鸣牌合并到一个数组中。
// 检查是否所有牌都是数牌（万子、筒子或索子），如果有字牌则不是清一色。
// 获取第一张牌的类型。
// 检查是否所有牌都是同一种类型（都是万子、都是筒子或都是索子）。


// // 清一色示例（全是万子）
// const hand = [
//     Tile.createMan(1), Tile.createMan(1), Tile.createMan(1),
//     Tile.createMan(2), Tile.createMan(3), Tile.createMan(4),
//     Tile.createMan(5), Tile.createMan(6), Tile.createMan(7),
//     Tile.createMan(8), Tile.createMan(9)
// ];
// const melds = [
//     [Tile.createMan(9), Tile.createMan(9), Tile.createMan(9)]
// ];

// const isChinitsu = Chinitsu.verifyChinitsu(hand, melds);
// console.log(isChinitsu); // 输出: true

// // 非清一色示例（包含字牌）
// const hand2 = [
//     Tile.createMan(1), Tile.createMan(1), Tile.createMan(1),
//     Tile.createMan(2), Tile.createMan(3), Tile.createMan(4),
//     Tile.createMan(5), Tile.createMan(6), Tile.createMan(7),
//     Tile.createMan(8), Tile.createWind(WindType.East)
// ];
// const melds2 = [
//     [Tile.createMan(9), Tile.createMan(9), Tile.createMan(9)]
// ];

// const isNotChinitsu = Chinitsu.verifyChinitsu(hand2, melds2);
// console.log(isNotChinitsu); // 输出: false

// // 独立检查是否为清一色和牌
// console.log("是否为清一色:", Chinitsu.verifyChinitsu(hand, melds));

// // 独立检查是否为清一色听牌
// console.log("是否为清一色听牌:", Chinitsu.isChinitsuTenpai(hand, melds));

// // 独立获取清一色听牌的待牌
// console.log("清一色听牌的待牌:", Chinitsu.getChinitsuWaitingTiles(hand, melds).map(tile => tile.toString()));

// // 一次性获取完整的状态信息
// const state = Chinitsu.checkChinitsuState(hand, melds);
// console.log("完整状态:", state);