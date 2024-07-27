
import { Tile, TileType } from "../Tile";
//混老头
export class Honroutou {
    public static verifyHonroutou(hand: Tile[], melds: Tile[][]): boolean {
        // 展开嵌套数组
        const meldTiles = melds.reduce((acc, meld) => acc.concat(meld), []);
        
        // 检查总牌数是否为14张
        const totalTiles = hand.length + meldTiles.length;
        if (totalTiles !== 14) {
            return false;
        }

        // 获取所有牌
        const allTiles = [...hand, ...meldTiles];

        // 检查是否所有牌都是幺九牌或字牌
        const isYaochuuOrHonor = (tile: Tile): boolean => {
            if (tile.type === TileType.Wind || tile.type === TileType.Dragon) {
                return true;
            }
            if ((tile.type === TileType.Man || tile.type === TileType.Pin || tile.type === TileType.Sou) && 
                (tile.value === 1 || tile.value === 9)) {
                return true;
            }
            return false;
        };

        // 检查所有牌
        for (const tile of allTiles) {
            if (!isYaochuuOrHonor(tile)) {
                return false;
            }
        }

        // 如果所有牌都通过了检查，则是混老头
        return true;
    }
}



// 这个实现的逻辑如下：
// 首先检查总牌数（手牌 + 鸣牌）是否为14张。
// 将手牌和鸣牌合并到一个数组中。
// 创建一个辅助函数 isYaochuuOrHonor 来检查单张牌是否是幺九牌或字牌。
// 遍历所有牌，检查是否都是幺九牌或字牌。
// 如果所有牌都通过了检查，则返回 true，表示是混老头。
// // 混老头示例
// const hand = [
//     Tile.createMan(1), Tile.createMan(1), Tile.createMan(1),
//     Tile.createMan(9), Tile.createMan(9), Tile.createMan(9),
//     Tile.createPin(1), Tile.createPin(1), Tile.createPin(1),
//     Tile.createWind(WindType.East), Tile.createWind(WindType.East)
// ];
// const melds = [
//     [Tile.createDragon(DragonType.White), Tile.createDragon(DragonType.White), Tile.createDragon(DragonType.White)]
// ];

// const isHonroutou = Honroutou.verifyHonroutou(hand, melds);
// console.log(isHonroutou); // 输出: true

// // 非混老头示例（包含中张牌）
// const hand2 = [
//     Tile.createMan(1), Tile.createMan(1), Tile.createMan(1),
//     Tile.createMan(2), Tile.createMan(3), Tile.createMan(4),
//     Tile.createMan(9), Tile.createMan(9), Tile.createMan(9),
//     Tile.createWind(WindType.East), Tile.createWind(WindType.East)
// ];
// const melds2 = [
//     [Tile.createDragon(DragonType.White), Tile.createDragon(DragonType.White), Tile.createDragon(DragonType.White)]
// ];

// const isNotHonroutou = Honroutou.verifyHonroutou(hand2, melds2);
// console.log(isNotHonroutou); // 输出: false