import { Tile, TileType } from "../Tile";
//混全带幺九
export class Honroutou {
    /**
     * 验证是否为混老头和牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 是否为混老头和牌
     */
    public static verifyHonroutou(hand: Tile[], melds: Tile[][]): boolean {
        return this.checkHonroutou(hand, melds).isComplete;
    }

    /**
     * 检查是否为混老头听牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 是否为混老头听牌
     */
    public static isHonroutouTenpai(hand: Tile[], melds: Tile[][]): boolean {
        return this.checkHonroutou(hand, melds).isTenpai;
    }

    /**
     * 获取混老头听牌时的待牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 待牌数组
     */
    public static getHonroutouWaitingTiles(hand: Tile[], melds: Tile[][]): Tile[] {
        return this.checkHonroutou(hand, melds).waitingTiles;
    }

    /**
     * 检查混老头的状态
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 包含完成状态、听牌状态和待牌的对象
     */
    public static checkHonroutouState(hand: Tile[], melds: Tile[][]): { 
        isComplete: boolean; 
        isTenpai: boolean; 
        waitingTiles: Tile[];
    } {
        return this.checkHonroutou(hand, melds);
    }

    /**
     * 检查混老头的状态
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 包含完成状态、听牌状态和待牌的对象
     */
    private static checkHonroutou(hand: Tile[], melds: Tile[][]): { 
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

        if (!allTiles.every(this.isYaochuuOrHonor)) {
            return { isComplete: false, isTenpai: false, waitingTiles: [] };
        }

        const isComplete = totalTiles === 14;
        if (isComplete) {
            return { isComplete: true, isTenpai: false, waitingTiles: [] };
        }

        // 检查听牌状态
        const tileCounts = this.countTiles(allTiles);
        const waitingTiles = this.getWaitingTiles(tileCounts);
        const isTenpai = waitingTiles.length > 0;

        return { isComplete: false, isTenpai, waitingTiles };
    }

    /**
     * 检查一张牌是否为幺九牌或字牌
     * @param tile 待检查的牌
     * @returns 是否为幺九牌或字牌
     */
    private static isYaochuuOrHonor(tile: Tile): boolean {
        if (tile.type === TileType.Wind || tile.type === TileType.Dragon) {
            return true;
        }
        if ((tile.type === TileType.Man || tile.type === TileType.Pin || tile.type === TileType.Sou) && 
            (tile.value === 1 || tile.value === 9)) {
            return true;
        }
        return false;
    }

    /**
     * 统计牌的数量
     * @param tiles 牌数组
     * @returns 牌数量统计对象
     */
    private static countTiles(tiles: Tile[]): Map<string, number> {
        const counts = new Map<string, number>();
        for (const tile of tiles) {
            const key = `${tile.type}-${tile.value}`;
            counts.set(key, (counts.get(key) || 0) + 1);
        }
        return counts;
    }

    /**
     * 获取待牌
     * @param tileCounts 牌数量统计对象
     * @returns 待牌数组
     */
    private static getWaitingTiles(tileCounts: Map<string, number>): Tile[] {
        const waitingTiles: Tile[] = [];
        for (const [key, count] of tileCounts.entries()) {
            if (count === 1 || count === 4) {
                const [type, value] = key.split('-');
                waitingTiles.push(new Tile(type as TileType, value as any));
            }
        }
        return waitingTiles;
    }
}




// 这个实现的逻辑如下：
// 首先检查总牌数（手牌 + 鸣牌）是否为14张。
// 将手牌和鸣牌合并到一个数组中。
// 创建一个辅助函数 isYaochuuOrHonor 来检查单张牌是否是幺九牌或字牌。
// 遍历所有牌，检查是否都是幺九牌或字牌。
// 如果所有牌都通过了检查，则返回 true，表示是混老头。
// // 混老头示例
// const hand = [
//     Tile.createMan(1), Tile.createMan(1), Tile.createMan(1),
//     Tile.createMan(9), Tile.createMan(9), Tile.createMan(9),
//     Tile.createPin(1), Tile.createPin(1), Tile.createPin(1),
//     Tile.createWind(WindType.East), Tile.createWind(WindType.East)
// ];
// const melds = [
//     [Tile.createDragon(DragonType.White), Tile.createDragon(DragonType.White), Tile.createDragon(DragonType.White)]
// ];

// const isHonroutou = Honroutou.verifyHonroutou(hand, melds);
// console.log(isHonroutou); // 输出: true

// // 非混老头示例（包含中张牌）
// const hand2 = [
//     Tile.createMan(1), Tile.createMan(1), Tile.createMan(1),
//     Tile.createMan(2), Tile.createMan(3), Tile.createMan(4),
//     Tile.createMan(9), Tile.createMan(9), Tile.createMan(9),
//     Tile.createWind(WindType.East), Tile.createWind(WindType.East)
// ];
// const melds2 = [
//     [Tile.createDragon(DragonType.White), Tile.createDragon(DragonType.White), Tile.createDragon(DragonType.White)]
// ];

// const isNotHonroutou = Honroutou.verifyHonroutou(hand2, melds2);
// console.log(isNotHonroutou); // 输出: false

// const hand: Tile[] = [/* ... */];
// const melds: Tile[][] = [/* ... */];

// // 独立检查是否为混老头和牌
// console.log("是否为混老头:", Honroutou.verifyHonroutou(hand, melds));

// // 独立检查是否为混老头听牌
// console.log("是否为混老头听牌:", Honroutou.isHonroutouTenpai(hand, melds));

// // 独立获取混老头听牌的待牌
// console.log("混老头听牌的待牌:", Honroutou.getHonroutouWaitingTiles(hand, melds).map(tile => tile.toString()));

// // 一次性获取完整的状态信息
// const state = Honroutou.checkHonroutouState(hand, melds);
// console.log("完整状态:", state);