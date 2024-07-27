import { Player } from "./Player";
import { Tile, TileType, WindType } from "./Tile";
import { Winning } from "./Winning";
import { Chinitsu } from "./hands/Chinitsu";
import { Chuuren } from "./hands/Chuuren";
import { Daisangen } from "./hands/Daisangen";
import { Honitsu } from "./hands/Honitsu";
import { Honroutou } from "./hands/Honroutou";
import { Ittsu } from "./hands/Ittsu";
import { Junchan } from "./hands/Junchan";
import { KokushiMusou } from "./hands/KokushiMusou";
import { Peikou } from "./hands/Peikou";
import { Pinfu } from "./hands/Pinfu";
import { Ryuuiisou } from "./hands/Ryuuiisou";
import { Sanankou } from "./hands/Sanankou";
import { SanshokuDoujun } from "./hands/SanshokuDoujun";
import { SanshokuDouko } from "./hands/SanshokuDouko";
import { Shousangen } from "./hands/Shousangen";
import { Suuankou } from "./hands/Suuankou";
import { Suushiihou } from "./hands/Suushiihou";



interface YakuhaiResult {
    isYakuhai: boolean;
    dragonTriplets: Tile[][];
    windTriplets: Tile[][];
}


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
    // 检查对对和
    static checkToitoi(hand: Tile[]): boolean {
        const groups = this.groupTiles(hand);
        return groups.every(group => group.length >= 3 && group[0].value === group[1].value);
    }
    // 检查七对子
    static checkChiitoi(hand: Tile[]): boolean {
        if (hand.length !== 14) return false;
        const pairs = new Set(hand.map(tile => `${tile.type}${tile.value}`));
        return pairs.size === 7;
    }

    // 需要实现或完善的役
    static checkPinfu(hand: Tile[], winningTile: Tile,  playerWind: WindType, roundWind: WindType): boolean {
        // TODO: 实现平和的检查逻辑
        return Pinfu.verifyPinfu(hand, winningTile,playerWind,roundWind);
    }
 

    static checkIipeikou(hand: Tile[], melds: Tile[][]): boolean {
       return Peikou.verifyIipeikou(hand,melds);
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

    // 实现三色同顺的检查逻辑
    static checkSanshokuDoujun(hand: Tile[], melds: Tile[][]): boolean {
        return SanshokuDoujun.verifySanshokuDoujun(hand, melds);
    }
    //实现一气通贯的检查逻辑
    static checkIttsu(hand: Tile[], melds: Tile[][]): boolean {
        return Ittsu.verifyIttsu(hand, melds);
    }
    //实现三色同刻的检查逻辑
    static checkSanshokuDouko(hand: Tile[], melds: Tile[][]): boolean {
        return SanshokuDouko.verifySanshokuDouko(hand, melds);
    }
    // 三暗刻的检查逻辑
    static checkSanankou(hand: Tile[], melds: Tile[][]): boolean {
        return Sanankou.verifySanankou(hand, melds);
    }
     // 小三元的检查逻辑
    static checkShousangen(hand: Tile[], melds: Tile[][]): boolean {
        return Shousangen.verifyShousangen(hand, melds);
    }
    //实现混一色的检查逻辑
    static checkHonitsu(hand: Tile[], melds: Tile[][]): boolean {
        return Honitsu.verifyHonitsu(hand, melds);
    }
    //实现清一色的检查逻辑
    static checkChinitsu(hand: Tile[], melds: Tile[][]): boolean {
        return Chinitsu.verifyChinitsu(hand, melds);
    }
     //  实现两杯口的检查逻辑
    static checkRyanpeikou(hand: Tile[], melds: Tile[][]): boolean {
        return Peikou.verifyRyanpeikou(hand, melds);
    }
    //纯全带幺九的检查逻辑
    static checkJunchan(hand: Tile[], melds: Tile[][]): boolean {
        return Junchan.verifyJunchan(hand, melds);
    }
    // 混老头的检查逻辑
    static checkHonroutou(hand: Tile[], melds: Tile[][]): boolean {
        return Honroutou.verifyHonroutou(hand, melds);
    }

    //四暗刻的检查逻辑
    static checkSuuankou(hand: Tile[], melds: Tile[][]): boolean {
        return Suuankou.verifySuuankou(hand, melds);
    }

    //大三元
    static checkDaisangen(hand: Tile[], melds: Tile[][]): boolean {
        return Daisangen.verifyDaisangen(hand, melds);
    }
    
    //国士无双的检查逻辑
    static checkKokushimusou(hand: Tile[], melds: Tile[][]): boolean {
        return KokushiMusou.verifyKokushiMusou(hand)
    }
    //大四喜
    static checkSuushiihou(hand: Tile[], melds: Tile[][]): boolean {
        return Suushiihou.verifySuushiihou(hand)
    }
    //实现九莲宝灯
    static checkChuuren(hand: Tile[], melds: Tile[][]): boolean {
        return Chuuren.verifyChuuren(hand)
    }
    // 绿一色的检查逻辑
    static checkRyuuiisou(hand: Tile[], melds: Tile[][]): boolean {
        return Ryuuiisou.verifyRyuuiisou(hand, melds);
    }

    // 辅助方法
    private static groupTiles(hand: Tile[]): Tile[][] {
        const groups: { [key: string]: Tile[] } = {};
        hand.forEach(tile => {
            const key = `${tile.type}${tile.value}`;
            if (!groups[key]) groups[key] = [];
            groups[key].push(tile);
        });
        return Object.values(groups);
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
