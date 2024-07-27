//小三元


import { Tile, TileType, DragonType } from "../Tile";


export class Shousangen {
    public static verifyShousangen(hand: Tile[], melds: Tile[][]): boolean {
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
        meldTiles.forEach(tile => {
            if (tile.type === TileType.Dragon) {
                dragonCounts[tile.value as DragonType]++;
            }
        });

        let dragonTriples = 0;
        let dragonPair = 0;

        for (const count of Object.values(dragonCounts)) {
            if (count === 2) {
                dragonPair++;
            } else if (count === 3) {
                dragonTriples++;
            } else if (count === 0) {
                // 允许一种三元牌不存在
                continue;
            } else {
                // 如果有单张三元牌或超过3张，不符合小三元
                return false;
            }
        }

        // 小三元必须有2个三元牌的刻子和1对三元牌的雀头
        return dragonTriples === 2 && dragonPair === 1;
    }
}



// 首先检查手牌和鸣牌是否为14张。
//手牌和鸣牌中的三元牌。
// 创建一个对象 dragonCounts 来统计每种三元牌（白、发、中）的数量。
// 遍历手牌，统计三元牌的数量。
// 检查三元牌的组成：
// 必须有两组三张的三元牌（刻子）
// 必须有一对三元牌（雀头）
// 允许一种三元牌不存在
// 如果满足以上条件，则返回 true，否则返回 false。


// // 小三元示例
// const hand2 = [
//     Tile.createDragon(DragonType.White), Tile.createDragon(DragonType.White),
//     Tile.createDragon(DragonType.Green), Tile.createDragon(DragonType.Green), Tile.createDragon(DragonType.Green),
//     Tile.createMan(1), Tile.createMan(2), Tile.createMan(3),
//     Tile.createPin(4), Tile.createPin(5), Tile.createPin(6)
// ];
// const melds2 = [
//     [Tile.createDragon(DragonType.Red), Tile.createDragon(DragonType.Red), Tile.createDragon(DragonType.Red)]
// ];
// console.log(Shousangen.verifyShousangen(hand2, melds2)); // 输出: true