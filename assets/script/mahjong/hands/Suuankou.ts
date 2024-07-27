
import { Tile } from "../Tile";
//四暗刻
export class Suuankou {
    public static verifySuuankou(hand: Tile[], melds: Tile[][]): boolean {
        // 展开嵌套数组
        const meldTiles = melds.reduce((acc, meld) => acc.concat(meld), []);
        
        // 检查总牌数是否为14张
        const totalTiles = hand.length + meldTiles.length;
        if (totalTiles !== 14) {
            return false;
        }

        // 如果有任何明刻（鸣牌），就不是四暗刻
        if (melds.length > 0) {
            return false;
        }

        // 统计每种牌的数量
        const tileCounts: { [key: string]: number } = {};
        hand.forEach(tile => {
            const key = `${tile.type}-${tile.value}`;
            tileCounts[key] = (tileCounts[key] || 0) + 1;
        });

        let tripletCount = 0;
        let pairCount = 0;

        for (const count of Object.values(tileCounts)) {
            if (count === 2) {
                pairCount++;
            } else if (count === 3) {
                tripletCount++;
            } else if (count === 4) {
                // 四张相同的牌可以视为一个刻子和一对
                tripletCount++;
                pairCount++;
            } else {
                // 如果有单张牌，不符合四暗刻
                return false;
            }
        }

        // 四暗刻必须有4个刻子和1对雀头
        return tripletCount === 4 && pairCount === 1;
    }
}





// 首先检查手牌数量是否为14张。
// 创建一个对象 tileCounts 来统计每种牌的数量。
// 遍历 tileCounts，统计刻子（三张相同的牌）和对子（两张相同的牌）的数量。
// 如果有四张相同的牌，视为一个刻子和一对。
// 检查是否恰好有4个刻子和1对雀头。
// const hand = [
//     Tile.createMan(1), Tile.createMan(1), Tile.createMan(1),
//     Tile.createPin(2), Tile.createPin(2), Tile.createPin(2),
//     Tile.createSou(3), Tile.createSou(3), Tile.createSou(3),
//     Tile.createWind(WindType.East), Tile.createWind(WindType.East), Tile.createWind(WindType.East),
//     Tile.createDragon(DragonType.White), Tile.createDragon(DragonType.White)
// ];

// const isSuuankou = Suuankou.verifySuuankou(hand);
// console.log(isSuuankou); // 输出: true

// 这个实现应该能够正确识别四暗刻的手牌组合。需要注意的是，这个实现不区分明刻和暗刻，
// 因为它只检查手牌。如果您需要考虑明刻（例如，通过碰或杠形成的刻子），
// 您可能需要额外的信息来区分明暗刻。如果您有任何其他需求或者需要进一步的修改
