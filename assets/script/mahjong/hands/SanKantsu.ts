import { Tile, TileType, DragonType, WindType } from "../Tile";

export class SanKantsu {
    /**
     * 验证是否为三杠子和牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 是否为三杠子和牌
     */
    public static verifySanKantsu(hand: Tile[], melds: Tile[][]): boolean {
        return this.checkSanKantsu(hand, melds).isComplete;
    }

    /**
     * 检查是否为三杠子听牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 是否为三杠子听牌
     */
    public static isSanKantsuTenpai(hand: Tile[], melds: Tile[][]): boolean {
        return this.checkSanKantsu(hand, melds).isTenpai;
    }

    /**
     * 获取三杠子听牌时的待牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 待牌数组
     */
    public static getSanKantsuWaitingTiles(hand: Tile[], melds: Tile[][]): Tile[] {
        return this.checkSanKantsu(hand, melds).waitingTiles;
    }

    /**
     * 检查三杠子的状态
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 包含完成状态、听牌状态和待牌的对象
     */
    private static checkSanKantsu(hand: Tile[], melds: Tile[][]): { 
        isComplete: boolean; 
        isTenpai: boolean; 
        waitingTiles: Tile[];
    } {
        // 检查手牌数量
        if (hand.length !== 14) {
            return { isComplete: false, isTenpai: false, waitingTiles: [] };
        }

        // 统计杠的数量
        const tileCount = new Map<string, number>();
        hand.forEach(tile => {
            const key = `${tile.type}-${tile.value}`;
            tileCount.set(key, (tileCount.get(key) || 0) + 1);
        });

        let kanCount = 0; // 杠的数量
        const waitingTiles: Tile[] = [];

        for (const [key, count] of tileCount) {
            if (count === 4) {
                kanCount++; // 明杠或暗杠
            } else if (count === 3) {
                // 如果有三张相同的牌，记录待牌
                const [type, value] = key.split('-');
                waitingTiles.push(new Tile(type as TileType, parseInt(value)));
            } else if (count > 4) {
                return { isComplete: false, isTenpai: false, waitingTiles: [] }; // 不允许有超过4张的牌
            }
        }

        const isComplete = kanCount === 3; // 三杠子
        const isTenpai = kanCount === 2 && waitingTiles.length > 0; // 听牌状态

        return { isComplete, isTenpai, waitingTiles: isTenpai ? waitingTiles : [] };
    }
}


// 证三杠子和牌：
// 检查手牌数量是否为14张。
// 统计手牌中的杠的数量，检查是否有三组杠。
// 如果有三组杠，则返回完成状态。
// 听牌和待牌：
// 在 checkSanKantsu 方法中，添加了对听牌状态的判断逻辑。
// 如果是听牌，确保待牌是合法的，并返回待牌数组。

// // 使用示例

// const hand: Tile[] = [
//     new Tile(TileType.Man, 1),
//     new Tile(TileType.Man, 1),
//     new Tile(TileType.Man, 1),
//     new Tile(TileType.Man, 1), // 明杠
//     new Tile(TileType.Pin, 2),
//     new Tile(TileType.Pin, 2),
//     new Tile(TileType.Pin, 2),
//     new Tile(TileType.Pin, 2), // 明杠
//     new Tile(TileType.Sou, 3),
//     new Tile(TileType.Sou, 3),
//     new Tile(TileType.Sou, 3),
//     new Tile(TileType.Sou, 3), // 明杠
//     new Tile(TileType.Dragon, DragonType.Red),
//     new Tile(TileType.Dragon, DragonType.Red),
//     new Tile(TileType.Dragon, DragonType.Red)
// ];

// const melds: Tile[][] = []; // 没有副露

// // 检查是否为三杠子和牌
// console.log("是否为三杠子:", SanKantsu.verifySanKantsu(hand, melds));

// // 检查是否为三杠子听牌
// console.log("是否为三杠子听牌:", SanKantsu.isSanKantsuTenpai(hand, melds));

// // 获取三杠子听牌的待牌
// console.log("三杠子听牌的待牌:", SanKantsu.getSanKantsuWaitingTiles(hand, melds).map(tile => tile.toString()));
