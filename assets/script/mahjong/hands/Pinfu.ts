import { DragonType, Tile, TileType, WindType } from "../Tile";

export class Pinfu {
    /**
     * 验证平和和牌
     * @param hand 手牌数组
     * @param melds 副露数组
     * @param winningTile 和牌
     * @param playerWind 玩家风
     * @param roundWind 圆风
     * @returns 是否为平和和牌
     */
    public static verifyPinfu(hand: Tile[], melds: Tile[][], winningTile: Tile, playerWind: WindType, roundWind: WindType): boolean {
        // 检查是否门前清
        if (melds.length > 0) return false;

        // 检查手牌数量
        if (hand.length !== 14) return false;

        // 检查是否有非役牌雀头
        const pairs = this.findPairs(hand);
        if (pairs.length !== 1 || this.isYakuhai(pairs[0][0], playerWind, roundWind)) {
            return false;
        }

        // 检查是否全部都是顺子
        const sequences = this.findSequences(hand);
        if (sequences.length !== 4) return false;

        // 检查是否有两面待牌
        return this.isTwoSidedWait(sequences, winningTile);
    }

    /**
     * 检查是否为役牌
     * @param tile 待检查的牌
     * @param playerWind 玩家风
     * @param roundWind 圆风
     * @returns 是否为役牌
     */
    private static isYakuhai(tile: Tile, playerWind: WindType, roundWind: WindType): boolean {
        if (tile.type === TileType.Dragon) {
            return true; // 三元牌总是役牌
        }
        if (tile.type === TileType.Wind) {
            return tile.value === playerWind || tile.value === roundWind;
        }
        return false;
    }

    /**
     * 查找对子
     * @param tiles 牌数组
     * @returns 对子数组
     */
    private static findPairs(tiles: Tile[]): Tile[][] {
        const pairs: Tile[][] = [];
        const tileCount: { [key: string]: number } = {};

        tiles.forEach(tile => {
            const key = `${tile.type}-${tile.value}`;
            tileCount[key] = (tileCount[key] || 0) + 1;
        });

        for (const key in tileCount) {
            if (tileCount[key] === 2) {
                const [type, value] = key.split('-');
                const tileType = type as TileType;
                let tileValue: number | WindType | DragonType;

                if (tileType === TileType.Wind) {
                    tileValue = value as WindType;
                } else if (tileType === TileType.Dragon) {
                    tileValue = value as DragonType;
                } else {
                    tileValue = parseInt(value);
                }

                pairs.push([
                    new Tile(tileType, tileValue),
                    new Tile(tileType, tileValue)
                ]);
            }
        }

        return pairs;
    }

    /**
     * 查找顺子
     * @param tiles 牌数组
     * @returns 顺子数组
     */
    private static findSequences(tiles: Tile[]): Tile[][] {
        const sequences: Tile[][] = [];
        const sortedTiles = tiles.filter(tile => tile.type === TileType.Man || tile.type === TileType.Pin || tile.type === TileType.Sou)
            .sort((a, b) => {
                if (a.type !== b.type) {
                    return a.type.localeCompare(b.type);
                }
                return (a.value as number) - (b.value as number);
            });

        const usedTiles = new Set<string>();

        for (let i = 0; i < sortedTiles.length - 2; i++) {
            const tile1 = sortedTiles[i];
            const tile2 = sortedTiles[i + 1];
            const tile3 = sortedTiles[i + 2];

            const key1 = `${tile1.type}-${tile1.value}`;
            const key2 = `${tile2.type}-${tile2.value}`;
            const key3 = `${tile3.type}-${tile3.value}`;

            if (usedTiles.has(key1) || usedTiles.has(key2) || usedTiles.has(key3)) {
                continue;
            }

            if (tile1.type === tile2.type && tile2.type === tile3.type &&
                (tile1.value as number) + 1 === (tile2.value as number) &&
                (tile2.value as number) + 1 === (tile3.value as number)) {
                sequences.push([tile1, tile2, tile3]);
                usedTiles.add(key1);
                usedTiles.add(key2);
                usedTiles.add(key3);
            }
        }

        return sequences;
    }

    /**
     * 检查是否为两面待牌
     * @param sequences 顺子数组
     * @param winningTile 和牌
     * @returns 是否为两面待牌
     */
    private static isTwoSidedWait(sequences: Tile[][], winningTile: Tile): boolean {
        for (const seq of sequences) {
            if (seq.some(tile => tile.type === winningTile.type && tile.value === winningTile.value)) {
                const index = seq.findIndex(tile => tile.type === winningTile.type && tile.value === winningTile.value);
                if (index === 0 && (winningTile.value as number) !== 7) return true;
                if (index === 2 && (winningTile.value as number) !== 3) return true;
                if (index === 1) return true;
            }
        }
        return false;
    }
}



