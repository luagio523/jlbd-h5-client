
import { Tile, TileType, DragonType } from "../Tile";
//大三元
export class Daisangen {
    public static verifyDaisangen(hand: Tile[], melds: Tile[][]): boolean {
        // 展开嵌套数组
        const meldTiles = melds.reduce((acc, meld) => acc.concat(meld), []);
        
        // 检查总牌数是否为14张
        const totalTiles = hand.length + meldTiles.length;
        if (totalTiles !== 14) {
            return false;
        }

        // 统计三元牌的数量
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

        // 统计鸣牌中的三元牌
        melds.forEach(meld => {
            if (meld[0].type === TileType.Dragon) {
                dragonCounts[meld[0].value as DragonType] += meld.length;
            }
        });

        // 检查每种三元牌是否都至少有3张
        for (const count of Object.values(dragonCounts)) {
            if (count < 3) {
                return false;
            }
        }

        // 如果所有三元牌都至少有3张，则是大三元
        return true;
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