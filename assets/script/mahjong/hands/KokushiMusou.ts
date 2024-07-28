import { Tile, TileType, WindType, DragonType } from "../Tile";
//国士无双

export class KokushiMusou {
    // 国士无双所需的13种幺九牌
    private static readonly REQUIRED_TILES: Array<[TileType, number | WindType | DragonType]> = [
        [TileType.Man, 1], [TileType.Man, 9],
        [TileType.Pin, 1], [TileType.Pin, 9],
        [TileType.Sou, 1], [TileType.Sou, 9],
        [TileType.Wind, WindType.East], [TileType.Wind, WindType.South],
        [TileType.Wind, WindType.West], [TileType.Wind, WindType.North],
        [TileType.Dragon, DragonType.White], [TileType.Dragon, DragonType.Green],
        [TileType.Dragon, DragonType.Red]
    ];

    /**
     * 统计手牌中每种牌的数量
     * @param hand 手牌数组
     * @returns 包含每种牌数量的Map
     */
    private static countTiles(hand: Tile[]): Map<string, number> {
        const tileCount = new Map<string, number>();
        for (const tile of hand) {
            const key = `${tile.type}-${tile.value}`;
            tileCount.set(key, (tileCount.get(key) || 0) + 1);
        }
        return tileCount;
    }

    /**
     * 验证是否为国士无双和牌
     * @param hand 手牌数组
     * @returns 是否为国士无双和牌
     */
    public static verifyKokushiMusou(hand: Tile[]): boolean {
        if (hand.length !== 14) return false;

        const tileCount = this.countTiles(hand);
        let pairFound = false;

        for (const [type, value] of this.REQUIRED_TILES) {
            const key = `${type}-${value}`;
            const count = tileCount.get(key) || 0;
            
            if (count === 0) return false;
            if (count === 2) {
                if (pairFound) return false; // 只允许一个对子
                pairFound = true;
            }
            if (count > 2) return false; // 不允许有三张或以上相同的牌
        }

        return pairFound; // 必须有一个对子
    }

    /**
     * 检查是否为国士无双听牌
     * @param hand 手牌数组
     * @returns 是否为国士无双听牌
     */
    public static isKokushiMusouTenpai(hand: Tile[]): boolean {
        if (hand.length !== 13) return false;

        const tileCount = this.countTiles(hand);
        let uniqueTilesCount = 0;

        for (const [type, value] of this.REQUIRED_TILES) {
            const key = `${type}-${value}`;
            const count = tileCount.get(key) || 0;
            
            if (count === 1) uniqueTilesCount++;
            if (count > 1) return false; // 听牌状态不允许有对子
        }

        return uniqueTilesCount === 13; // 必须包含全部13种幺九牌
    }

    /**
     * 验证是否为国士无双十三面听
     * @param hand 手牌数组
     * @returns 是否为国士无双十三面听
     */
    public static verifyKokushiMusouThirteenWait(hand: Tile[]): boolean {
        return this.isKokushiMusouTenpai(hand);
    }

    /**
     * 获取国士无双听牌时的待牌
     * @param hand 手牌数组
     * @returns 待牌数组
     */
    public static getKokushiMusouWaitingTiles(hand: Tile[]): Tile[] {
        if (!this.isKokushiMusouTenpai(hand)) return [];

        const tileSet = new Set(hand.map(tile => `${tile.type}-${tile.value}`));
        return this.REQUIRED_TILES
            .filter(([type, value]) => !tileSet.has(`${type}-${value}`))
            .map(([type, value]) => {
                switch (type) {
                    case TileType.Man:
                    case TileType.Pin:
                    case TileType.Sou:
                        return new Tile(type, value as number);
                    case TileType.Wind:
                        return Tile.createWind(value as WindType);
                    case TileType.Dragon:
                        return Tile.createDragon(value as DragonType);
                    default:
                        throw new Error(`无效的牌型: ${type}`);
                }
            });
    }
}


