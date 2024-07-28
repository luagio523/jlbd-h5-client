import { Tile, TileType, WindType, DragonType } from "../Tile";

export class Ippatsu {
    /**
     * 验证是否为一杯口和牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @param winningTile 和牌
     * @returns 是否为一杯口和牌
     */
    public static verifyIppatsu(hand: Tile[], melds: Tile[][], winningTile: Tile): boolean {
        return this.checkIppatsu(hand, melds, winningTile).isComplete;
    }

    /**
     * 检查是否为一杯口听牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @param winningTile 和牌
     * @returns 是否为一杯口听牌
     */
    public static isIppatsuTenpai(hand: Tile[], melds: Tile[][], winningTile: Tile): boolean {
        return this.checkIppatsu(hand, melds, winningTile).isTenpai;
    }

    /**
     * 获取一杯口听牌时的待牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @param winningTile 和牌
     * @returns 待牌数组
     */
    public static getIppatsuWaitingTiles(hand: Tile[], melds: Tile[][], winningTile: Tile): Tile[] {
        return this.checkIppatsu(hand, melds, winningTile).waitingTiles;
    }

    /**
     * 检查一杯口的状态
     * @param hand 手牌数组
     * @param melds 副露数组
     * @param winningTile 和牌
     * @returns 包含完成状态、听牌状态和待牌的对象
     */
    private static checkIppatsu(hand: Tile[], melds: Tile[][], winningTile: Tile): { 
        isComplete: boolean; 
        isTenpai: boolean; 
        waitingTiles: Tile[];
    } {
        // 检查是否有副露
        if (melds.length > 0) return { isComplete: false, isTenpai: false, waitingTiles: [] };

        // 检查手牌数量
        if (hand.length !== 14) return { isComplete: false, isTenpai: false, waitingTiles: [] };

        // 统计手牌中的牌
        const tileCount = new Map<string, number>();
        hand.forEach(tile => {
            const key = `${tile.type}-${tile.value}`;
            tileCount.set(key, (tileCount.get(key) || 0) + 1);
        });

        // 查找雀头
        let pairCount = 0;
        let singleCount = 0;
        const waitingTiles: Tile[] = [];

        for (const [key, count] of tileCount.entries()) {
            if (count === 2) {
                pairCount++;
            } else if (count === 1) {
                singleCount++;
                const [type, value] = key.split('-');
                waitingTiles.push(new Tile(type as TileType, parseInt(value)));
            } else if (count > 2) {
                return { isComplete: false, isTenpai: false, waitingTiles: [] }; // 不允许有超过2张的牌
            }
        }

        // 检查是否有且仅有一个雀头
        const isComplete = pairCount === 1 && singleCount === 0;
        const isTenpai = pairCount === 1 && singleCount === 1;

        // 确保待牌的逻辑
        if (isTenpai) {
            // 如果是听牌，确保待牌是合法的
            const winningKey = `${winningTile.type}-${winningTile.value}`;
            if (!waitingTiles.some(tile => tile.type === winningTile.type && tile.value === winningTile.value)) {
                waitingTiles.push(winningTile);
            }
        }

        return { isComplete, isTenpai, waitingTiles: isTenpai ? waitingTiles : [] };
    }
}




// 对于两杯口和一杯口，首先检查是否有鸣牌。如果有鸣牌，直接返回 false，因为杯口和两杯口都要求全部是暗手。
// 使用 findSequences 方法找出所有可能的顺子。这个方法会：
// 首先对牌进行排序。
// 然后遍历排序后的牌，寻找连续的三张同种类型的牌。
// 将找到的顺子以字符串的形式（例如 "Man-1"）存储在数组中。
// 使用 countPairs 方法计算有多少对相同的顺子。这个方法会：
// 统计每种顺子出现的次数。
// 计算出现次数大于等于2的顺子的数量。
// 对于两杯口，需要有两对相同的顺子，即 pairCount === 2。
// 对于一杯口，需要有一对相同的顺子，即 pairCount === 1。
// // 两杯口示例
// 使用示例

// const hand: Tile[] = [
//     new Tile(TileType.Man, 1),
//     new Tile(TileType.Man, 1),
//     new Tile(TileType.Man, 2),
//     new Tile(TileType.Man, 3),
//     new Tile(TileType.Man, 4),
//     new Tile(TileType.Man, 5),
//     new Tile(TileType.Man, 6),
//     new Tile(TileType.Man, 7),
//     new Tile(TileType.Man, 8),
//     new Tile(TileType.Man, 9),
//     new Tile(TileType.Pin, 1),
//     new Tile(TileType.Pin, 2),
//     new Tile(TileType.Pin, 3),
//     new Tile(TileType.Pin, 4)
// ];

// const melds: Tile[][] = []; // 没有副露
// const winningTile = new Tile(TileType.Man, 1); // 示例和牌
// const playerWind: WindType = WindType.East; // 示例玩家风
// const roundWind: WindType = WindType.East; // 示例圈风

// // 检查是否为一杯口和牌
// console.log("是否为一杯口:", Ippatsu.verifyIppatsu(hand, melds, winningTile));

// // 检查是否为一杯口听牌
// console.log("是否为一杯口听牌:", Ippatsu.isIppatsuTenpai(hand, melds, winningTile));

// // 获取一杯口听牌的待牌
// console.log("一杯口听牌的待牌:", Ippatsu.getIppatsuWaitingTiles(hand, melds, winningTile).map(tile => tile.toString()));
