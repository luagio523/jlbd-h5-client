
import { Tile, TileType } from "../Tile";

export class Sanankou {
    /**
     * 验证是否为三暗刻和牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 是否为三暗刻和牌
     */
    public static verifySanankou(hand: Tile[], melds: Tile[][]): boolean {
        return this.checkSanankou(hand, melds).isComplete;
    }

    /**
     * 检查是否为三暗刻听牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 是否为三暗刻听牌
     */
    public static isSanankouTenpai(hand: Tile[], melds: Tile[][]): boolean {
        return this.checkSanankou(hand, melds).isTenpai;
    }

    /**
     * 获取三暗刻听牌时的待牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 待牌数组
     */
    public static getSanankouWaitingTiles(hand: Tile[], melds: Tile[][]): Tile[] {
        return this.checkSanankou(hand, melds).waitingTiles;
    }

    /**
     * 检查三暗刻的状态
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 包含完成状态、听牌状态和待牌的对象
     */
    public static checkSanankouState(hand: Tile[], melds: Tile[][]): { 
        isComplete: boolean; 
        isTenpai: boolean; 
        waitingTiles: Tile[];
        ankoCount: number;
        minkanCount: number;
    } {
        return this.checkSanankou(hand, melds);
    }

    /**
     * 检查三暗刻的状态
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 包含完成状态、听牌状态、待牌、暗刻数和明杠数的对象
     */
    private static checkSanankou(hand: Tile[], melds: Tile[][]): { 
        isComplete: boolean; 
        isTenpai: boolean; 
        waitingTiles: Tile[];
        ankoCount: number;
        minkanCount: number;
    } {
        const totalTiles = hand.length + melds.reduce((sum, meld) => sum + meld.length, 0);
        if (totalTiles !== 13 && totalTiles !== 14) {
            return { isComplete: false, isTenpai: false, waitingTiles: [], ankoCount: 0, minkanCount: 0 };
        }

        const handCounts = this.countTiles(hand);
        let ankoCount = 0;
        let pairCount = 0;
        const waitingTiles: Tile[] = [];

        for (const [key, count] of Object.entries(handCounts)) {
            if (count >= 3) {
                ankoCount++;
            } else if (count === 2) {
                pairCount++;
            } else if (count === 1) {
                const [type, value] = key.split('-');
                waitingTiles.push(new Tile(type as TileType, value as any));
            }
        }

        const minkanCount = melds.filter(meld => meld.length === 4).length;
        const ponCount = melds.filter(meld => meld.length === 3).length;

        const totalKouCount = ankoCount + ponCount + minkanCount;
        const isComplete = ankoCount >= 3 && totalKouCount >= 3 && (ankoCount + minkanCount) >= 3 && totalTiles === 14;
        const isTenpai = (ankoCount === 2 && pairCount >= 1 && totalTiles === 13) ||
                         (ankoCount === 3 && waitingTiles.length > 0 && totalTiles === 13);

        return { isComplete, isTenpai, waitingTiles, ankoCount, minkanCount };
    }

    /**
     * 统计手牌中每种牌的数量
     * @param hand 手牌数组
     * @returns 牌数量统计对象
     */
    private static countTiles(hand: Tile[]): { [key: string]: number } {
        const counts: { [key: string]: number } = {};
        hand.forEach(tile => {
            const key = `${tile.type}-${tile.value}`;
            counts[key] = (counts[key] || 0) + 1;
        });
        return counts;
    }
}


// 首先检查总牌数（手牌 + 鸣牌）是否为14张。
// 统计手牌中每种牌的数量。
// 计算手牌中暗刻的数量。
// 检查明刻（碰）的数量。
// 检查明杠的数量（明杠也算作明刻，但在计算暗刻时也被考虑）。
// 计算总刻子数量。
// 判断是否满足三暗刻的条件：
// 至少有3个暗刻
// 总刻子数量必须至少为3
// 暗刻数量加上明杠数量必须至少为3（因为明杠虽然明示，但仍然算作暗刻）


// // 三暗刻示例
// const hand = [
//     Tile.createMan(1), Tile.createMan(1), Tile.createMan(1),
//     Tile.createPin(2), Tile.createPin(2), Tile.createPin(2),
//     Tile.createSou(3), Tile.createSou(3), Tile.createSou(3),
//     Tile.createWind(WindType.East), Tile.createWind(WindType.East)
// ];
// const melds = [
//     [Tile.createDragon(DragonType.White), Tile.createDragon(DragonType.White), Tile.createDragon(DragonType.White)]
// ];

// const isSanankou = Sanankou.verifySanankou(hand, melds);
// console.log(isSanankou); // 输出: true

// 独立检查是否为三暗刻和牌
// console.log("是否为三暗刻:", Sanankou.verifySanankou(hand, melds));

// // 独立检查是否为三暗刻听牌
// console.log("是否为三暗刻听牌:", Sanankou.isSanankouTenpai(hand, melds));

// // 独立获取三暗刻听牌的待牌
// console.log("三暗刻听牌的待牌:", Sanankou.getSanankouWaitingTiles(hand, melds).map(tile => tile.toString()));

// // 一次性获取完整的状态信息
// const state = Sanankou.checkSanankouState(hand, melds);
// console.log("完整状态:", state);