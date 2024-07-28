import { Tile, TileType } from "../Tile";

export class SanshokuDoujun {
    /**
     * 验证是否为三色同顺和牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 是否为三色同顺和牌
     */
    public static verifySanshokuDoujun(hand: Tile[], melds: Tile[][]): boolean {
        const tileCounts = this.countTiles(hand, melds);
        return this.checkSanshokuDoujun(tileCounts).isComplete;
    }

    /**
     * 检查是否为三色同顺听牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 是否为三色同顺听牌
     */
    public static isSanshokuDoujunTenpai(hand: Tile[], melds: Tile[][]): boolean {
        const tileCounts = this.countTiles(hand, melds);
        return this.checkSanshokuDoujun(tileCounts).isTenpai;
    }

    /**
     * 获取三色同顺听牌时的待牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 待牌数组
     */
    public static getSanshokuDoujunWaitingTiles(hand: Tile[], melds: Tile[][]): Tile[] {
        const tileCounts = this.countTiles(hand, melds);
        return this.checkSanshokuDoujun(tileCounts).waitingTiles;
    }

    /**
     * 检查三色同顺的状态
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 包含完成状态、听牌状态和待牌的对象
     */
    public static checkSanshokuDoujunState(hand: Tile[], melds: Tile[][]): { 
        isComplete: boolean; 
        isTenpai: boolean; 
        waitingTiles: Tile[] 
    } {
        const tileCounts = this.countTiles(hand, melds);
        return this.checkSanshokuDoujun(tileCounts);
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
     * 检查三色同顺的状态
     * @param tileCounts 牌数量统计对象
     * @returns 包含完成状态、听牌状态和待牌的对象
     */
    private static checkSanshokuDoujun(tileCounts: { [key: string]: number }): { 
        isComplete: boolean; 
        isTenpai: boolean; 
        waitingTiles: Tile[] 
    } {
        let isComplete = false;
        let isTenpai = false;
        const waitingTiles: Tile[] = [];

        for (let value = 1; value <= 7; value++) {
            const manSeq = this.checkSequence(tileCounts, TileType.Man, value);
            const pinSeq = this.checkSequence(tileCounts, TileType.Pin, value);
            const souSeq = this.checkSequence(tileCounts, TileType.Sou, value);

            if (manSeq.complete && pinSeq.complete && souSeq.complete) {
                isComplete = true;
                break;
            }

            if ((manSeq.complete && pinSeq.complete && souSeq.tenpai) ||
                (manSeq.complete && pinSeq.tenpai && souSeq.complete) ||
                (manSeq.tenpai && pinSeq.complete && souSeq.complete)) {
                isTenpai = true;
                if (souSeq.tenpai) waitingTiles.push(...souSeq.waitingTiles);
                if (pinSeq.tenpai) waitingTiles.push(...pinSeq.waitingTiles);
                if (manSeq.tenpai) waitingTiles.push(...manSeq.waitingTiles);
            }
        }

        return { isComplete, isTenpai, waitingTiles };
    }

    /**
     * 检查指定类型和起始值的顺子状态
     * @param tileCounts 牌数量统计对象
     * @param type 牌类型
     * @param startValue 起始值
     * @returns 顺子状态对象
     */
    private static checkSequence(tileCounts: { [key: string]: number }, type: TileType, startValue: number): {
        complete: boolean;
        tenpai: boolean;
        waitingTiles: Tile[];
    } {
        const counts = [
            tileCounts[`${type}-${startValue}`] || 0,
            tileCounts[`${type}-${startValue + 1}`] || 0,
            tileCounts[`${type}-${startValue + 2}`] || 0
        ];

        const complete = counts[0] >= 1 && counts[1] >= 1 && counts[2] >= 1;
        const tenpai = (counts[0] >= 1 && counts[1] >= 1 && counts[2] === 0) ||
                       (counts[0] >= 1 && counts[1] === 0 && counts[2] >= 1) ||
                       (counts[0] === 0 && counts[1] >= 1 && counts[2] >= 1);

        const waitingTiles: Tile[] = [];
        if (tenpai) {
            if (counts[0] === 0) waitingTiles.push(new Tile(type, startValue));
            if (counts[1] === 0) waitingTiles.push(new Tile(type, startValue + 1));
            if (counts[2] === 0) waitingTiles.push(new Tile(type, startValue + 2));
        }

        return { complete, tenpai, waitingTiles };
    }
}



// 使用示例

// const hand: Tile[] = [/* ... */];
// const melds: Tile[][] = [/* ... */];

// // 独立检查是否为三色同顺和牌
// console.log("是否为三色同顺:", SanshokuDoujun.verifySanshokuDoujun(hand, melds));

// // 独立检查是否为三色同顺听牌
// console.log("是否为三色同顺听牌:", SanshokuDoujun.isSanshokuDoujunTenpai(hand, melds));

// // 独立获取三色同顺听牌的待牌
// console.log("三色同顺听牌的待牌:", SanshokuDoujun.getSanshokuDoujunWaitingTiles(hand, melds).map(tile => tile.toString()));

// // 一次性获取完整的状态信息
// const state = SanshokuDoujun.checkSanshokuDoujunState(hand, melds);
// console.log("完整状态:", state);
