

import { Tile, TileType, WindType } from "../Tile";

/**
 * 大四喜（Suushiihou）判定类
 * 大四喜需要包含四种风牌的刻子（或杠），可以是手牌中的暗刻或者副露的明刻/杠
 */
export class Suushiihou {
    /**
     * 验证是否为大四喜和牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 是否为大四喜和牌
     */
    public static verifySuushiihou(hand: Tile[], melds: Tile[][]): boolean {
        return this.checkSuushiihou(hand, melds).isComplete;
    }

    /**
     * 检查是否为大四喜听牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 是否为大四喜听牌
     */
    public static isSuushiihouTenpai(hand: Tile[], melds: Tile[][]): boolean {
        return this.checkSuushiihou(hand, melds).isTenpai;
    }

    /**
     * 获取大四喜听牌时的待牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 待牌数组
     */
    public static getSuushiihouWaitingTiles(hand: Tile[], melds: Tile[][]): Tile[] {
        const { isTenpai, waitingTiles } = this.checkSuushiihou(hand, melds);
        return isTenpai ? waitingTiles : [];
    }

    /**
     * 检查大四喜的状态
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 包含完成状态、听牌状态和待牌的对象
     */
    private static checkSuushiihou(hand: Tile[], melds: Tile[][]): { 
        isComplete: boolean; 
        isTenpai: boolean; 
        waitingTiles: Tile[] 
    } {
        const totalTiles = hand.length + melds.reduce((sum, meld) => sum + meld.length, 0);
        if (totalTiles !== 14) {
            return { isComplete: false, isTenpai: false, waitingTiles: [] };
        }

        const windCounts: Record<WindType, number> = {
            [WindType.East]: 0,
            [WindType.South]: 0,
            [WindType.West]: 0,
            [WindType.North]: 0
        };

        let otherTilesCount = 0;

        // 统计手牌中的风牌
        for (const tile of hand) {
            if (tile.type === TileType.Wind) {
                windCounts[tile.value as WindType]++;
            } else {
                otherTilesCount++;
            }
        }

        // 统计副露中的风牌
        for (const meld of melds) {
            if (meld[0].type === TileType.Wind) {
                windCounts[meld[0].value as WindType] += meld.length;
            } else {
                otherTilesCount += meld.length;
            }
        }

        let tripletCount = 0;
        let pairCount = 0;
        let singleCount = 0;
        const waitingTiles: Tile[] = [];

        for (const wind in windCounts) {
            const count = windCounts[wind as WindType];
            if (count >= 3) tripletCount++;
            else if (count === 2) {
                pairCount++;
                waitingTiles.push(Tile.createWind(wind as WindType));
            }
            else if (count === 1) {
                singleCount++;
                waitingTiles.push(Tile.createWind(wind as WindType));
                waitingTiles.push(Tile.createWind(wind as WindType));
            }
        }

        const isComplete = tripletCount === 4 && otherTilesCount === 2;
        const isTenpai = (tripletCount === 3 && pairCount === 1 && otherTilesCount === 1) || 
                         (tripletCount === 3 && singleCount === 1 && otherTilesCount === 2);

        return { isComplete, isTenpai, waitingTiles };
    }
}





// // 使用示例

// // 创建一个大四喜和牌的情况（包括手牌和副露）
// const completeHand: Tile[] = [
//     Tile.createWind(WindType.East), Tile.createWind(WindType.East), Tile.createWind(WindType.East),
//     Tile.createWind(WindType.South), Tile.createWind(WindType.South), Tile.createWind(WindType.South),
//     Tile.createMan(1), Tile.createMan(1)
// ];
// const completeMelds: Tile[][] = [
//     [Tile.createWind(WindType.West), Tile.createWind(WindType.West), Tile.createWind(WindType.West)],
//     [Tile.createWind(WindType.North), Tile.createWind(WindType.North), Tile.createWind(WindType.North)]
// ];

// // 创建一个大四喜听牌的情况
// const tenpaiHand: Tile[] = [
//     Tile.createWind(WindType.East), Tile.createWind(WindType.East), Tile.createWind(WindType.East),
//     Tile.createWind(WindType.South), Tile.createWind(WindType.South),
//     Tile.createWind(WindType.West), Tile.createWind(WindType.West),
//     Tile.createMan(1)
// ];
// const tenpaiMelds: Tile[][] = [
//     [Tile.createWind(WindType.North), Tile.createWind(WindType.North), Tile.createWind(WindType.North)]
// ];

// console.log("是否为大四喜和牌:", Suushiihou.verifySuushiihou(completeHand, completeMelds));
// console.log("是否为大四喜听牌:", Suushiihou.isSuushiihouTenpai(tenpaiHand, tenpaiMelds));
// console.log("大四喜听牌的待牌:", Suushiihou.getSuushiihouWaitingTiles(tenpaiHand, tenpaiMelds).map(tile => tile.toString()));

// // 输出结果：
// // 是否为大四喜和牌: true
// // 是否为大四喜听牌: true
// // 大四喜听牌的待牌: ['South', 'West']
