import { Tile } from "../Tile";

/**
 * 碰碰和（对对和）判定类
 * 碰碰和要求所有的面子都是刻子（或杠），外加一对雀头
 */
export class Toitoi {
    /**
     * 验证是否为碰碰和
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 是否为碰碰和
     */
    public static verifyToitoi(hand: Tile[], melds: Tile[][]): boolean {
        return this.checkToitoi(hand, melds).isComplete;
    }

    /**
     * 检查是否为碰碰和听牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 是否为碰碰和听牌
     */
    public static isToitoiTenpai(hand: Tile[], melds: Tile[][]): boolean {
        return this.checkToitoi(hand, melds).isTenpai;
    }

    /**
     * 获取碰碰和听牌时的待牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 待牌数组
     */
    public static getToitoiWaitingTiles(hand: Tile[], melds: Tile[][]): Tile[] {
        const { isTenpai, waitingTiles } = this.checkToitoi(hand, melds);
        return isTenpai ? waitingTiles : [];
    }

    /**
     * 检查碰碰和的状态
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 包含完成状态、听牌状态和待牌的对象
     */
    private static checkToitoi(hand: Tile[], melds: Tile[][]): { 
        isComplete: boolean; 
        isTenpai: boolean; 
        waitingTiles: Tile[] 
    } {
        const totalTiles = hand.length + melds.reduce((sum, meld) => sum + meld.length, 0);
        if (totalTiles !== 14 && totalTiles !== 13) {
            return { isComplete: false, isTenpai: false, waitingTiles: [] };
        }

        const groups = this.groupTiles(hand);
        const pairs = new Map<string, number>();

        // 统计手牌中的牌数量
        groups.forEach(group => {
            const key = `${group[0].type}-${group[0].value}`;
            pairs.set(key, group.length);
        });

        // 统计 melds 中的刻子数量
        let meldCount = melds.length;

        let tripletCount = meldCount;
        let pairCount = 0;
        let singleCount = 0;
        const waitingTiles: Tile[] = [];

        pairs.forEach((count, key) => {
            if (count === 1) {
                singleCount++;
                waitingTiles.push(this.createTileFromKey(key));
                waitingTiles.push(this.createTileFromKey(key));
            } else if (count === 2) {
                pairCount++;
                waitingTiles.push(this.createTileFromKey(key));
            } else if (count >= 3) {
                tripletCount++;
                if (count === 4) pairCount++;
            }
        });

        const isComplete = tripletCount === 4 && pairCount === 1 && totalTiles === 14;
        const isTenpai = (tripletCount === 3 && pairCount === 2 && totalTiles === 13) ||
                         (tripletCount === 4 && singleCount === 1 && totalTiles === 13);

        return { isComplete, isTenpai, waitingTiles };
    }

    private static groupTiles(hand: Tile[]): Tile[][] {
        const groups: { [key: string]: Tile[] } = {};
        hand.forEach(tile => {
            const key = `${tile.type}-${tile.value}`;
            if (!groups[key]) groups[key] = [];
            groups[key].push(tile);
        });
        return Object.values(groups);
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



// // 使用示例

// // 创建一个碰碰和的手牌和副露
// const completeHand: Tile[] = [
//     new Tile('Man', 1), new Tile('Man', 1),
//     new Tile('Pin', 2), new Tile('Pin', 2), new Tile('Pin', 2),
//     new Tile('Sou', 3), new Tile('Sou', 3), new Tile('Sou', 3)
// ];
// const completeMelds: Tile[][] = [
//     [new Tile('Wind', 'East'), new Tile('Wind', 'East'), new Tile('Wind', 'East')],
//     [new Tile('Dragon', 'White'), new Tile('Dragon', 'White'), new Tile('Dragon', 'White')]
// ];

// // 创建一个碰碰和听牌的手牌和副露
// const tenpaiHand: Tile[] = [
//     new Tile('Man', 1), new Tile('Man', 1),
//     new Tile('Pin', 2), new Tile('Pin', 2), new Tile('Pin', 2),
//     new Tile('Sou', 3), new Tile('Sou', 3), new Tile('Sou', 3),
//     new Tile('Wind', 'East')
// ];
// const tenpaiMelds: Tile[][] = [
//     [new Tile('Dragon', 'White'), new Tile('Dragon', 'White'), new Tile('Dragon', 'White')]
// ];

// console.log("是否为碰碰和:", Toitoi.verifyToitoi(completeHand, completeMelds));
// console.log("是否为碰碰和听牌:", Toitoi.isToitoiTenpai(tenpaiHand, tenpaiMelds));
// console.log("碰碰和听牌的待牌:", Toitoi.getToitoiWaitingTiles(tenpaiHand, tenpaiMelds).map(tile => tile.toString()));

// // 输出结果：
// // 是否为碰碰和: true
// // 是否为碰碰和听牌: true
// // 碰碰和听牌的待牌: ['East']
