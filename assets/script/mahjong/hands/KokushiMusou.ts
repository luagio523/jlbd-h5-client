//国士无双的检查逻辑

import { Tile, TileType } from "../Tile";

export class KokushiMusou {
    public static verifyKokushiMusou(hand: Tile[]): boolean {
        if (hand.length !== 14) return false;
    
        const requiredTiles = [
            { type: TileType.Man, value: 1 },
            { type: TileType.Man, value: 9 },
            { type: TileType.Pin, value: 1 },
            { type: TileType.Pin, value: 9 },
            { type: TileType.Sou, value: 1 },
            { type: TileType.Sou, value: 9 },
            { type: TileType.Wind, value: 'East' },
            { type: TileType.Wind, value: 'South' },
            { type: TileType.Wind, value: 'West' },
            { type: TileType.Wind, value: 'North' },
            { type: TileType.Dragon, value: 'White' },
            { type: TileType.Dragon, value: 'Green' },
            { type: TileType.Dragon, value: 'Red' }
        ];
    
        // 检查是否包含所有必需的幺九牌
        for (const requiredTile of requiredTiles) {
            if (!hand.some(tile => tile.type === requiredTile.type && tile.value === requiredTile.value)) {
                return false;
            }
        }
    
        // 检查是否有一个对子
        const pairs = hand.filter(tile =>
            hand.filter(t => t.type === tile.type && t.value === tile.value).length === 2
        );
    
        return pairs.length === 2; // 因为每个对子会被计算两次
    }
}



