
import { Tile, TileType } from './Tile';

export class Player {
	hand: Tile[] = []; // 手牌
	discards: Tile[] = []; // 弃牌
	riichi: boolean = false; // 是否立直
	points: number = 25000; // 初始点数
	melds: Tile[][] = []; // 用于存储吃、碰、杠的面子
	// 摸牌
	drawTile(tile: Tile): void {
		this.hand.push(tile);
	}

	// 切牌
	discardTile(tile: Tile): void {
		const index = this.hand.indexOf(tile);
		if (index > -1) {
			this.hand.splice(index, 1);
			this.discards.push(tile);
		}
	}
	//能吃牌
	canChow(discardedTile: Tile): boolean {
		if (discardedTile.type !== TileType.Man && discardedTile.type !== TileType.Pin && discardedTile.type !== TileType.Sou) {
			return false;
		}
		const value = discardedTile.value as number;
		const type = discardedTile.type;
		const hasLeft = this.hand.some(t => t.type === type && t.value === value - 1);
		const hasRight = this.hand.some(t => t.type === type && t.value === value + 1);
		const hasBoth = this.hand.some(t => t.type === type && t.value === value - 1) &&
			this.hand.some(t => t.type === type && t.value === value + 2);
		return hasLeft && hasRight || hasBoth;
	}
	//能碰牌
	canPung(discardedTile: Tile): boolean {
		return this.hand.filter(t => t.type === discardedTile.type && t.value === discardedTile.value).length >= 2;
	}
	//能杠牌
	canKong(discardedTile: Tile): boolean {
		return this.hand.filter(t => t.type === discardedTile.type && t.value === discardedTile.value).length >= 3;
	}

	performChow(discardedTile: Tile): void {
		// 实现吃牌逻辑
		const type = discardedTile.type;
		const value = discardedTile.value as number;
		const chowTiles = this.hand.filter(t =>
			t.type === type && (t.value === value - 1 || t.value === value + 1)
		);
		this.hand = this.hand.filter(t => !chowTiles.includes(t));
		this.melds.push([...chowTiles, discardedTile]);
	}

	performPung(discardedTile: Tile): void {
		// 实现碰牌逻辑
		const pungTiles = this.hand.filter(t =>
			t.type === discardedTile.type && t.value === discardedTile.value
		).slice(0, 2);
		this.hand = this.hand.filter(t => !pungTiles.includes(t));
		this.melds.push([...pungTiles, discardedTile]);
	}

	performKong(discardedTile: Tile): void {
		// 实现杠牌逻辑
		const kongTiles = this.hand.filter(t =>
			t.type === discardedTile.type && t.value === discardedTile.value
		);
		this.hand = this.hand.filter(t => !kongTiles.includes(t));
		this.melds.push([...kongTiles, discardedTile]);
	}

	// 立直
	declareRiichi(): void {
		if (this.canDeclareRiichi()) {
			this.riichi = true;
			this.points -= 1000; // 立直需要支付1000点
		} else {
			throw new Error('无法立直');
		}
	}

	// 判断是否可以立直
	canDeclareRiichi(): boolean {
		// 简单判断：手牌数量为13（摸牌前），且尚未立直
		return this.hand.length === 13 && !this.riichi;
	}

	// 和牌
	declareWin(): void {
		if (this.canDeclareWin()) {
			// 处理和牌逻辑
			console.log('和牌成功');
		} else {
			throw new Error('无法和牌');
		}
	}

	// 判断是否可以和牌
	canDeclareWin(): boolean {
		// 简单判断：手牌数量为14（摸牌后）
		return this.hand.length === 14;
	}

	// 重置玩家状态
	reset(): void {
		this.hand = [];
		this.discards = [];
		this.riichi = false;
	}

	// 获取手牌状态（仅用于调试）
	getHandState(): Tile[] {
		return [...this.hand];
	}

	// 获取弃牌状态（仅用于调试）
	getDiscardsState(): Tile[] {
		return [...this.discards];
	}

	// 获取玩家点数
	getPoints(): number {
		return this.points;
	}

	// 增加点数
	addPoints(points: number): void {
		this.points += points;
	}

	// 减少点数
	subtractPoints(points: number): void {
		this.points -= points;
	}
}



// hand: 手牌数组。
// discards: 弃牌数组。
// riichi: 是否立直的标志。
// points: 玩家点数，初始为25000点。
// 方法:
// drawTile(tile: Tile): 摸牌，将牌添加到手牌中。
// discardTile(tile: Tile): 切牌，将牌从手牌中移除并添加到弃牌中。
// declareRiichi(): 立直操作，如果满足条件则立直并扣除1000点。
// canDeclareRiichi(): 判断是否可以立直。
// declareWin(): 和牌操作，如果满足条件则和牌。
// canDeclareWin(): 判断是否可以和牌。
// reset(): 重置玩家状态，清空手牌和弃牌，重置立直状态。
// getHandState(): 获取当前手牌状态（用于调试）。
// `getDiscardsState(): 获取当前弃牌状态（用于调试）。
// getPoints(): 获取当前点数。
// addPoints(points: number): 增加点数。
// subtractPoints(points: number): 减少点数。



// // 创建玩家
// const player = new Player();

// // 模拟摸牌
// const tile1 = new Tile(TileType.Man, 1);
// const tile2 = new Tile(TileType.Pin, 2);
// player.drawTile(tile1);
// player.drawTile(tile2);

// console.log(player.getHandState()); // 输出: [1m, 2p]

// // 模拟切牌
// player.discardTile(tile1);
// console.log(player.getHandState()); // 输出: [2p]
// console.log(player.getDiscardsState()); // 输出: [1m]

// // 模拟立直
// try {
//   player.declareRiichi();
// } catch (error) {
//   console.log(error.message); // 输出: 无法立直（因为手牌数量不足）
// }

// // 模拟增加点数
// player.addPoints(500);
// console.log(player.getPoints()); // 输出: 25500

// // 模拟减少点数
// player.subtractPoints(1000);
// console.log(player.getPoints()); // 输出: 24500

// // 重置玩家状态
// player.reset();
// console.log(player.getHandState()); // 输出: []
// console.log(player.getDiscardsState()); // 输出: []
// console.log(player.getPoints()); // 输出: 24500（点数不会重置）
