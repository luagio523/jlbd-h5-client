
import { Tile, TileType } from "../Tile";
//三暗刻
export class Sanankou {
    public static verifySanankou(hand: Tile[], melds: Tile[][]): boolean {
        // 展开嵌套数组
        const meldTiles = melds.reduce((acc, meld) => acc.concat(meld), []);
        
        // 检查总牌数是否为14张
        const totalTiles = hand.length + meldTiles.length;
        if (totalTiles !== 14) {
            return false;
        }

        // 统计手牌中每种牌的数量
        const handCounts: { [key: string]: number } = {};
        hand.forEach(tile => {
            const key = `${tile.type}-${tile.value}`;
            handCounts[key] = (handCounts[key] || 0) + 1;
        });

        // 计算暗刻的数量
        let ankoCount = 0;
        for (const count of Object.values(handCounts)) {
            if (count >= 3) {
                ankoCount++;
            }
        }

        // 检查明刻（碰）的数量
        const ponCount = melds.filter(meld => meld.length === 3 && meld[0].type !== TileType.Wind && meld[0].type !== TileType.Dragon).length;

        // 检查明杠的数量（明杠也算作明刻）
        const minkanCount = melds.filter(meld => meld.length === 4).length;

        // 总刻子数量
        const totalKouCount = ankoCount + ponCount + minkanCount;

        // 三暗刻的条件：
        // 1. 至少有3个暗刻
        // 2. 总刻子数量必须至少为3
        // 3. 暗刻数量加上明杠数量必须至少为3（因为明杠虽然明示，但仍然算作暗刻）
        return ankoCount >= 3 && totalKouCount >= 3 && (ankoCount + minkanCount) >= 3;
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