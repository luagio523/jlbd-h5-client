
import { Tile, TileType } from "../Tile";
// 实现三色同刻的检查逻辑


export class SanshokuDouko {
    public static verifySanshokuDouko(hand: Tile[], melds: Tile[][]): boolean {
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

        // 检查是否有三色同刻
        for (let value = 1; value <= 9; value++) {
            const manCount = tileCounts[`${TileType.Man}-${value}`] || 0;
            const pinCount = tileCounts[`${TileType.Pin}-${value}`] || 0;
            const souCount = tileCounts[`${TileType.Sou}-${value}`] || 0;

            if (manCount >= 3 && pinCount >= 3 && souCount >= 3) {
                return true;
            }
        }

        return false;
    }
}



// 首先检查总牌数（手牌 + 鸣牌）是否为14张。
// 将手牌和鸣牌合并到一个数组中。
// 统计每种数牌的数量，使用 "类型-数字" 作为键。
// 遍历所有可能的数字（1-9），检查是否存在三种花色都有至少3张的情况。
// 如果找到一组满足条件的三色同刻，则返回 true。
// // 三色同刻示例
// const hand = [
//     Tile.createMan(3), Tile.createMan(3), Tile.createMan(3),
//     Tile.createPin(3), Tile.createPin(3), Tile.createPin(3),
//     Tile.createSou(3), Tile.createSou(3), Tile.createSou(3),
//     Tile.createWind(WindType.East), Tile.createWind(WindType.East)
// ];
// const melds = [
//     [Tile.createDragon(DragonType.White), Tile.createDragon(DragonType.White), Tile.createDragon(DragonType.White)]
// ];

// const isSanshokuDouko = SanshokuDouko.verifySanshokuDouko(hand, melds);
// console.log(isSanshokuDouko); // 输出: true

// // 非三色同刻示例
// const hand2 = [
//     Tile.createMan(3), Tile.createMan(3), Tile.createMan(3),
//     Tile.createPin(3), Tile.createPin(3), Tile.createPin(3),
//     Tile.createSou(4), Tile.createSou(4), Tile.createSou(4),
//     Tile.createWind(WindType.East), Tile.createWind(WindType.East)
// ];
// const melds2 = [
//     [Tile.createDragon(DragonType.White), Tile.createDragon(DragonType.White), Tile.createDragon(DragonType.White)]
// ];

// const isNotSanshokuDouko = SanshokuDouko.verifySanshokuDouko(hand2, melds2);
// console.log(isNotSanshokuDouko); // 输出: false