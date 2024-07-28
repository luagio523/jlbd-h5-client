import { Tile, TileType } from "../Tile";

export class Chuuren {
    private static readonly BASE_PATTERN = [3, 1, 1, 1, 1, 1, 1, 1, 3];

    /**
     * 验证是否为九莲宝灯和牌
     * @param hand 手牌数组
     * @returns 是否为九莲宝灯和牌
     */
    public static verifyChuuren(hand: Tile[]): boolean {
        return this.checkChuuren(hand).isComplete;
    }

    /**
     * 检查是否为九莲宝灯听牌
     * @param hand 手牌数组
     * @returns 是否为九莲宝灯听牌
     */
    public static isChuurenTenpai(hand: Tile[]): boolean {
        return this.checkChuuren(hand).isTenpai;
    }

    /**
     * 获取九莲宝灯听牌时的待牌
     * @param hand 手牌数组
     * @returns 待牌数组
     */
    public static getChuurenWaitingTiles(hand: Tile[]): Tile[] {
        return this.checkChuuren(hand).waitingTiles;
    }

    /**
     * 检查九莲宝灯的状态
     * @param hand 手牌数组
     * @returns 包含完成状态、听牌状态和待牌的对象
     */
    public static checkChuurenState(hand: Tile[]): { 
        isComplete: boolean; 
        isTenpai: boolean; 
        waitingTiles: Tile[];
        suitType?: TileType;
    } {
        return this.checkChuuren(hand);
    }

    /**
     * 检查九莲宝灯的状态
     * @param hand 手牌数组
     * @returns 包含完成状态、听牌状态、待牌和花色类型的对象
     */
    private static checkChuuren(hand: Tile[]): { 
        isComplete: boolean; 
        isTenpai: boolean; 
        waitingTiles: Tile[];
        suitType?: TileType;
    } {
        if (hand.length !== 13 && hand.length !== 14) {
            return { isComplete: false, isTenpai: false, waitingTiles: [] };
        }

        const firstTileType = hand[0].type;
        if (![TileType.Man, TileType.Pin, TileType.Sou].includes(firstTileType) ||
            !hand.every(tile => tile.type === firstTileType)) {
            return { isComplete: false, isTenpai: false, waitingTiles: [] };
        }

        const counts = new Array(10).fill(0);
        hand.forEach(tile => counts[tile.value as number]++);

        let diff = 0;
        const waitingTiles: Tile[] = [];

        for (let i = 1; i <= 9; i++) {
            diff += counts[i] - this.BASE_PATTERN[i - 1];
            if (counts[i] < this.BASE_PATTERN[i - 1]) {
                waitingTiles.push(new Tile(firstTileType, i));
            }
        }

        const isComplete = diff === 1 && hand.length === 14;
        const isTenpai = diff === 0 && hand.length === 13;

        return { 
            isComplete, 
            isTenpai, 
            waitingTiles: isTenpai ? waitingTiles : [],
            suitType: firstTileType
        };
    }
}




// 这个实现的逻辑如下：
// 首先检查手牌数量是否为14张。
// 确保所有牌都属于同一种数牌（万、筒或索）。
// 统计每个数字的出现次数。
// 检查是否符合九莲宝灯的基本构成（1112345678999），同时允许有一张额外的牌。
// 确保有且仅有一个额外的牌。

// const hand = [
//     Tile.createMan(1), Tile.createMan(1), Tile.createMan(1),
//     Tile.createMan(2), Tile.createMan(3), Tile.createMan(4),
//     Tile.createMan(5), Tile.createMan(6), Tile.createMan(7),
//     Tile.createMan(8), Tile.createMan(9), Tile.createMan(9),
//     Tile.createMan(9), Tile.createMan(1)
// ];

// const isChuuren = Chuuren.verifyChuuren(hand);
// console.log(isChuuren); // 输出: true

// // 独立检查是否为九莲宝灯和牌
// console.log("是否为九莲宝灯:", Chuuren.verifyChuuren(hand));

// // 独立检查是否为九莲宝灯听牌
// console.log("是否为九莲宝灯听牌:", Chuuren.isChuurenTenpai(hand));

// // 独立获取九莲宝灯听牌的待牌
// console.log("九莲宝灯听牌的待牌:", Chuuren.getChuurenWaitingTiles(hand).map(tile => tile.toString()));

// // 一次性获取完整的状态信息
// const state = Chuuren.checkChuurenState(hand);
// console.log("完整状态:", state);