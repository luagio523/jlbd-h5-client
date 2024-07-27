
import { Tile, TileType } from "../Tile";
// 实现三色同顺的检查逻辑

export class SanshokuDoujun {
    public static verifySanshokuDoujun(hand: Tile[], melds: Tile[][]): boolean {
        // 展开嵌套数组
        const meldTiles = melds.reduce((acc, meld) => acc.concat(meld), []);
        
        // 检查总牌数是否为14张
        const totalTiles = hand.length + meldTiles.length;
        if (totalTiles !== 14) {
            return false;
        }

        // 获取所有牌
        const allTiles = [...hand, ...meldTiles];

        // 统计每种牌的数量
        const tileCounts: { [key: string]: number } = {};
        allTiles.forEach(tile => {
            if (tile.type === TileType.Man || tile.type === TileType.Pin || tile.type === TileType.Sou) {
                const key = `${tile.type}-${tile.value}`;
                tileCounts[key] = (tileCounts[key] || 0) + 1;
            }
        });

        // 检查是否有三色同顺
        for (let value = 1; value <= 7; value++) {
            const manSeq = `${TileType.Man}-${value},${TileType.Man}-${value + 1},${TileType.Man}-${value + 2}`;
            const pinSeq = `${TileType.Pin}-${value},${TileType.Pin}-${value + 1},${TileType.Pin}-${value + 2}`;
            const souSeq = `${TileType.Sou}-${value},${TileType.Sou}-${value + 1},${TileType.Sou}-${value + 2}`;

            const manCount = tileCounts[`${TileType.Man}-${value}`] >= 1 && tileCounts[`${TileType.Man}-${value + 1}`] >= 1 && tileCounts[`${TileType.Man}-${value + 2}`] >= 1;
            const pinCount = tileCounts[`${TileType.Pin}-${value}`] >= 1 && tileCounts[`${TileType.Pin}-${value + 1}`] >= 1 && tileCounts[`${TileType.Pin}-${value + 2}`] >= 1;
            const souCount = tileCounts[`${TileType.Sou}-${value}`] >= 1 && tileCounts[`${TileType.Sou}-${value + 1}`] >= 1 && tileCounts[`${TileType.Sou}-${value + 2}`] >= 1;

            if (manCount && pinCount && souCount) {
                return true;
            }
        }

        return false;
    }
}



// 这个实现的逻辑如下：
// 首先检查总牌数（手牌 + 鸣牌）是否为14张。
// 将手牌和鸣牌合并到一个数组中。
// 统计每种数牌的数量，使用 "类型-数字" 作为键。
// 遍历所有可能的起始数字（1-7），检查是否存在三种花色都有相同顺子的情况。
// 如果找到一组满足条件的三色同顺，则返回 true。
// // 三色同顺示例
// const hand = [
//     Tile.createMan(1), Tile.createMan(2), Tile.createMan(3),
//     Tile.createPin(1), Tile.createPin(2), Tile.createPin(3),
//     Tile.createSou(1), Tile.createSou(2), Tile.createSou(3),
//     Tile.createWind(WindType.East), Tile.createWind(WindType.East)
// ];
// const melds = [
//     [Tile.createDragon(DragonType.White), Tile.createDragon(DragonType.White), Tile.createDragon(DragonType.White)]
// ];

// const isSanshokuDoujun = SanshokuDoujun.verifySanshokuDoujun(hand, melds);
// console.log(isSanshokuDoujun); // 输出: true

// // 非三色同顺示例
// const hand2 = [
//     Tile.createMan(1), Tile.createMan(2), Tile.createMan(3),
//     Tile.createPin(1), Tile.createPin(2), Tile.createPin(3),
//     Tile.createSou(4), Tile.createSou(5), Tile.createSou(6),
//     Tile.createWind(WindType.East), Tile.createWind(WindType.East)
// ];
// const melds2 = [
//     [Tile.createDragon(DragonType.White), Tile.createDragon(DragonType.White), Tile.createDragon(DragonType.White)]
// ];

// const isNotSanshokuDoujun = SanshokuDoujun.verifySanshokuDoujun(hand2, melds2);
// console.log(isNotSanshokuDoujun); // 输出: false