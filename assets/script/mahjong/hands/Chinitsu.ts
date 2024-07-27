
import { Tile, TileType } from "../Tile";
// 清一色


export class Chinitsu {
    public static verifyChinitsu(hand: Tile[], melds: Tile[][]): boolean {
        // 展开嵌套数组
        const meldTiles = melds.reduce((acc, meld) => acc.concat(meld), []);
        
        // 检查总牌数是否为14张
        const totalTiles = hand.length + meldTiles.length;
        if (totalTiles !== 14) {
            return false;
        }

        // 获取所有牌
        const allTiles = [...hand, ...meldTiles];

        // 检查是否所有牌都是数牌
        if (!allTiles.every(tile => tile.type === TileType.Man || tile.type === TileType.Pin || tile.type === TileType.Sou)) {
            return false;
        }

        // 获取第一张牌的类型
        const firstTileType = allTiles[0].type;

        // 检查是否所有牌都是同一种类型
        return allTiles.every(tile => tile.type === firstTileType);
    }
}



// 首先检查总牌数（手牌 + 鸣牌）是否为14张。
// 将手牌和鸣牌合并到一个数组中。
// 检查是否所有牌都是数牌（万子、筒子或索子），如果有字牌则不是清一色。
// 获取第一张牌的类型。
// 检查是否所有牌都是同一种类型（都是万子、都是筒子或都是索子）。


// // 清一色示例（全是万子）
// const hand = [
//     Tile.createMan(1), Tile.createMan(1), Tile.createMan(1),
//     Tile.createMan(2), Tile.createMan(3), Tile.createMan(4),
//     Tile.createMan(5), Tile.createMan(6), Tile.createMan(7),
//     Tile.createMan(8), Tile.createMan(9)
// ];
// const melds = [
//     [Tile.createMan(9), Tile.createMan(9), Tile.createMan(9)]
// ];

// const isChinitsu = Chinitsu.verifyChinitsu(hand, melds);
// console.log(isChinitsu); // 输出: true

// // 非清一色示例（包含字牌）
// const hand2 = [
//     Tile.createMan(1), Tile.createMan(1), Tile.createMan(1),
//     Tile.createMan(2), Tile.createMan(3), Tile.createMan(4),
//     Tile.createMan(5), Tile.createMan(6), Tile.createMan(7),
//     Tile.createMan(8), Tile.createWind(WindType.East)
// ];
// const melds2 = [
//     [Tile.createMan(9), Tile.createMan(9), Tile.createMan(9)]
// ];

// const isNotChinitsu = Chinitsu.verifyChinitsu(hand2, melds2);
// console.log(isNotChinitsu); // 输出: false