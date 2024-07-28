import { Tile, TileType, DragonType } from "../Tile";

export class Ryuuiisou {
    private static readonly GREEN_TILES = new Set([
        `${TileType.Sou}-2`, `${TileType.Sou}-3`, `${TileType.Sou}-4`, 
        `${TileType.Sou}-6`, `${TileType.Sou}-8`, `${TileType.Dragon}-${DragonType.Green}`
    ]);

    /**
     * 验证是否为绿一色和牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 是否为绿一色和牌
     */
    public static verifyRyuuiisou(hand: Tile[], melds: Tile[][]): boolean {
        return this.checkRyuuiisou(hand, melds).isComplete;
    }

    /**
     * 检查是否为绿一色听牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 是否为绿一色听牌
     */
    public static isRyuuiisouTenpai(hand: Tile[], melds: Tile[][]): boolean {
        return this.checkRyuuiisou(hand, melds).isTenpai;
    }

    /**
     * 获取绿一色听牌时的待牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 待牌数组
     */
    public static getRyuuiisouWaitingTiles(hand: Tile[], melds: Tile[][]): Tile[] {
        return this.checkRyuuiisou(hand, melds).waitingTiles;
    }

    /**
     * 检查绿一色的状态
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 包含完成状态、听牌状态和待牌的对象
     */
    public static checkRyuuiisouState(hand: Tile[], melds: Tile[][]): { 
        isComplete: boolean; 
        isTenpai: boolean; 
        waitingTiles: Tile[];
    } {
        return this.checkRyuuiisou(hand, melds);
    }

    /**
     * 检查绿一色的状态
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 包含完成状态、听牌状态和待牌的对象
     */
    private static checkRyuuiisou(hand: Tile[], melds: Tile[][]): { 
        isComplete: boolean; 
        isTenpai: boolean; 
        waitingTiles: Tile[];
    } {
        const totalTiles = hand.length + melds.reduce((sum, meld) => sum + meld.length, 0);
        if (totalTiles !== 13 && totalTiles !== 14) {
            return { isComplete: false, isTenpai: false, waitingTiles: [] };
        }

        // const allTiles = [...hand, ...melds.flat()];
        const allTiles = [...hand, ...melds.reduce((acc, val) => acc.concat(val), [])];
        const isAllGreen = allTiles.every(tile => this.isGreen(tile));

        if (!isAllGreen) {
            return { isComplete: false, isTenpai: false, waitingTiles: [] };
        }

        const isComplete = totalTiles === 14;
        const isTenpai = totalTiles === 13;
        const waitingTiles = isTenpai ? this.getGreenWaitingTiles() : [];

        return { isComplete, isTenpai, waitingTiles };
    }

    /**
     * 检查一张牌是否为绿色牌
     * @param tile 待检查的牌
     * @returns 是否为绿色牌
     */
    private static isGreen(tile: Tile): boolean {
        return this.GREEN_TILES.has(`${tile.type}-${tile.value}`);
    }

    /**
     * 获取所有可能的绿色待牌
     * @returns 绿色待牌数组
     */
    private static getGreenWaitingTiles(): Tile[] {
        return Array.from(this.GREEN_TILES).map(key => {
            const [type, value] = key.split('-');
            return new Tile(type as TileType, value as any);
        });
    }
}


// 这个实现的逻辑如下：
// 首先检查总牌数（手牌 + 鸣牌）是否为14张。
// 定义绿色的牌：索子的2、3、4、6、8，以及发（绿龙）。
// 创建一个辅助函数 isGreen 来检查单张牌是否为绿色。
// 遍历所有手牌，检查是否都是绿色的。
// 遍历所有鸣牌，检查是否都是绿色的。
// 如果所有牌都通过了检查，则返回 true，表示是绿一色。

// const hand = [
//     Tile.createSou(2), Tile.createSou(2), Tile.createSou(2),
//     Tile.createSou(3), Tile.createSou(3), Tile.createSou(4),
//     Tile.createSou(4), Tile.createSou(6), Tile.createSou(6),
//     Tile.createSou(8), Tile.createSou(8)
// ];
// const melds = [
//     [Tile.createDragon(DragonType.Green), Tile.createDragon(DragonType.Green), Tile.createDragon(DragonType.Green)]
// ];

// const isRyuuiisou = Ryuuiisou.verifyRyuuiisou(hand, melds);
// console.log(isRyuuiisou); // 输出: true


// 使用示例



// // 独立检查是否为绿一色和牌
// console.log("是否为绿一色:", Ryuuiisou.verifyRyuuiisou(hand, melds));

// // 独立检查是否为绿一色听牌
// console.log("是否为绿一色听牌:", Ryuuiisou.isRyuuiisouTenpai(hand, melds));

// // 独立获取绿一色听牌的待牌
// console.log("绿一色听牌的待牌:", Ryuuiisou.getRyuuiisouWaitingTiles(hand, melds).map(tile => tile.toString()));

// // 一次性获取完整的状态信息
// const state = Ryuuiisou.checkRyuuiisouState(hand, melds);
// console.log("完整状态:", state);
