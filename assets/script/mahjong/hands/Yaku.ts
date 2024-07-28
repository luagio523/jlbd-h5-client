import { Player } from "../Player";
import { Tile, TileType } from "../Tile";

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
   
    //役牌的检查逻辑
    static checkYakuhai(hand: Tile[], melds: Tile[][], playerWind: string, roundWind: string): YakuhaiResult {
        const allTiles = hand.concat(...melds);
        const dragonTriplets: Tile[][] = [];
        const windTriplets: Tile[][] = [];

        const checkTriplet = (tileType: TileType, tileValue: any): Tile[] | null => {
            const triplet = allTiles.filter(t => t.type === tileType && t.value === tileValue);
            return triplet.length >= 3 ? triplet : null;
        };

        // 检查三元牌
        ['White', 'Green', 'Red'].forEach(dragon => {
            const triplet = checkTriplet(TileType.Dragon, dragon);
            if (triplet) dragonTriplets.push(triplet);
        });

        // 检查风牌
        [playerWind, roundWind].forEach(wind => {
            const triplet = checkTriplet(TileType.Wind, wind);
            if (triplet) windTriplets.push(triplet);
        });

        return {
            isYakuhai: dragonTriplets.length > 0 || windTriplets.length > 0,
            dragonTriplets,
            windTriplets
        };
    }

   
}






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
