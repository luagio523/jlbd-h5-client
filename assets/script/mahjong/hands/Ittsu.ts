import { Tile, TileType } from "../Tile";

export class Ittsu {
    /**
     * 验证是否为一气通贯和牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 是否为一气通贯和牌
     */
    public static verifyIttsu(hand: Tile[], melds: Tile[][]): boolean {
        return this.checkIttsu(hand, melds).isComplete;
    }

    /**
     * 检查是否为一气通贯听牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 是否为一气通贯听牌
     */
    public static isIttsuTenpai(hand: Tile[], melds: Tile[][]): boolean {
        return this.checkIttsu(hand, melds).isTenpai;
    }

    /**
     * 获取一气通贯听牌时的待牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 待牌数组
     */
    public static getIttsuWaitingTiles(hand: Tile[], melds: Tile[][]): Tile[] {
        return this.checkIttsu(hand, melds).waitingTiles;
    }

    /**
     * 检查一气通贯的状态
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 包含完成状态、听牌状态和待牌的对象
     */
    public static checkIttsuState(hand: Tile[], melds: Tile[][]): { 
        isComplete: boolean; 
        isTenpai: boolean; 
        waitingTiles: Tile[];
        completeSuit?: TileType;
    } {
        return this.checkIttsu(hand, melds);
    }

    /**
     * 检查一气通贯的状态
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 包含完成状态、听牌状态、待牌和完成的花色的对象
     */
    private static checkIttsu(hand: Tile[], melds: Tile[][]): { 
        isComplete: boolean; 
        isTenpai: boolean; 
        waitingTiles: Tile[];
        completeSuit?: TileType;
    } {
        const totalTiles = hand.length + melds.reduce((sum, meld) => sum + meld.length, 0);
        if (totalTiles !== 13 && totalTiles !== 14) {
            return { isComplete: false, isTenpai: false, waitingTiles: [] };
        }

        // const allTiles = [...hand, ...melds.flat()];
        const allTiles = [...hand, ...melds.reduce((acc, val) => acc.concat(val), [])];

        for (const suitType of [TileType.Man, TileType.Pin, TileType.Sou]) {
            const result = this.checkSuit(allTiles, suitType);
            if (result.isComplete) {
                return { ...result, completeSuit: suitType };
            }
            if (result.isTenpai) {
                return result;
            }
        }

        return { isComplete: false, isTenpai: false, waitingTiles: [] };
    }

    private static checkSuit(tiles: Tile[], suitType: TileType): {
        isComplete: boolean;
        isTenpai: boolean;
        waitingTiles: Tile[];
    } {
        const suitTiles = tiles.filter(tile => tile.type === suitType);
        const numbers = new Array(10).fill(0); // 索引0不使用

        suitTiles.forEach(tile => {
            numbers[tile.value as number]++;
        });

        const isComplete = numbers.slice(1).every(count => count > 0);
        if (isComplete) {
            return { isComplete: true, isTenpai: false, waitingTiles: [] };
        }

        const missingNumbers = numbers.slice(1).reduce((acc, count, index) => {
            if (count === 0) acc.push(index + 1);
            return acc;
        }, [] as number[]);

        const isTenpai = missingNumbers.length === 1;
        const waitingTiles = isTenpai ? [new Tile(suitType, missingNumbers[0])] : [];

        return { isComplete: false, isTenpai, waitingTiles };
    }
}



// 首先检查总牌数（手牌 + 鸣牌）是否为14张。
// 将手牌和鸣牌合并到一个数组中。
// 分别检查万、筒、索三种花色是否存在一气通贯。
// 对于每种花色，我们过滤出该花色的所有牌。
// 创建一个数组来记录每个数字（1-9）的出现情况。
// 遍历该花色的所有牌，标记出现的数字。
// 检查是否存在1-9的连续序列。
// 如果任何一种花色存在一气通贯，则返回 true。
// // 一气通贯示例（万子）
// const hand = [
//     Tile.createMan(1), Tile.createMan(2), Tile.createMan(3),
//     Tile.createMan(4), Tile.createMan(5), Tile.createMan(6),
//     Tile.createMan(7), Tile.createMan(8), Tile.createMan(9),
//     Tile.createPin(1), Tile.createPin(1)
// ];
// const melds = [
//     [Tile.createSou(1), Tile.createSou(1), Tile.createSou(1)]
// ];

// const isIttsu = Ittsu.verifyIttsu(hand, melds);
// console.log(isIttsu); // 输出: true

// // 非一气通贯示例
// const hand2 = [
//     Tile.createMan(1), Tile.createMan(2), Tile.createMan(3),
//     Tile.createMan(4), Tile.createMan(5), Tile.createMan(6),
//     Tile.createMan(7), Tile.createMan(8), Tile.createPin(9),
//     Tile.createPin(1), Tile.createPin(1)
// ];
// const melds2 = [
//     [Tile.createSou(1), Tile.createSou(1), Tile.createSou(1)]
// ];

// const isNotIttsu = Ittsu.verifyIttsu(hand2, melds2);
// console.log(isNotIttsu); // 输出: false

// // 独立检查是否为一气通贯和牌
// console.log("是否为一气通贯:", Ittsu.verifyIttsu(hand, melds));

// // 独立检查是否为一气通贯听牌
// console.log("是否为一气通贯听牌:", Ittsu.isIttsuTenpai(hand, melds));

// // 独立获取一气通贯听牌的待牌
// console.log("一气通贯听牌的待牌:", Ittsu.getIttsuWaitingTiles(hand, melds).map(tile => tile.toString()));

// // 一次性获取完整的状态信息
// const state = Ittsu.checkIttsuState(hand, melds);
// console.log("完整状态:", state);
