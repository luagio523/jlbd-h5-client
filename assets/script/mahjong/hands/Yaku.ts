import { Player } from "../Player";
import { DragonType, Tile, TileType, WindType } from "../Tile";

// 七对子，清一色，九宝莲灯，大三元，混一色，混老头，一杯口，一气通贯，纯全带幺九，国士无双，两杯口，绿一色，三暗刻，三色通顺，三色同刻，小三元，四暗刻，大四喜，小四喜，对对和。

interface YakuhaiResult {
    isYakuhai: boolean;
    dragonTriplets: Tile[][];
    windTriplets: Tile[][];
}

/**
 * hand - 手牌 包含[别人出牌+自摸]
 * winningTile - 别人出牌或自摸金章
 * melds - 副露
 * playerWind - 玩家风
 * roundWind - 场风
 */
export class Yaku {
    //胡牌
    static canWin(hand: Tile[], melds: Tile[][]): boolean {
        
        return false;
    }

    // 已实现的役 立直
    static checkRiichi(player: Player): boolean {
        return player.riichi;
    }
    // 检查断幺九
    static checkTanyao(hand: Tile[]): boolean {
        return hand.every(tile => !tile.isTerminal() && !tile.isHonor());
    }
   
    /**
     * 检查役牌的逻辑
     * @param hand 手牌数组
     * @param melds 副露数组
     * @param playerWind 玩家风
     * @param roundWind 圆风
     * @returns 役牌检查结果
     */
    static checkYakuhai(hand: Tile[], melds: Tile[][], playerWind: WindType, roundWind: WindType): YakuhaiResult {
        const allTiles = [...hand, ...melds.reduce((acc, meld) => acc.concat(meld), [])]; // 合并手牌和副露
        const dragonTriplets: Tile[][] = [];
        const windTriplets: Tile[][] = [];

        // 检查三元牌
        this.checkTriplet(allTiles, TileType.Dragon, [DragonType.White, DragonType.Green, DragonType.Red], dragonTriplets);
        
        // 检查风牌
        this.checkTriplet(allTiles, TileType.Wind, [playerWind, roundWind], windTriplets);

        return {
            isYakuhai: dragonTriplets.length > 0 || windTriplets.length > 0,
            dragonTriplets,
            windTriplets
        };
    }

    /**
     * 检查特定类型的三张牌（刻子）
     * @param allTiles 所有牌
     * @param tileType 牌的类型
     * @param tileValues 牌的值数组
     * @param tripletStorage 存储找到的刻子
     */
    private static checkTriplet(allTiles: Tile[], tileType: TileType, tileValues: any[], tripletStorage: Tile[][]): void {
        tileValues.forEach(value => {
            const triplet = allTiles.filter(tile => tile.type === tileType && tile.value === value);
            if (triplet.length >= 3) {
                tripletStorage.push(triplet);
            }
        });
    }

   
}



// // 使用示例

// const hand: Tile[] = [
//     new Tile(TileType.Dragon, DragonType.Red),
//     new Tile(TileType.Dragon, DragonType.Red),
//     new Tile(TileType.Dragon, DragonType.Red),
//     new Tile(TileType.Wind, WindType.East),
//     new Tile(TileType.Wind, WindType.East),
//     new Tile(TileType.Wind, WindType.East),
//     new Tile(TileType.Wind, WindType.South),
//     new Tile(TileType.Man, 1),
//     new Tile(TileType.Man, 2),
// ];

// const melds: Tile[][] = []; // 没有副露
// const playerWind: WindType = WindType.East; // 示例玩家风
// const roundWind: WindType = WindType.East; // 示例圈风

// // 检查役牌
// const result = YakuhaiChecker.checkYakuhai(hand, melds, playerWind, roundWind);
// console.log("是否为役牌:", result.isYakuhai);
// console.log("三元牌刻子:", result.dragonTriplets);
// console.log("风牌刻子:", result.windTriplets);



// // 示例使用
// const player = new Player();
// player.hand = [
//     new Tile(TileType.Dragon, 'White'),
//     new Tile(TileType.Dragon, 'White'),
//     new Tile(TileType.Dragon, 'White'),
//     new Tile(TileType.Wind, 'East'),
//     new Tile(TileType.Wind, 'East'),
//     new Tile(TileType.Wind, 'East'),
//     new Tile(TileType.Man, 1),
//     new Tile(TileType.Man, 2),
//     new Tile(TileType.Man, 3),
//     new Tile(TileType.Pin, 4),
//     new Tile(TileType.Pin, 5),
//     new Tile(TileType.Pin, 6),
//     new Tile(TileType.Sou, 7),
//     new Tile(TileType.Sou, 8)
// ];
// player.melds = [
//     [new Tile(TileType.Wind, 'South'), new Tile(TileType.Wind, 'South'), new Tile(TileType.Wind, 'South')]
// ];

// const result = Yaku.checkYakuhai(player.hand, player.melds, 'East', 'East');
// if (result.isYakuhai) {
//     console.log(`役牌成立！`);
//     console.log(`三元牌刻子数量: ${result.dragonTriplets.length}`);
//     console.log(`风牌刻子数量: ${result.windTriplets.length}`);
// }




// import { Tile, TileType } from "./Tile";
// import { Player } from "./Player";
// import { Yaku } from "./Yaku";

// const player = new Player();
// player.hand = [
//   new Tile(TileType.Man, 1),
//   new Tile(TileType.Man, 1),
//   new Tile(TileType.Man, 1),
//   new Tile(TileType.Man, 2),
//   new Tile(TileType.Man, 3),
//   new Tile(TileType.Pin, 4),
//   new Tile(TileType.Pin, 4),
//   new Tile(TileType.Pin, 4),
//   new Tile(TileType.Sou, 7),
//   new Tile(TileType.Sou, 8),
//   new Tile(TileType.Sou, 9),
//   new Tile(TileType.Dragon, 'White'),
//   new Tile(TileType.Dragon, 'White'),
//   new Tile(TileType.Dragon, 'White')
// ];

// const canWin = player.canDeclareWin();
// console.log(`玩家是否可以和牌: ${canWin}`);
