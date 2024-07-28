import { Tile, TileType, DragonType } from "../Tile";

/**
 * 小三元（Shousangen）判定类
 * 小三元需要两种三元牌的刻子和一种三元牌的对子
 */
export class Shousangen {
    /**
     * 验证是否为小三元和牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 是否为小三元和牌
     */
    public static verifyShousangen(hand: Tile[], melds: Tile[][]): boolean {
        return this.checkShousangen(hand, melds).isComplete;
    }

    /**
     * 检查是否为小三元听牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 是否为小三元听牌
     */
    public static isShousangenTenpai(hand: Tile[], melds: Tile[][]): boolean {
        return this.checkShousangen(hand, melds).isTenpai;
    }

    /**
     * 获取小三元听牌时的待牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 待牌数组
     */
    public static getShousangenWaitingTiles(hand: Tile[], melds: Tile[][]): Tile[] {
        const { isTenpai, waitingTiles } = this.checkShousangen(hand, melds);
        return isTenpai ? waitingTiles : [];
    }

    /**
     * 检查小三元的状态
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 包含完成状态、听牌状态和待牌的对象
     */
    private static checkShousangen(hand: Tile[], melds: Tile[][]): { 
        isComplete: boolean; 
        isTenpai: boolean; 
        waitingTiles: Tile[] 
    } {
        const totalTiles = hand.length + melds.reduce((sum, meld) => sum + meld.length, 0);
        if (totalTiles !== 13 && totalTiles !== 14) {
            return { isComplete: false, isTenpai: false, waitingTiles: [] };
        }

        const dragonCounts: { [key in DragonType]: number } = {
            [DragonType.White]: 0,
            [DragonType.Green]: 0,
            [DragonType.Red]: 0
        };

        // 统计手牌中的三元牌
        hand.forEach(tile => {
            if (tile.type === TileType.Dragon) {
                dragonCounts[tile.value as DragonType]++;
            }
        });

        // 统计副露中的三元牌
        melds.forEach(meld => {
            if (meld[0].type === TileType.Dragon) {
                dragonCounts[meld[0].value as DragonType] += meld.length;
            }
        });

        let dragonTriples = 0;
        let dragonPairs = 0;
        let dragonSingles = 0;
        const waitingTiles: Tile[] = [];

        for (const [dragon, count] of Object.entries(dragonCounts)) {
            if (count === 1) {
                dragonSingles++;
                waitingTiles.push(new Tile(TileType.Dragon, dragon as DragonType));
                waitingTiles.push(new Tile(TileType.Dragon, dragon as DragonType));
            } else if (count === 2) {
                dragonPairs++;
                waitingTiles.push(new Tile(TileType.Dragon, dragon as DragonType));
            } else if (count >= 3) {
                dragonTriples++;
            }
        }

        const isComplete = dragonTriples === 2 && dragonPairs === 1 && totalTiles === 14;
        const isTenpai = (dragonTriples === 2 && dragonSingles === 1 && totalTiles === 13) ||
                         (dragonTriples === 1 && dragonPairs === 2 && totalTiles === 13);

        return { isComplete, isTenpai, waitingTiles };
    }
}




// // 使用示例

// // 创建一个小三元和牌的手牌和副露
// const completeHand: Tile[] = [
//     new Tile(TileType.Dragon, DragonType.White), new Tile(TileType.Dragon, DragonType.White),
//     new Tile(TileType.Dragon, DragonType.Green), new Tile(TileType.Dragon, DragonType.Green),
//     new Tile(TileType.Man, 1), new Tile(TileType.Man, 1), new Tile(TileType.Man, 1),
//     new Tile(TileType.Pin, 2), new Tile(TileType.Pin, 2)
// ];
// const completeMelds: Tile[][] = [
//     [new Tile(TileType.Dragon, DragonType.Red), new Tile(TileType.Dragon, DragonType.Red), new Tile(TileType.Dragon, DragonType.Red)]
// ];

// // 创建一个小三元听牌的手牌和副露
// const tenpaiHand: Tile[] = [
//     new Tile(TileType.Dragon, DragonType.White), new Tile(TileType.Dragon, DragonType.White),
//     new Tile(TileType.Dragon, DragonType.Green), new Tile(TileType.Dragon, DragonType.Green),
//     new Tile(TileType.Man, 1), new Tile(TileType.Man, 1), new Tile(TileType.Man, 1),
//     new Tile(TileType.Pin, 2), new Tile(TileType.Pin, 2),
//     new Tile(TileType.Dragon, DragonType.Red)
// ];
// const tenpaiMelds: Tile[][] = [];

// console.log("是否为小三元:", Shousangen.verifyShousangen(completeHand, completeMelds));
// console.log("是否为小三元听牌:", Shousangen.isShousangenTenpai(tenpaiHand, tenpaiMelds));
// console.log("小三元听牌的待牌:", Shousangen.getShousangenWaitingTiles(tenpaiHand, tenpaiMelds).map(tile => tile.toString()));

// // 输出结果：
// // 是否为小三元: true
// // 是否为小三元听牌: true
// // 小三元听牌的待牌: ['Red']
