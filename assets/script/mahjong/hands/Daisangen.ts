import { Tile, TileType, DragonType } from "../Tile";

export class Daisangen {
    /**
     * 验证是否为大三元和牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 是否为大三元和牌
     */
    public static verifyDaisangen(hand: Tile[], melds: Tile[][]): boolean {
        return this.checkDaisangen(hand, melds).isComplete;
    }

    /**
     * 检查是否为大三元听牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 是否为大三元听牌
     */
    public static isDaisangenTenpai(hand: Tile[], melds: Tile[][]): boolean {
        return this.checkDaisangen(hand, melds).isTenpai;
    }

    /**
     * 获取大三元听牌时的待牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 待牌数组
     */
    public static getDaisangenWaitingTiles(hand: Tile[], melds: Tile[][]): Tile[] {
        return this.checkDaisangen(hand, melds).waitingTiles;
    }

    /**
     * 检查大三元的状态
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 包含完成状态、听牌状态和待牌的对象
     */
    public static checkDaisangenState(hand: Tile[], melds: Tile[][]): { 
        isComplete: boolean; 
        isTenpai: boolean; 
        waitingTiles: Tile[];
    } {
        return this.checkDaisangen(hand, melds);
    }

    /**
     * 检查大三元的状态
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 包含完成状态、听牌状态和待牌的对象
     */
    private static checkDaisangen(hand: Tile[], melds: Tile[][]): { 
        isComplete: boolean; 
        isTenpai: boolean; 
        waitingTiles: Tile[];
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
            if (count >= 3) {
                dragonTriples++;
            } else if (count === 2) {
                dragonPairs++;
                waitingTiles.push(new Tile(TileType.Dragon, dragon as DragonType));
            } else if (count === 1) {
                dragonSingles++;
                waitingTiles.push(new Tile(TileType.Dragon, dragon as DragonType));
                waitingTiles.push(new Tile(TileType.Dragon, dragon as DragonType));
            }
        }

        const isComplete = dragonTriples === 3 && totalTiles === 14;
        const isTenpai = (dragonTriples === 2 && dragonPairs === 1 && totalTiles === 13) ||
                         (dragonTriples === 2 && dragonSingles === 1 && totalTiles === 13);

        return { isComplete, isTenpai, waitingTiles };
    }
}





// 这个实现的逻辑如下：
// 首先检查总牌数（手牌 + 鸣牌）是否为14张。
// 创建一个对象 dragonCounts 来统计每种三元牌的数量。
// 遍历手牌，统计手牌中的三元牌数量。
// 遍历鸣牌，统计鸣牌中的三元牌数量。
// 检查每种三元牌（白、发、中）是否都至少有3张。
// 如果所有三元牌都至少有3张，则返回 true，表示是大三元。

// const hand = [
//     Tile.createDragon(DragonType.White), Tile.createDragon(DragonType.White), Tile.createDragon(DragonType.White),
//     Tile.createDragon(DragonType.Green), Tile.createDragon(DragonType.Green), Tile.createDragon(DragonType.Green),
//     Tile.createMan(1), Tile.createMan(2)
// ];
// const melds = [
//     [Tile.createDragon(DragonType.Red), Tile.createDragon(DragonType.Red), Tile.createDragon(DragonType.Red)]
// ];

// const isDaisangen = Daisangen.verifyDaisangen(hand, melds);
// console.log(isDaisangen); // 输出: true

// // 非大三元示例（缺少一种三元牌）
// const hand2 = [
//     Tile.createDragon(DragonType.White), Tile.createDragon(DragonType.White), Tile.createDragon(DragonType.White),
//     Tile.createDragon(DragonType.Green), Tile.createDragon(DragonType.Green), Tile.createDragon(DragonType.Green),
//     Tile.createMan(1), Tile.createMan(2), Tile.createMan(3),
//     Tile.createMan(4), Tile.createMan(5)
// ];
// const melds2 = [
//     [Tile.createMan(6), Tile.createMan(7), Tile.createMan(8)]
// ];

// const isNotDaisangen = Daisangen.verifyDaisangen(hand2, melds2);
// console.log(isNotDaisangen); // 输出: false


// // 独立检查是否为大三元和牌
// console.log("是否为大三元:", Daisangen.verifyDaisangen(hand, melds));

// // 独立检查是否为大三元听牌
// console.log("是否为大三元听牌:", Daisangen.isDaisangenTenpai(hand, melds));

// // 独立获取大三元听牌的待牌
// console.log("大三元听牌的待牌:", Daisangen.getDaisangenWaitingTiles(hand, melds).map(tile => tile.toString()));

// // 一次性获取完整的状态信息
// const state = Daisangen.checkDaisangenState(hand, melds);
// console.log("完整状态:", state);