import { Tile, TileType, DragonType, WindType } from "../Tile";

export class Sanrenko {
    /**
     * 验证是否为三连刻和牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 是否为三连刻和牌
     */
    public static verifySanrenko(hand: Tile[], melds: Tile[][]): boolean {
        return this.checkSanrenko(hand, melds).isComplete;
    }

    /**
     * 检查是否为三连刻听牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 是否为三连刻听牌
     */
    public static isSanrenkoTenpai(hand: Tile[], melds: Tile[][]): boolean {
        return this.checkSanrenko(hand, melds).isTenpai;
    }

    /**
     * 获取三连刻听牌时的待牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 待牌数组
     */
    public static getSanrenkoWaitingTiles(hand: Tile[], melds: Tile[][]): Tile[] {
        return this.checkSanrenko(hand, melds).waitingTiles;
    }

    /**
     * 检查三连刻的状态
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 包含完成状态、听牌状态和待牌的对象
     */
    private static checkSanrenko(hand: Tile[], melds: Tile[][]): { 
        isComplete: boolean; 
        isTenpai: boolean; 
        waitingTiles: Tile[];
    } {
        // 检查手牌数量
        if (hand.length !== 14) {
            return { isComplete: false, isTenpai: false, waitingTiles: [] };
        }

        // 统计手牌中的牌
        const tileCount = new Map<string, number>();
        hand.forEach(tile => {
            const key = `${tile.type}-${tile.value}`;
            tileCount.set(key, (tileCount.get(key) || 0) + 1);
        });

        let tripletCount = 0; // 刻子的数量
        const waitingTiles: Tile[] = [];

        for (const [key, count] of tileCount) {
            if (count === 3) {
                tripletCount++; // 统计刻子的数量
            } else if (count === 1) {
                const [type, value] = key.split('-');
                waitingTiles.push(new Tile(type as TileType, parseInt(value)));
            } else if (count > 3) {
                return { isComplete: false, isTenpai: false, waitingTiles: [] }; // 不允许有超过3张的牌
            }
        }

        const isComplete = tripletCount === 3; // 三个刻子
        const isTenpai = tripletCount === 2 && waitingTiles.length === 1; // 听牌状态

        return { isComplete, isTenpai, waitingTiles: isTenpai ? waitingTiles : [] };
    }
}
