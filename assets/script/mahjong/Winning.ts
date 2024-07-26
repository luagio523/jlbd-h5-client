// WinningHandChecker.ts

import { Tile, TileType } from "./Tile";

export class Winning {
	static canWin(hand: Tile[], melds: Tile[][]): boolean {
		// 检查手牌和副露的总数量是否为14
		const totalTiles = hand.length + melds.reduce((acc, meld) => acc + meld.length, 0);
		if (totalTiles !== 14) return false;

		// 将手牌按类型和数字排序
		const sortedHand = [...hand].sort((a, b) => {
			if (a.type !== b.type) {
				return a.type.localeCompare(b.type);
			}
			return (a.value as number) - (b.value as number);
		});

		// 检查是否符合基本和牌形态（四组面子加一对雀头）
		return this.isWinningHand(sortedHand, melds);
	}

	private static isWinningHand(hand: Tile[], melds: Tile[][]): boolean {
		// 首先检查已经形成的面子（melds）
		if (melds.length > 4) return false;
		if (melds.length === 4) {
			// 如果已经有4个面子，那么手牌中剩下的必须是对子
			return hand.length === 2 && hand[0].type === hand[1].type && hand[0].value === hand[1].value;
		}

		// 尝试从手牌中找出对子作为雀头
		for (let i = 0; i < hand.length - 1; i++) {
			if (hand[i].type === hand[i + 1].type && hand[i].value === hand[i + 1].value) {
				const remainingTiles = hand.slice(0, i).concat(hand.slice(i + 2));
				if (this.isValidMentsu(remainingTiles, melds)) {
					return true;
				}
			}
		}
		return false;
	}

	private static isValidMentsu(tiles: Tile[], melds: Tile[][]): boolean {
		if (tiles.length === 0 && melds.length === 4) return true;
		if (melds.length === 4) return false;

		const firstTile = tiles[0];
		const sameTiles = tiles.filter(t => t.type === firstTile.type && t.value === firstTile.value);

		// 检查刻子
		if (sameTiles.length >= 3) {
			const newMelds = [...melds, sameTiles.slice(0, 3)];
			const remainingTiles = tiles.filter(t => !sameTiles.slice(0, 3).includes(t));
			if (this.isValidMentsu(remainingTiles, newMelds)) {
				return true;
			}
		}

		// 检查顺子
		if (firstTile.type === TileType.Man || firstTile.type === TileType.Pin || firstTile.type === TileType.Sou) {
			const secondTile = tiles.find(t => t.type === firstTile.type && t.value === (firstTile.value as number) + 1);
			const thirdTile = tiles.find(t => t.type === firstTile.type && t.value === (firstTile.value as number) + 2);
			if (secondTile && thirdTile) {
				const newMelds = [...melds, [firstTile, secondTile, thirdTile]];
				const remainingTiles = tiles.filter(t => t !== firstTile && t !== secondTile && t !== thirdTile);
				if (this.isValidMentsu(remainingTiles, newMelds)) {
					return true;
				}
			}
		}

		return false;
	}
}
