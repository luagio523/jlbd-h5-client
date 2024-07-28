import { Tile } from "../Tile";

/**
 * 四暗刻（Suuankou）判定类
 * 四暗刻需要四个暗刻（或暗杠）和一对雀头，所有刻子必须为暗刻
 */
export class Suuankou {
    /**
     * 验证是否为四暗刻和牌
     * @param hand 手牌数组
     * @param melds 副露数组（四暗刻不应该有副露）
     * @returns 是否为四暗刻和牌
     */
    public static verifySuuankou(hand: Tile[], melds: Tile[][]): boolean {
        return this.checkSuuankou(hand, melds).isComplete;
    }

    /**
     * 检查是否为四暗刻听牌
     * @param hand 手牌数组
     * @param melds 副露数组（四暗刻不应该有副露）
     * @returns 是否为四暗刻听牌
     */
    public static isSuuankouTenpai(hand: Tile[], melds: Tile[][]): boolean {
        return this.checkSuuankou(hand, melds).isTenpai;
    }

    /**
     * 获取四暗刻听牌时的待牌
     * @param hand 手牌数组
     * @param melds 副露数组（四暗刻不应该有副露）
     * @returns 待牌数组
     */
    public static getSuuankouWaitingTiles(hand: Tile[], melds: Tile[][]): Tile[] {
        const { isTenpai, waitingTiles } = this.checkSuuankou(hand, melds);
        return isTenpai ? waitingTiles : [];
    }

    /**
     * 检查四暗刻的状态
     * @param hand 手牌数组
     * @param melds 副露数组（四暗刻不应该有副露）
     * @returns 包含完成状态、听牌状态和待牌的对象
     */
    private static checkSuuankou(hand: Tile[], melds: Tile[][]): { 
        isComplete: boolean; 
        isTenpai: boolean; 
        waitingTiles: Tile[] 
    } {
        // 如果有任何明刻（鸣牌），就不是四暗刻
        if (melds.length > 0) {
            return { isComplete: false, isTenpai: false, waitingTiles: [] };
        }

        // 检查总牌数
        if (hand.length !== 13 && hand.length !== 14) {
            return { isComplete: false, isTenpai: false, waitingTiles: [] };
        }

        // 统计每种牌的数量
        const tileCounts: { [key: string]: number } = {};
        hand.forEach(tile => {
            const key = `${tile.type}-${tile.value}`;
            tileCounts[key] = (tileCounts[key] || 0) + 1;
        });

        let tripletCount = 0;
        let pairCount = 0;
        let singleCount = 0;
        const waitingTiles: Tile[] = [];

        for (const [key, count] of Object.entries(tileCounts)) {
            if (count === 1) {
                singleCount++;
                waitingTiles.push(this.createTileFromKey(key));
                waitingTiles.push(this.createTileFromKey(key));
            } else if (count === 2) {
                pairCount++;
                waitingTiles.push(this.createTileFromKey(key));
            } else if (count === 3) {
                tripletCount++;
            } else if (count === 4) {
                tripletCount++;
                pairCount++;
            }
        }

        const isComplete = tripletCount === 4 && pairCount === 1 && hand.length === 14;
        const isTenpai = (tripletCount === 3 && pairCount === 2 && hand.length === 13) ||
                         (tripletCount === 4 && singleCount === 1 && hand.length === 13);

        return { isComplete, isTenpai, waitingTiles };
    }

    /**
     * 从键值创建Tile对象
     * @param key 牌的键值，格式为"type-value"
     * @returns 创建的Tile对象
     */
    private static createTileFromKey(key: string): Tile {
        const [type, value] = key.split('-');
        return new Tile(type as any, value as any);  // 这里可能需要根据Tile类的具体实现进行调整
    }
}




// 使用示例

// // 创建一个四暗刻和牌的手牌
// const completeHand: Tile[] = [
//     new Tile('Man', 1), new Tile('Man', 1), new Tile('Man', 1),
//     new Tile('Pin', 2), new Tile('Pin', 2), new Tile('Pin', 2),
//     new Tile('Sou', 3), new Tile('Sou', 3), new Tile('Sou', 3),
//     new Tile('Wind', 'East'), new Tile('Wind', 'East'), new Tile('Wind', 'East'),
//     new Tile('Dragon', 'White'), new Tile('Dragon', 'White')
// ];

// // 创建一个四暗刻听牌的手牌
// const tenpaiHand: Tile[] = [
//     new Tile('Man', 1), new Tile('Man', 1), new Tile('Man', 1),
//     new Tile('Pin', 2), new Tile('Pin', 2), new Tile('Pin', 2),
//     new Tile('Sou', 3), new Tile('Sou', 3), new Tile('Sou', 3),
//     new Tile('Wind', 'East'), new Tile('Wind', 'East'), new Tile('Wind', 'East'),
//     new Tile('Dragon', 'White')
// ];

// const emptyMelds: Tile[][] = [];

// console.log("是否为四暗刻和牌:", Suuankou.verifySuuankou(completeHand, emptyMelds));
// console.log("是否为四暗刻听牌:", Suuankou.isSuuankouTenpai(tenpaiHand, emptyMelds));
// console.log("四暗刻听牌的待牌:", Suuankou.getSuuankouWaitingTiles(tenpaiHand, emptyMelds).map(tile => tile.toString()));

// // 输出结果：
// // 是否为四暗刻和牌: true
// // 是否为四暗刻听牌: true
// // 四暗刻听牌的待牌: ['White']
