// WinningHandChecker.ts

import { Tile, TileType } from "../Tile";

export class WinningHand{
  static canWin(hand: Tile[], melds: Tile[][]): boolean {
    const totalTiles = hand.length + melds.reduce((acc, meld) => acc + meld.length, 0);
    if (totalTiles !== 14) return false;

    const sortedHand = this.sortTiles(hand);
    
    return this.verifyStandard(sortedHand, melds) || 
           this.isSevenPairs(sortedHand) || 
           this.isThirteenOrphans(sortedHand);
  }

  private static sortTiles(tiles: Tile[]): Tile[] {
    return [...tiles].sort((a, b) => {
      if (a.type !== b.type) return a.type.localeCompare(b.type);
      return (a.value as number) - (b.value as number);
    });
  }

  private static verifyStandard(hand: Tile[], melds: Tile[][]): boolean {
    if (melds.length > 4) return false;
    if (melds.length === 4) return this.isPair(hand);

    const tileCount = this.countTiles(hand);

    for (const [key, count] of tileCount.entries()) {
      if (count >= 2) {
        const [type, value] = key.split('-');
        const pair = hand.filter(t => t.type === type && t.value === Number(value)).slice(0, 2);
        const remainingTiles = hand.filter(t => !pair.includes(t));
        if (this.isValidMentsu(remainingTiles, melds)) return true;
      }
    }
    return false;
  }

  private static isPair(tiles: Tile[]): boolean {
    return tiles.length === 2 && tiles[0].type === tiles[1].type && tiles[0].value === tiles[1].value;
  }

  private static countTiles(tiles: Tile[]): Map<string, number> {
    const count = new Map<string, number>();
    for (const tile of tiles) {
      const key = `${tile.type}-${tile.value}`;
      count.set(key, (count.get(key) || 0) + 1);
    }
    return count;
  }

  private static isValidMentsu(tiles: Tile[], melds: Tile[][]): boolean {
    if (tiles.length === 0 && melds.length === 4) return true;
    if (melds.length === 4) return false;

    const tileCount = this.countTiles(tiles);

    // Check for triplet
    for (const [key, count] of tileCount.entries()) {
      if (count >= 3) {
        const [type, value] = key.split('-');
        const triplet = tiles.filter(t => t.type === type && t.value === Number(value)).slice(0, 3);
        const newMelds = [...melds, triplet];
        const remainingTiles = tiles.filter(t => !triplet.includes(t));
        if (this.isValidMentsu(remainingTiles, newMelds)) return true;
      }
    }

    // Check for sequence
    const sequenceTypes = [TileType.Man, TileType.Pin, TileType.Sou];
    for (const type of sequenceTypes) {
      for (let i = 1; i <= 7; i++) {
        const sequence = [
          tiles.find(t => t.type === type && t.value === i),
          tiles.find(t => t.type === type && t.value === i + 1),
          tiles.find(t => t.type === type && t.value === i + 2)
        ];
        if (sequence.every(Boolean)) {
          const newMelds = [...melds, sequence as Tile[]];
          const remainingTiles = tiles.filter(t => !sequence.includes(t));
          if (this.isValidMentsu(remainingTiles, newMelds)) return true;
        }
      }
    }

    return false;
  }

  private static isSevenPairs(hand: Tile[]): boolean {
    if (hand.length !== 14) return false;
    const tileCount = this.countTiles(hand);
    return Array.from(tileCount.values()).every(count => count === 2);
  }

  private static isThirteenOrphans(hand: Tile[]): boolean {
    if (hand.length !== 14) return false;
    const requiredTiles = [
      '1m', '9m', '1p', '9p', '1s', '9s',
      'east', 'south', 'west', 'north',
      'white', 'green', 'red'
    ];
    const handSet = new Set(hand.map(t => `${t.value}${t.type[0]}`));
    return requiredTiles.every(t => handSet.has(t)) && handSet.size === 14;
  }
}
