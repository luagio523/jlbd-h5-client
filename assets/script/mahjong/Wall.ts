// Wall.ts

import { Tile } from './Tile';

export class Wall {
  private tiles: Tile[] = [];

  constructor() {
    this.initialize();
  }

  // 初始化牌山
  private initialize(): void {
    // 使用 Tile.createFullSet() 创建一整副麻将牌
    this.tiles = Tile.createFullSet();
    // 初始化后立即洗牌
    this.shuffle();
  }

  // 洗牌
  public shuffle(): void {
    for (let i = this.tiles.length - 1; i > 0; i--) {
      // 生成一个随机索引
      const j = Math.floor(Math.random() * (i + 1));
      // 交换当前牌和随机位置的牌
      [this.tiles[i], this.tiles[j]] = [this.tiles[j], this.tiles[i]];
    }
  }

  // 从牌山顶部抽一张牌
  public draw(): Tile | undefined {
    return this.tiles.pop();
  }

  // 从牌山底部抽一张牌（用于抓宝牌指示牌）
  public drawBottom(): Tile | undefined {
    return this.tiles.shift();
  }

  // 获取牌山剩余牌数
  public remainingTiles(): number {
    return this.tiles.length;
  }

  // 检查牌山是否为空
  public isEmpty(): boolean {
    return this.tiles.length === 0;
  }

  // 重置牌山
  public reset(): void {
    this.initialize();
  }

  // 获取当前牌山状态（仅用于调试）
  public getState(): Tile[] {
    return [...this.tiles];
  }
}



// // 创建牌山
// const wall = new Wall();

// console.log(wall.remainingTiles()); // 输出: 136（初始牌数）

// // 模拟摸牌
// const drawnTile = wall.draw();
// if (drawnTile) {
//   console.log(`摸到的牌: ${drawnTile.toString()}`);
// } else {
//   console.log('牌山已空');
// }

// console.log(wall.remainingTiles()); // 输出: 135（摸了一张牌后的剩余数量）

// // 模拟抓宝牌指示牌
// const doraTile = wall.drawBottom();
// if (doraTile) {
//   console.log(`宝牌指示牌: ${doraTile.toString()}`);
// }

// // 重置牌山
// wall.reset();
// console.log(wall.remainingTiles()); // 输出: 136（重置后的牌数）
