import { Tile, TileType, WindType, DragonType } from "../Tile";

export class Ryanpeikou {
    /**
     * 验证是否为两杯口和牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 是否为两杯口和牌
     */
    public static verifyRyanpeikou(hand: Tile[], melds: Tile[][]): boolean {
        return this.checkRyanpeikou(hand, melds).isComplete;
    }

    /**
     * 检查是否为两杯口听牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 是否为两杯口听牌
     */
    public static isRyanpeikouTenpai(hand: Tile[], melds: Tile[][]): boolean {
        return this.checkRyanpeikou(hand, melds).isTenpai;
    }

    /**
     * 获取两杯口听牌时的待牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 待牌数组
     */
    public static getRyanpeikouWaitingTiles(hand: Tile[], melds: Tile[][]): Tile[] {
        return this.checkRyanpeikou(hand, melds).waitingTiles;
    }

    /**
     * 检查两杯口的状态
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 包含完成状态、听牌状态和待牌的对象
     */
    public static checkRyanpeikou(hand: Tile[], melds: Tile[][]): { 
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
            return { isComplete: false, isTenpai: false, waitingTiles: [] }; // 两杯口不允许有副露
        }

        // 统计手牌中的牌
        const tileCount = new Map<string, number>();
        hand.forEach(tile => {
            const key = `${tile.type}-${tile.value}`;
            tileCount.set(key, (tileCount.get(key) || 0) + 1);
        });

        let pairCount = 0;
        const waitingTiles: Tile[] = [];

        for (const [key, count] of tileCount) {
            if (count === 2) {
                pairCount++;
            } else if (count === 1) {
                const [type, value] = key.split('-');
                waitingTiles.push(new Tile(type as TileType, parseInt(value)));
            } else if (count > 2) {
                return { isComplete: false, isTenpai: false, waitingTiles: [] }; // 不允许有超过2张的牌
            }
        }

        // 检查是否有两个对子
        const isComplete = pairCount === 2;
        const isTenpai = pairCount === 1 && waitingTiles.length === 1;

        return { isComplete, isTenpai, waitingTiles: isTenpai ? waitingTiles : [] };
    }
}




// // 使用示例

// const hand: Tile[] = [
//     new Tile(TileType.Man, 1),
//     new Tile(TileType.Man, 1),
//     new Tile(TileType.Pin, 2),
//     new Tile(TileType.Pin, 2),
//     new Tile(TileType.Man, 3),
//     new Tile(TileType.Man, 4),
//     new Tile(TileType.Man, 5),
//     new Tile(TileType.Man, 6),
//     new Tile(TileType.Man, 7),
//     new Tile(TileType.Man, 8),
//     new Tile(TileType.Man, 9),
//     new Tile(TileType.Pin, 1),
//     new Tile(TileType.Pin, 3),
//     new Tile(TileType.Pin, 4)
// ];

// const melds: Tile[][] = []; // 没有副露

// // 检查是否为两杯口和牌
// console.log("是否为两杯口:", Ryanpeikou.verifyRyanpeikou(hand, melds));

// // 检查是否为两杯口听牌
// console.log("是否为两杯口听牌:", Ryanpeikou.isRyanpeikouTenpai(hand, melds));

// // 获取两杯口听牌的待牌
// console.log("两杯口听牌的待牌:", Ryanpeikou.getRyanpeikouWaitingTiles(hand, melds).map(tile => tile.toString()));
