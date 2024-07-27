
import { Tile } from "../Tile";
//  杯口的检查逻辑
export class Peikou {
    // 实现两杯口的检查逻辑
    public static verifyRyanpeikou(hand: Tile[], melds: Tile[][]): boolean {
        // 两杯口不能有鸣牌
        if (melds.length > 0) {
            return false;
        }

        const sequences = this.findSequences(hand);
        const pairCount = this.countPairs(sequences);

        // 两杯口需要有两对相同的顺子
        return pairCount === 2;
    }

    // 实现一杯口的检查逻辑
    public static verifyIipeikou(hand: Tile[], melds: Tile[][]): boolean {
        // 一杯口不能有鸣牌
        if (melds.length > 0) {
            return false;
        }

        const sequences = this.findSequences(hand);
        const pairCount = this.countPairs(sequences);

        // 一杯口需要有一对相同的顺子
        return pairCount === 1;
    }

    private static findSequences(tiles: Tile[]): string[] {
        const sequences: string[] = [];
        const sortedTiles = tiles.sort((a, b) => {
            if (a.type !== b.type) {
                return a.type.localeCompare(b.type);
            }
            return (a.value as number) - (b.value as number);
        });

        for (let i = 0; i < sortedTiles.length - 2; i++) {
            const tile1 = sortedTiles[i];
            const tile2 = sortedTiles[i + 1];
            const tile3 = sortedTiles[i + 2];

            if (tile1.type === tile2.type && tile2.type === tile3.type &&
                (tile1.value as number) + 1 === (tile2.value as number) &&
                (tile2.value as number) + 1 === (tile3.value as number)) {
                sequences.push(`${tile1.type}-${tile1.value}`);
            }
        }

        return sequences;
    }

    private static countPairs(sequences: string[]): number {
        const counts: { [key: string]: number } = {};
        for (const seq of sequences) {
            counts[seq] = (counts[seq] || 0) + 1;
        }

        return Object.values(counts).filter(count => count >= 2).length;
    }
}



// 对于两杯口和一杯口，首先检查是否有鸣牌。如果有鸣牌，直接返回 false，因为杯口和两杯口都要求全部是暗手。
// 使用 findSequences 方法找出所有可能的顺子。这个方法会：
// 首先对牌进行排序。
// 然后遍历排序后的牌，寻找连续的三张同种类型的牌。
// 将找到的顺子以字符串的形式（例如 "Man-1"）存储在数组中。
// 使用 countPairs 方法计算有多少对相同的顺子。这个方法会：
// 统计每种顺子出现的次数。
// 计算出现次数大于等于2的顺子的数量。
// 对于两杯口，需要有两对相同的顺子，即 pairCount === 2。
// 对于一杯口，需要有一对相同的顺子，即 pairCount === 1。
// // 两杯口示例
// const ryenpeikoHand = [
//     Tile.createMan(1), Tile.createMan(2), Tile.createMan(3),
//     Tile.createMan(1), Tile.createMan(2), Tile.createMan(3),
//     Tile.createPin(4), Tile.createPin(5), Tile.createPin(6),
//     Tile.createPin(4), Tile.createPin(5), Tile.createPin(6),
//     Tile.createSou(1), Tile.createSou(1)
// ];
// const emptyMelds: Tile[][] = [];

// console.log(Ryanpeikou.verifyRyanpeikou(ryenpeikoHand, emptyMelds)); // 输出: true

// // 一杯口示例
// const iipeikoHand = [
//     Tile.createMan(1), Tile.createMan(2), Tile.createMan(3),
//     Tile.createMan(1), Tile.createMan(2), Tile.createMan(3),
//     Tile.createPin(4), Tile.createPin(5), Tile.createPin(6),
//     Tile.createSou(7), Tile.createSou(8), Tile.createSou(9),
//     Tile.createDragon(DragonType.White), Tile.createDragon(DragonType.White)
// ];

// console.log(Ryanpeikou.verifyIipeikou(iipeikoHand, emptyMelds)); // 输出: true