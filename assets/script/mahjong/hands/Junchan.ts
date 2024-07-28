import { Tile, TileType } from "../Tile";

export class Junchan {
    /**
     * 验证是否为纯全带幺九和牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 是否为纯全带幺九和牌
     */
    public static verifyJunchan(hand: Tile[], melds: Tile[][]): boolean {
        return this.checkJunchan(hand, melds).isComplete;
    }

    /**
     * 检查是否为纯全带幺九听牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 是否为纯全带幺九听牌
     */
    public static isJunchanTenpai(hand: Tile[], melds: Tile[][]): boolean {
        return this.checkJunchan(hand, melds).isTenpai;
    }

    /**
     * 获取纯全带幺九听牌时的待牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 待牌数组
     */
    public static getJunchanWaitingTiles(hand: Tile[], melds: Tile[][]): Tile[] {
        return this.checkJunchan(hand, melds).waitingTiles;
    }

    /**
     * 检查纯全带幺九的状态
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 包含完成状态、听牌状态和待牌的对象
     */
    public static checkJunchanState(hand: Tile[], melds: Tile[][]): { 
        isComplete: boolean; 
        isTenpai: boolean; 
        waitingTiles: Tile[];
    } {
        return this.checkJunchan(hand, melds);
    }

    /**
     * 检查纯全带幺九的状态
     * @param hand 手牌数组
     * @param melds 副露数组
     * @returns 包含完成状态、听牌状态和待牌的对象
     */
    private static checkJunchan(hand: Tile[], melds: Tile[][]): { 
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

        // 检查是否有字牌
        if (allTiles.some(tile => tile.type === TileType.Wind || tile.type === TileType.Dragon)) {
            return { isComplete: false, isTenpai: false, waitingTiles: [] };
        }

        const groups = this.groupTiles(allTiles);
        const isComplete = groups.every(group => this.containsTerminal(group)) && totalTiles === 14;
        
        if (isComplete) {
            return { isComplete: true, isTenpai: false, waitingTiles: [] };
        }

        // 检查听牌状态
        const waitingTiles = this.checkTenpai(groups);
        const isTenpai = waitingTiles.length > 0 && totalTiles === 13;

        return { isComplete, isTenpai, waitingTiles };
    }

    private static groupTiles(tiles: Tile[]): Tile[][] {
        // 这里简化处理，假设所有牌都已经正确分组
        // 在实际应用中，您可能需要一个更复杂的算法来正确分组牌
        const groups: Tile[][] = [];
        for (let i = 0; i < tiles.length; i += 3) {
            if (i + 2 < tiles.length) {
                groups.push(tiles.slice(i, i + 3));
            } else {
                groups.push(tiles.slice(i));
            }
        }
        return groups;
    }

    private static containsTerminal(group: Tile[]): boolean {
        return group.some(tile => 
            (tile.type === TileType.Man || tile.type === TileType.Pin || tile.type === TileType.Sou) &&
            (tile.value === 1 || tile.value === 9)
        );
    }

    private static checkTenpai(groups: Tile[][]): Tile[] {
        const waitingTiles: Tile[] = [];
        const incompleteGroups = groups.filter(group => !this.containsTerminal(group));

        for (const group of incompleteGroups) {
            if (group.length === 2) {
                const type = group[0].type;
                if (group.every(tile => tile.value !== 1 && tile.value !== 9)) {
                    waitingTiles.push(new Tile(type, 1));
                    waitingTiles.push(new Tile(type, 9));
                } else if (group[0].value === 1 || group[1].value === 1) {
                    waitingTiles.push(new Tile(type, 1));
                } else if (group[0].value === 9 || group[1].value === 9) {
                    waitingTiles.push(new Tile(type, 9));
                }
            }
        }

        return waitingTiles;
    }
}



// 首先检查总牌数（手牌 + 鸣牌）是否为14张。
// 将手牌和鸣牌合并到一个数组中。
// 检查是否有字牌，如果有则不符合纯全带幺九的要求。
// 将牌分组为面子和雀头（这里使用了一个简化的分组方法，实际应用中可能需要更复杂的算法）。
// 检查每个组是否包含幺九牌（1或9）。
// 如果所有组都包含幺九牌，则返回 true。
// // 纯全带幺九示例
// const hand = [
//     Tile.createMan(1), Tile.createMan(2), Tile.createMan(3),
//     Tile.createPin(7), Tile.createPin(8), Tile.createPin(9),
//     Tile.createSou(1), Tile.createSou(2), Tile.createSou(3),
//     Tile.createMan(9), Tile.createMan(9)
// ];
// const melds = [
//     [Tile.createSou(7), Tile.createSou(8), Tile.createSou(9)]
// ];

// const isJunchan = Junchan.verifyJunchan(hand, melds);
// console.log(isJunchan); // 输出: true

// // 非纯全带幺九示例（包含字牌）
// const hand2 = [
//     Tile.createMan(1), Tile.createMan(2), Tile.createMan(3),
//     Tile.createPin(7), Tile.createPin(8), Tile.createPin(9),
//     Tile.createSou(1), Tile.createSou(2), Tile.createSou(3),
//     Tile.createWind(WindType.East), Tile.createWind(WindType.East)
// ];
// const melds2 = [
//     [Tile.createSou(7), Tile.createSou(8), Tile.createSou(9)]
// ];

// const isNotJunchan = Junchan.verifyJunchan(hand2, melds2);
// console.log(isNotJunchan); // 输出: false

// // 独立检查是否为纯全带幺九和牌
// console.log("是否为纯全带幺九:", Junchan.verifyJunchan(hand, melds));

// // 独立检查是否为纯全带幺九听牌
// console.log("是否为纯全带幺九听牌:", Junchan.isJunchanTenpai(hand, melds));

// // 独立获取纯全带幺九听牌的待牌
// console.log("纯全带幺九听牌的待牌:", Junchan.getJunchanWaitingTiles(hand, melds).map(tile => tile.toString()));

// // 一次性获取完整的状态信息
// const state = Junchan.checkJunchanState(hand, melds);
// console.log("完整状态:", state);