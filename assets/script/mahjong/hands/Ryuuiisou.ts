import { Tile, TileType, DragonType } from "../Tile";
//绿一色
export class Ryuuiisou {
    public static verifyRyuuiisou(hand: Tile[], melds: Tile[][]): boolean {
        // 展开嵌套数组
        const meldTiles = melds.reduce((acc, meld) => acc.concat(meld), []);
        
        // 检查总牌数是否为14张
        const totalTiles = hand.length + meldTiles.length;
        if (totalTiles !== 14) {
            return false;
        }

        // 定义绿色的牌
        const greenTiles = [
            { type: TileType.Sou, values: [2, 3, 4, 6, 8] },
            { type: TileType.Dragon, value: DragonType.Green }
        ];

        // 检查所有牌是否都是绿色的
        const isGreen = (tile: Tile): boolean => {
            if (tile.type === TileType.Dragon && tile.value === DragonType.Green) {
                return true;
            }
            if (tile.type === TileType.Sou && greenTiles[0].values.includes(tile.value as number)) {
                return true;
            }
            return false;
        };

        // 检查手牌
        for (const tile of hand) {
            if (!isGreen(tile)) {
                return false;
            }
        }

        // 检查鸣牌
        for (const tile of meldTiles) {
            if (!isGreen(tile)) {
                return false;
            }
        }

        // 如果所有牌都通过了检查，则是绿一色
        return true;
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