import { Player } from "./Player";
import { Tile, TileType } from "./Tile";



interface YakuhaiResult {
    isYakuhai: boolean;
    dragonTriplets: Tile[][];
    windTriplets: Tile[][];
}




export class Yaku {
    // 已实现的役
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
    static checkPinfu(hand: Tile[], winningTile: Tile): boolean {
        // TODO: 实现平和的检查逻辑
        return false;
    }
 

    static checkIipeikou(hand: Tile[]): boolean {
        // TODO: 完善一杯口的检查逻辑
        // 需要检查是否有两个相同的顺子
        // 这里只是一个简化的示例
        const sequences = hand.filter(tile => tile.type !== TileType.Wind && tile.type !== TileType.Dragon);
        const sequenceStrings = sequences.map(tile => `${tile.type}${tile.value}`);
        return new Set(sequenceStrings).size < sequenceStrings.length;
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



    static checkSanshokuDoujun(hand: Tile[]): boolean {
        // TODO: 实现三色同顺的检查逻辑
        return false;
    }

    static checkIttsu(hand: Tile[]): boolean {
        // TODO: 实现一气通贯的检查逻辑
        return false;
    }

    static checkSanshokuDouko(hand: Tile[]): boolean {
        // TODO: 实现三色同刻的检查逻辑
        return false;
    }

    static checkSanankou(hand: Tile[]): boolean {
        // TODO: 实现三暗刻的检查逻辑
        return false;
    }

    static checkShousangen(hand: Tile[]): boolean {
        // TODO: 实现小三元的检查逻辑
        return false;
    }

    static checkHonitsu(hand: Tile[]): boolean {
        // TODO: 实现混一色的检查逻辑
        return false;
    }

    static checkChinitsu(hand: Tile[]): boolean {
        // TODO: 实现清一色的检查逻辑
        return false;
    }

    static checkRyanpeikou(hand: Tile[]): boolean {
        // TODO: 实现两杯口的检查逻辑
        return false;
    }

    static checkJunchan(hand: Tile[]): boolean {
        // TODO: 实现纯全带幺九的检查逻辑
        return false;
    }

    static checkHonroutou(hand: Tile[]): boolean {
        // TODO: 实现混老头的检查逻辑
        return false;
    }

    static checkSuuankou(hand: Tile[]): boolean {
        // TODO: 实现四暗刻的检查逻辑
        return false;
    }

    static checkDaisangen(hand: Tile[]): boolean {
        // TODO: 实现大三元的检查逻辑
        return false;
    }

    static checkKokushimusou(hand: Tile[]): boolean {
        // TODO: 实现国士无双的检查逻辑
        return false;
    }

    static checkSuushiihou(hand: Tile[]): boolean {
        // TODO: 实现四喜和的检查逻辑
        return false;
    }

    static checkChuuren(hand: Tile[]): boolean {
        // TODO: 实现九莲宝灯的检查逻辑
        return false;
    }

    static checkRyuuiisou(hand: Tile[]): boolean {
        // TODO: 实现绿一色的检查逻辑
        return false;
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