
import { Tile, TileType } from "../Tile";
// 实现九莲宝灯的检查逻辑
export class Chuuren {
    public static verifyChuuren(hand: Tile[]): boolean {
        // 检查手牌数量是否为14张
        if (hand.length !== 14) {
            return false;
        }

        // 获取第一张牌的类型
        const firstTileType = hand[0].type;

        // 检查所有牌是否属于同一种数牌
        if (!hand.every(tile => tile.type === firstTileType) || 
            ![TileType.Man, TileType.Pin, TileType.Sou].includes(firstTileType)) {
            return false;
        }

        // 统计每个数字的出现次数
        const counts = new Array(10).fill(0); // 索引0不使用，1-9对应牌的数字
        hand.forEach(tile => counts[tile.value as number]++);

        // 检查是否符合九莲宝灯的基本构成
        const basePattern = [3, 1, 1, 1, 1, 1, 1, 1, 3];
        let extraTile = false;

        for (let i = 1; i <= 9; i++) {
            if (counts[i] < basePattern[i - 1]) {
                return false;
            } else if (counts[i] === basePattern[i - 1] + 1) {
                if (extraTile) {
                    return false; // 已经有一个额外的牌了，不能再有多余的牌
                }
                extraTile = true;
            } else if (counts[i] > basePattern[i - 1] + 1) {
                return false; // 某个数字的牌过多
            }
        }

        // 确保有且仅有一个额外的牌
        return extraTile;
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