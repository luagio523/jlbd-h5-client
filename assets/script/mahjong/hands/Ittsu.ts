
import { Tile, TileType } from "../Tile";
// 实现一气通贯的检查逻辑

export class Ittsu {
    public static verifyIttsu(hand: Tile[], melds: Tile[][]): boolean {
        // 展开嵌套数组
        const meldTiles = melds.reduce((acc, meld) => acc.concat(meld), []);
        
        // 检查总牌数是否为14张
        const totalTiles = hand.length + meldTiles.length;
        if (totalTiles !== 14) {
            return false;
        }

        // 获取所有牌
        const allTiles = [...hand, ...meldTiles];

        // 分别检查万、筒、索三种花色
        return this.checkSuit(allTiles, TileType.Man) ||
               this.checkSuit(allTiles, TileType.Pin) ||
               this.checkSuit(allTiles, TileType.Sou);
    }

    private static checkSuit(tiles: Tile[], suitType: TileType): boolean {
        // 过滤出指定花色的牌
        const suitTiles = tiles.filter(tile => tile.type === suitType);

        // 创建一个数组来记录每个数字的出现情况
        const numbers = new Array(10).fill(false); // 索引0不使用

        // 标记出现的数字
        suitTiles.forEach(tile => {
            numbers[tile.value as number] = true;
        });

        // 检查是否存在1-9的连续序列
        return numbers.slice(1).every(exists => exists);
    }
}


// 首先检查总牌数（手牌 + 鸣牌）是否为14张。
// 将手牌和鸣牌合并到一个数组中。
// 分别检查万、筒、索三种花色是否存在一气通贯。
// 对于每种花色，我们过滤出该花色的所有牌。
// 创建一个数组来记录每个数字（1-9）的出现情况。
// 遍历该花色的所有牌，标记出现的数字。
// 检查是否存在1-9的连续序列。
// 如果任何一种花色存在一气通贯，则返回 true。
// // 一气通贯示例（万子）
// const hand = [
//     Tile.createMan(1), Tile.createMan(2), Tile.createMan(3),
//     Tile.createMan(4), Tile.createMan(5), Tile.createMan(6),
//     Tile.createMan(7), Tile.createMan(8), Tile.createMan(9),
//     Tile.createPin(1), Tile.createPin(1)
// ];
// const melds = [
//     [Tile.createSou(1), Tile.createSou(1), Tile.createSou(1)]
// ];

// const isIttsu = Ittsu.verifyIttsu(hand, melds);
// console.log(isIttsu); // 输出: true

// // 非一气通贯示例
// const hand2 = [
//     Tile.createMan(1), Tile.createMan(2), Tile.createMan(3),
//     Tile.createMan(4), Tile.createMan(5), Tile.createMan(6),
//     Tile.createMan(7), Tile.createMan(8), Tile.createPin(9),
//     Tile.createPin(1), Tile.createPin(1)
// ];
// const melds2 = [
//     [Tile.createSou(1), Tile.createSou(1), Tile.createSou(1)]
// ];

// const isNotIttsu = Ittsu.verifyIttsu(hand2, melds2);
// console.log(isNotIttsu); // 输出: false

