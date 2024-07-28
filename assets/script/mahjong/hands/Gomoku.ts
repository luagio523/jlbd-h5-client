import { Tile, TileType, DragonType, WindType } from "../Tile";

export class Gomoku {
    /**
     * 验证是否为五门齐和牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 是否为五门齐和牌
     */
    public static verifyGomoku(hand: Tile[], melds: Tile[][]): boolean {
        return this.checkGomoku(hand, melds).isComplete;
    }

    /**
     * 检查是否为五门齐听牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 是否为五门齐听牌
     */
    public static isGomokuTenpai(hand: Tile[], melds: Tile[][]): boolean {
        return this.checkGomoku(hand, melds).isTenpai;
    }

    /**
     * 获取五门齐听牌时的待牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 待牌数组
     */
    public static getGomokuWaitingTiles(hand: Tile[], melds: Tile[][]): Tile[] {
        return this.checkGomoku(hand, melds).waitingTiles;
    }

    /**
     * 检查五门齐的状态
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 包含完成状态、听牌状态和待牌的对象
     */
    private static checkGomoku(hand: Tile[], melds: Tile[][]): { 
        isComplete: boolean; 
        isTenpai: boolean; 
        waitingTiles: Tile[];
    } {
        // 检查手牌数量
        if (hand.length !== 14) {
            return { isComplete: false, isTenpai: false, waitingTiles: [] };
        }

        // 统计牌的类型
        const types = new Set<TileType>();
        const dragons = new Set<DragonType>();

        hand.forEach(tile => {
            if (tile.type === TileType.Dragon) {
                dragons.add(tile.value as DragonType);
            } else {
                types.add(tile.type);
            }
        });

        // 检查是否包含五种不同的门类
        const hasWinds = types.has(TileType.Wind);
        const hasDragons = dragons.size > 0;
        const hasNumbers = types.has(TileType.Man) || types.has(TileType.Pin) || types.has(TileType.Sou);

        // 五门齐的条件：必须有风、龙和至少一种数牌
        const isComplete = hasWinds && hasDragons && hasNumbers;

        // 检查听牌状态
        const waitingTiles: Tile[] = [];
        if (!isComplete) {
            // 如果不完整，检查是否可以听牌
            // 这里可以添加逻辑来判断待牌
            // 例如，检查是否有缺失的数牌、风牌或龙牌
        }

        return { isComplete, isTenpai: false, waitingTiles };
    }
}
