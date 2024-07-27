

import { Tile, TileType, WindType } from "../Tile";
//大四喜检查逻辑
export class Suushiihou {
    public static verifySuushiihou(hand: Tile[]): boolean {
        // 检查手牌数量是否为14张
        if (hand.length !== 14) {
            return false;
        }

        // 统计每种风牌的数量
        const windCounts: { [key in WindType]?: number } = {
            [WindType.East]: 0,
            [WindType.South]: 0,
            [WindType.West]: 0,
            [WindType.North]: 0
        };

        hand.forEach(tile => {
            if (tile.type === TileType.Wind) {
                windCounts[tile.value as WindType]++;
            }
        });

        // 检查每种风牌是否至少有3张
        for (const wind in windCounts) {
            if (windCounts[wind as WindType] < 3) {
                return false;
            }
        }

        return true;
    }
}


// 首先检查手牌数量是否为14张。
// 创建一个对象 windCounts 来统计每种风牌的数量。
// 遍历手牌，统计每种风牌的数量。
// 检查每种风牌的数量是否至少为3张。
// const hand = [
//     Tile.createWind(WindType.East), Tile.createWind(WindType.East), Tile.createWind(WindType.East),
//     Tile.createWind(WindType.South), Tile.createWind(WindType.South), Tile.createWind(WindType.South),
//     Tile.createWind(WindType.West), Tile.createWind(WindType.West), Tile.createWind(WindType.West),
//     Tile.createWind(WindType.North), Tile.createWind(WindType.North), Tile.createWind(WindType.North),
//     Tile.createMan(1), Tile.createMan(1)
// ];

// const isSuushiihou = Suushiihou.verifySuushiihou(hand);
// console.log(isSuushiihou); // 输出: true