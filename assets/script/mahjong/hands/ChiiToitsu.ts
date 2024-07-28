import { Tile, TileType } from "../Tile";

export class ChiiToitsu {
    /**
     * 检查七对子的状态
     * @param hand 手牌数组
     * @returns 包含完成状态、听牌状态和待牌的对象
     */
    public static checkChiiToitsu(hand: Tile[]): { 
        isComplete: boolean; 
        isTenpai: boolean; 
        waitingTiles: Tile[] 
    } {
        if (hand.length !== 13 && hand.length !== 14) {
            return { isComplete: false, isTenpai: false, waitingTiles: [] };
        }

        const tileCount = new Map<string, number>();
        for (const tile of hand) {
            const key = `${tile.type}-${tile.value}`;
            tileCount.set(key, (tileCount.get(key) || 0) + 1);
        }

        let pairCount = 0;
        let singleCount = 0;
        const waitingTiles: Tile[] = [];

        for (const [key, count] of tileCount) {
            if (count > 2) {
                return { isComplete: false, isTenpai: false, waitingTiles: [] }; // 不允许有超过2张的牌
            }
            if (count === 2) {
                pairCount++;
            } else if (count === 1) {
                singleCount++;
                const [type, value] = key.split('-');
                waitingTiles.push(new Tile(type as TileType, parseInt(value)));
            }
        }

        const isComplete = pairCount === 7;
        const isTenpai = pairCount === 6 && singleCount === 1;

        return { isComplete, isTenpai, waitingTiles: isTenpai ? waitingTiles : [] };
    }

    /**
     * 验证是否为七对子和牌
     * @param hand 手牌数组
     * @returns 是否为七对子和牌
     */
    public static verifyChiiToitsu(hand: Tile[]): boolean {
        return this.checkChiiToitsu(hand).isComplete;
    }

    /**
     * 检查是否为七对子听牌
     * @param hand 手牌数组
     * @returns 是否为七对子听牌
     */
    public static isChiiToitsuTenpai(hand: Tile[]): boolean {
        return this.checkChiiToitsu(hand).isTenpai;
    }

    /**
     * 获取七对子听牌时的待牌
     * @param hand 手牌数组
     * @returns 待牌数组
     */
    public static getChiiToitsuWaitingTiles(hand: Tile[]): Tile[] {
        return this.checkChiiToitsu(hand).waitingTiles;
    }
}
// 使用示例

// const hand: Tile[] = [/* ... */];

// // 检查是否为七对子和牌
// console.log("是否为七对子:", ChiiToitsu.verifyChiiToitsu(hand));

// // 检查是否为七对子听牌
// console.log("是否为七对子听牌:", ChiiToitsu.isChiiToitsuTenpai(hand));

// // 获取七对子听牌的待牌
// console.log("七对子听牌的待牌:", ChiiToitsu.getChiiToitsuWaitingTiles(hand).map(tile => tile.toString()));

// // 获取完整的状态信息
// const state = ChiiToitsu.checkChiiToitsu(hand);
// console.log("完整状态:", state);
