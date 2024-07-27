
import { Tile, TileType } from "../Tile";
// 纯全带幺九的检查逻辑


export class Junchan {
    public static verifyJunchan(hand: Tile[], melds: Tile[][]): boolean {
        // 展开嵌套数组
        const meldTiles = melds.reduce((acc, meld) => acc.concat(meld), []);
        
        // 检查总牌数是否为14张
        const totalTiles = hand.length + meldTiles.length;
        if (totalTiles !== 14) {
            return false;
        }

        // 获取所有牌
        const allTiles = [...hand, ...meldTiles];

        // 检查是否有字牌
        if (allTiles.some(tile => tile.type === TileType.Wind || tile.type === TileType.Dragon)) {
            return false;
        }

        // 将牌分组为面子和雀头
        const groups = this.groupTiles(allTiles);

        // 检查每个组是否包含幺九牌
        return groups.every(group => this.containsTerminal(group));
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