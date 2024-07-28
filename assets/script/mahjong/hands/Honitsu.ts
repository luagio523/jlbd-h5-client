
import { Tile, TileType } from "../Tile";

export class Honitsu {
    /**
     * 验证是否为混一色和牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 是否为混一色和牌
     */
    public static verifyHonitsu(hand: Tile[], melds: Tile[][]): boolean {
        return this.checkHonitsu(hand, melds).isComplete;
    }

    /**
     * 检查是否为混一色听牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 是否为混一色听牌
     */
    public static isHonitsuTenpai(hand: Tile[], melds: Tile[][]): boolean {
        return this.checkHonitsu(hand, melds).isTenpai;
    }

    /**
     * 获取混一色听牌时的待牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 待牌数组
     */
    public static getHonitsuWaitingTiles(hand: Tile[], melds: Tile[][]): Tile[] {
        return this.checkHonitsu(hand, melds).waitingTiles;
    }

    /**
     * 检查混一色的状态
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 包含完成状态、听牌状态和待牌的对象
     */
    public static checkHonitsuState(hand: Tile[], melds: Tile[][]): { 
        isComplete: boolean; 
        isTenpai: boolean; 
        waitingTiles: Tile[];
        suitType?: TileType;
    } {
        return this.checkHonitsu(hand, melds);
    }

    /**
     * 检查混一色的状态
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 包含完成状态、听牌状态、待牌和花色类型的对象
     */
    private static checkHonitsu(hand: Tile[], melds: Tile[][]): { 
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

        const numberTiles = allTiles.filter(tile => tile.type === TileType.Man || tile.type === TileType.Pin || tile.type === TileType.Sou);
        const honorTiles = allTiles.filter(tile => tile.type === TileType.Wind || tile.type === TileType.Dragon);

        if (honorTiles.length === 0) {
            return { isComplete: false, isTenpai: false, waitingTiles: [] };
        }

        const firstNumberTileType = numberTiles.length > 0 ? numberTiles[0].type : null;
        const isSingleSuit = numberTiles.every(tile => tile.type === firstNumberTileType);

        if (!isSingleSuit) {
            return { isComplete: false, isTenpai: false, waitingTiles: [] };
        }

        const isComplete = totalTiles === 14;
        if (isComplete) {
            return { isComplete: true, isTenpai: false, waitingTiles: [], suitType: firstNumberTileType };
        }

        // 检查听牌状态
        const tileCounts = this.countTiles(allTiles);
        const waitingTiles = this.getWaitingTiles(tileCounts, firstNumberTileType);
        const isTenpai = waitingTiles.length > 0;

        return { isComplete: false, isTenpai, waitingTiles, suitType: firstNumberTileType };
    }

    /**
     * 统计牌的数量
     * @param tiles 牌数组
     * @returns 牌数量统计对象
     */
    private static countTiles(tiles: Tile[]): Map<string, number> {
        const counts = new Map<string, number>();
        for (const tile of tiles) {
            const key = `${tile.type}-${tile.value}`;
            counts.set(key, (counts.get(key) || 0) + 1);
        }
        return counts;
    }

    /**
     * 获取待牌
     * @param tileCounts 牌数量统计对象
     * @param suitType 数牌的花色类型
     * @returns 待牌数组
     */
    private static getWaitingTiles(tileCounts: Map<string, number>, suitType: TileType | null): Tile[] {
        const waitingTiles: Tile[] = [];
        for (const [key, count] of tileCounts.entries()) {
            const [type, value] = key.split('-');
            if (count === 1 || count === 4) {
                waitingTiles.push(new Tile(type as TileType, value as any));
            }
            if (suitType && type === suitType && (value === '1' || value === '9')) {
                waitingTiles.push(new Tile(type as TileType, value as any));
            }
        }
        return waitingTiles;
    }
}



// 首先检查总牌数（手牌 + 鸣牌）是否为14张。
// 将手牌和鸣牌合并到一个数组中。
// 分离数牌（万子、筒子、索子）和字牌（风牌、三元牌）。
// 如果没有字牌，则不是混一色。
// 获取第一张数牌的类型。
// 检查是否所有数牌都是同一种类型。
// 如果所有数牌都是同一种类型并且有字牌，则返回 true，表示是混一色。

// // 混一色示例（万子和字牌）
// const hand = [
//     Tile.createMan(1), Tile.createMan(1), Tile.createMan(1),
//     Tile.createMan(2), Tile.createMan(3), Tile.createMan(4),
//     Tile.createMan(5), Tile.createMan(6), Tile.createMan(7),
//     Tile.createWind(WindType.East), Tile.createWind(WindType.East)
// ];
// const melds = [
//     [Tile.createMan(9), Tile.createMan(9), Tile.createMan(9)]
// ];

// const isHonitsu = Honitsu.verifyHonitsu(hand, melds);
// console.log(isHonitsu); // 输出: true

// // 非混一色示例（只有数牌，没有字牌）
// const hand2 = [
//     Tile.createMan(1), Tile.createMan(1), Tile.createMan(1),
//     Tile.createMan(2), Tile.createMan(3), Tile.createMan(4),
//     Tile.createMan(5), Tile.createMan(6), Tile.createMan(7),
//     Tile.createMan(8), Tile.createMan(9)
// ];
// const melds2 = [
//     [Tile.createMan(9), Tile.createMan(9), Tile.createMan(9)]
// ];

// const isNotHonitsu = Honitsu.verifyHonitsu(hand2, melds2);
// console.log(isNotHonitsu); // 输出: false
// 独立检查是否为混一色和牌
// console.log("是否为混一色:", Honitsu.verifyHonitsu(hand, melds));

// // 独立检查是否为混一色听牌
// console.log("是否为混一色听牌:", Honitsu.isHonitsuTenpai(hand, melds));

// // 独立获取混一色听牌的待牌
// console.log("混一色听牌的待牌:", Honitsu.getHonitsuWaitingTiles(hand, melds).map(tile => tile.toString()));

// // 一次性获取完整的状态信息
// const state = Honitsu.checkHonitsuState(hand, melds);
// console.log("完整状态:", state);