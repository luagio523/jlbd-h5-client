import { Tile, TileType } from "../Tile";


export class SanshokuDouko {
    /**
     * 验证是否为三色同刻和牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 是否为三色同刻和牌
     */
    public static verifySanshokuDouko(hand: Tile[], melds: Tile[][]): boolean {
        const tileCounts = this.countTiles(hand, melds);
        return this.checkSanshokuDouko(tileCounts).isComplete;
    }

    /**
     * 检查是否为三色同刻听牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 是否为三色同刻听牌
     */
    public static isSanshokuDoukoTenpai(hand: Tile[], melds: Tile[][]): boolean {
        const tileCounts = this.countTiles(hand, melds);
        return this.checkSanshokuDouko(tileCounts).isTenpai;
    }

    /**
     * 获取三色同刻听牌时的待牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 待牌数组
     */
    public static getSanshokuDoukoWaitingTiles(hand: Tile[], melds: Tile[][]): Tile[] {
        const tileCounts = this.countTiles(hand, melds);
        return this.checkSanshokuDouko(tileCounts).waitingTiles;
    }

    /**
     * 检查三色同刻的状态
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 包含完成状态、听牌状态和待牌的对象
     */
    public static checkSanshokuDoukoState(hand: Tile[], melds: Tile[][]): { 
        isComplete: boolean; 
        isTenpai: boolean; 
        waitingTiles: Tile[] 
    } {
        const tileCounts = this.countTiles(hand, melds);
        return this.checkSanshokuDouko(tileCounts);
    }

    /**
     * 统计牌的数量
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 牌数量统计对象
     */
    private static countTiles(hand: Tile[], melds: Tile[][]): { [key: string]: number } {
        const tileCounts: { [key: string]: number } = {};

        const countTile = (tile: Tile) => {
            if (tile.type === TileType.Man || tile.type === TileType.Pin || tile.type === TileType.Sou) {
                const key = `${tile.type}-${tile.value}`;
                tileCounts[key] = (tileCounts[key] || 0) + 1;
            }
        };

        hand.forEach(countTile);
        melds.forEach(meld => meld.forEach(countTile));

        return tileCounts;
    }

    /**
     * 检查三色同刻的状态
     * @param tileCounts 牌数量统计对象
     * @returns 包含完成状态、听牌状态和待牌的对象
     */
    private static checkSanshokuDouko(tileCounts: { [key: string]: number }): { 
        isComplete: boolean; 
        isTenpai: boolean; 
        waitingTiles: Tile[] 
    } {
        let isComplete = false;
        let isTenpai = false;
        const waitingTiles: Tile[] = [];

        for (let value = 1; value <= 9; value++) {
            const manCount = tileCounts[`${TileType.Man}-${value}`] || 0;
            const pinCount = tileCounts[`${TileType.Pin}-${value}`] || 0;
            const souCount = tileCounts[`${TileType.Sou}-${value}`] || 0;

            if (manCount >= 3 && pinCount >= 3 && souCount >= 3) {
                isComplete = true;
                break;
            }

            const tripletCount = [manCount, pinCount, souCount].filter(count => count >= 3).length;
            const pairCount = [manCount, pinCount, souCount].filter(count => count === 2).length;

            if (tripletCount === 2 && pairCount === 1) {
                isTenpai = true;
                if (manCount === 2) waitingTiles.push(new Tile(TileType.Man, value));
                if (pinCount === 2) waitingTiles.push(new Tile(TileType.Pin, value));
                if (souCount === 2) waitingTiles.push(new Tile(TileType.Sou, value));
            }
        }

        return { isComplete, isTenpai, waitingTiles };
    }
}


// 使用示例

// // 创建一个三色同刻和牌的手牌和副露
// const completeHand: Tile[] = [
//     new Tile(TileType.Man, 3), new Tile(TileType.Man, 3), new Tile(TileType.Man, 3),
//     new Tile(TileType.Pin, 3), new Tile(TileType.Pin, 3), new Tile(TileType.Pin, 3),
//     new Tile(TileType.Sou, 3), new Tile(TileType.Sou, 3), new Tile(TileType.Sou, 3),
//     new Tile(TileType.Man, 1), new Tile(TileType.Man, 1),
//     new Tile(TileType.Pin, 1), new Tile(TileType.Pin, 1)
// ];
// const completeMelds: Tile[][] = [];

// // 创建一个三色同刻听牌的手牌和副露
// const tenpaiHand: Tile[] = [
//     new Tile(TileType.Man, 3), new Tile(TileType.Man, 3), new Tile(TileType.Man, 3),
//     new Tile(TileType.Pin, 3), new Tile(TileType.Pin, 3), new Tile(TileType.Pin, 3),
//     new Tile(TileType.Sou, 3), new Tile(TileType.Sou, 3),
//     new Tile(TileType.Man, 1), new Tile(TileType.Man, 1),
//     new Tile(TileType.Pin, 1), new Tile(TileType.Pin, 1),
//     new Tile(TileType.Wind, 'East')
// ];
// const tenpaiMelds: Tile[][] = [];

// console.log("是否为三色同刻:", SanshokuDouko.verifySanshokuDouko(completeHand, completeMelds));
// console.log("是否为三色同刻听牌:", SanshokuDouko.isSanshokuDoukoTenpai(tenpaiHand, tenpaiMelds));
// console.log("三色同刻听牌的待牌:", SanshokuDouko.getSanshokuDoukoWaitingTiles(tenpaiHand, tenpaiMelds).map(tile => tile.toString()));

// // 独立检查是否为三色同刻和牌
// console.log("是否为三色同刻:", SanshokuDouko.verifySanshokuDouko(hand, melds));

// // 独立检查是否为三色同刻听牌
// console.log("是否为三色同刻听牌:", SanshokuDouko.isSanshokuDoukoTenpai(hand, melds));

// // 独立获取三色同刻听牌的待牌
// console.log("三色同刻听牌的待牌:", SanshokuDouko.getSanshokuDoukoWaitingTiles(hand, melds).map(tile => tile.toString()));

// // 一次性获取完整的状态信息
// const state = SanshokuDouko.checkSanshokuDoukoState(hand, melds);
// console.log("完整状态:", state);

