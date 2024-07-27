
import { Tile, TileType } from "../Tile";
// 实现混一色的检查逻辑


export class Honitsu {
    public static verifyHonitsu(hand: Tile[], melds: Tile[][]): boolean {
        // 展开嵌套数组
        const meldTiles = melds.reduce((acc, meld) => acc.concat(meld), []);
        
        // 检查总牌数是否为14张
        const totalTiles = hand.length + meldTiles.length;
        if (totalTiles !== 14) {
            return false;
        }

        // 获取所有牌
        const allTiles = [...hand, ...meldTiles];

        // 分离数牌和字牌
        const numberTiles = allTiles.filter(tile => tile.type === TileType.Man || tile.type === TileType.Pin || tile.type === TileType.Sou);
        const honorTiles = allTiles.filter(tile => tile.type === TileType.Wind || tile.type === TileType.Dragon);

        // 如果没有字牌，则不是混一色
        if (honorTiles.length === 0) {
            return false;
        }

        // 获取第一张数牌的类型
        const firstNumberTileType = numberTiles.length > 0 ? numberTiles[0].type : null;

        // 检查是否所有数牌都是同一种类型
        const isSingleSuit = numberTiles.every(tile => tile.type === firstNumberTileType);

        // 如果所有数牌都是同一种类型并且有字牌，则是混一色
        return isSingleSuit && honorTiles.length > 0;
    }
}


// 首先检查总牌数（手牌 + 鸣牌）是否为14张。
// 将手牌和鸣牌合并到一个数组中。
// 分离数牌（万子、筒子、索子）和字牌（风牌、三元牌）。
// 如果没有字牌，则不是混一色。
// 获取第一张数牌的类型。
// 检查是否所有数牌都是同一种类型。
// 如果所有数牌都是同一种类型并且有字牌，则返回 true，表示是混一色。

// // 混一色示例（万子和字牌）
// const hand = [
//     Tile.createMan(1), Tile.createMan(1), Tile.createMan(1),
//     Tile.createMan(2), Tile.createMan(3), Tile.createMan(4),
//     Tile.createMan(5), Tile.createMan(6), Tile.createMan(7),
//     Tile.createWind(WindType.East), Tile.createWind(WindType.East)
// ];
// const melds = [
//     [Tile.createMan(9), Tile.createMan(9), Tile.createMan(9)]
// ];

// const isHonitsu = Honitsu.verifyHonitsu(hand, melds);
// console.log(isHonitsu); // 输出: true

// // 非混一色示例（只有数牌，没有字牌）
// const hand2 = [
//     Tile.createMan(1), Tile.createMan(1), Tile.createMan(1),
//     Tile.createMan(2), Tile.createMan(3), Tile.createMan(4),
//     Tile.createMan(5), Tile.createMan(6), Tile.createMan(7),
//     Tile.createMan(8), Tile.createMan(9)
// ];
// const melds2 = [
//     [Tile.createMan(9), Tile.createMan(9), Tile.createMan(9)]
// ];

// const isNotHonitsu = Honitsu.verifyHonitsu(hand2, melds2);
// console.log(isNotHonitsu); // 输出: false