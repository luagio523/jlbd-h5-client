// // 假设我们有一个游戏场景，其中：
// 玩家位于某个位置。
// 有一些障碍物。
// 怪物需要追踪玩家，同时避开障碍物。
// 导航格子（Navigation Grid）
// 首先，我们使用导航格子来表示地图上的可通过性。这可以帮助怪物找到一条从当前位置到玩家位置的基本路径。
// typescript
// class NavigationGrid {
//     grid: number[][];
//     cellSize: number;

//     constructor(mapWidth: number, mapHeight: number, cellSize: number) {
//         this.cellSize = cellSize;
//         const cols = Math.ceil(mapWidth / cellSize);
//         const rows = Math.ceil(mapHeight / cellSize);
//         this.grid = Array(rows).fill(0).map(() => Array(cols).fill(1)); // 1表示可通过，0表示不可通过
//     }

//     setObstacle(position: cc.Vec3) {
//         const {row, col} = this.worldToGrid(position);
//         this.grid[row][col] = 0;
//     }

//     worldToGrid(position: cc.Vec3): {row: number, col: number} {
//         return {
//             row: Math.floor(position.y / this.cellSize),
//             col: Math.floor(position.x / this.cellSize)
//         };
//     }

//     // A*算法或其他寻路算法
//     findPath(start: cc.Vec3, end: cc.Vec3): cc.Vec3[] {
//         // 实现寻路算法
//         return [];
//     }
// }

// 影响图（Influence Map）
// 然后，我们使用影响图来表示地图上的动态影响力。这可以帮助怪物在追踪玩家时避开障碍物和其他怪物。
// typescript
// class InfluenceMap {
//     grid: number[][];
//     cellSize: number;

//     constructor(mapWidth: number, mapHeight: number, cellSize: number) {
//         this.cellSize = cellSize;
//         const cols = Math.ceil(mapWidth / cellSize);
//         const rows = Math.ceil(mapHeight / cellSize);
//         this.grid = Array(rows).fill(0).map(() => Array(cols).fill(0));
//     }

//     setInfluence(position: cc.Vec3, value: number, radius: number) {
//         const {row, col} = this.worldToGrid(position);
//         const radiusCells = Math.ceil(radius / this.cellSize);

//         for (let i = -radiusCells; i <= radiusCells; i++) {
//             for (let j = -radiusCells; j <= radiusCells; j++) {
//                 const distance = Math.sqrt(i*i + j*j) * this.cellSize;
//                 if (distance <= radius) {
//                     const influence = value * (1 - distance / radius);
//                     this.addInfluence(row + i, col + j, influence);
//                 }
//             }
//         }
//     }

//     addInfluence(row: number, col: number, value: number) {
//         if (row >= 0 && row < this.grid.length && col >= 0 && col < this.grid[0].length) {
//             this.grid[row][col] += value;
//         }
//     }

//     worldToGrid(position: cc.Vec3): {row: number, col: number} {
//         return {
//             row: Math.floor(position.y / this.cellSize),
//             col: Math.floor(position.x / this.cellSize)
//         };
//     }
// }

// 更新影响图
// 在每一帧中，我们更新影响图，以反映玩家、障碍物和怪物的位置。
// typescript
// class GameManager extends cc.Component {
//     influenceMap: InfluenceMap;
//     navigationGrid: NavigationGrid;
//     player: cc.Node;
//     monsters: cc.Node[];
//     obstacles: cc.Node[];

//     updateInfluenceMap() {
//         // 重置影响图
//         this.influenceMap.grid.forEach(row => row.fill(0));

//         // 设置玩家的正面影响
//         this.influenceMap.setInfluence(this.player.position, 100, 50);

//         // 设置怪物的轻微负面影响
//         this.monsters.forEach(monster => {
//             this.influenceMap.setInfluence(monster.position, -20, 30);
//         });

//         // 设置障碍物的负面影响
//         this.obstacles.forEach(obstacle => {
//             this.influenceMap.setInfluence(obstacle.position, -100, 20);
//         });
//     }

//     update(dt: number) {
//         this.updateInfluenceMap();
//         // 其他游戏逻辑...
//     }
// }

// 怪物移动逻辑
// 怪物使用导航格子找到基本路径，然后使用影响图来调整移动方向，以避开障碍物和其他怪物。
// typescript
// class Monster extends cc.Component {
//     speed: number = 5;
//     path: cc.Vec3[] = [];
//     currentPathIndex: number = 0;

//     update(dt: number) {
//         if (this.path.length === 0 || this.currentPathIndex >= this.path.length) {
//             this.path = gameManager.navigationGrid.findPath(this.node.position, gameManager.player.position);
//             this.currentPathIndex = 0;
//         }

//         const influenceMap = gameManager.influenceMap;
//         const {row, col} = influenceMap.worldToGrid(this.node.position);

//         // 检查周围8个方向的影响值
//         const directions = [
//             {dx: -1, dy: -1}, {dx: 0, dy: -1}, {dx: 1, dy: -1},
//             {dx: -1, dy: 0},                   {dx: 1, dy: 0},
//             {dx: -1, dy: 1},  {dx: 0, dy: 1},  {dx: 1, dy: 1}
//         ];

//         let bestDirection = {dx: 0, dy: 0};
//         let maxInfluence = influenceMap.grid[row][col];

//         for (const dir of directions) {
//             const newRow = row + dir.dy;
//             const newCol = col + dir.dx;
//             if (newRow >= 0 && newRow < influenceMap.grid.length &&
//                 newCol >= 0 && newCol < influenceMap.grid[0].length) {
//                 const influence = influenceMap.grid[newRow][newCol];
//                 if (influence > maxInfluence) {
//                     maxInfluence = influence;
//                     bestDirection = dir;
//                 }
//             }
//         }

//         // 移动到影响力最大的方向
//         const moveDirection = cc.v3(bestDirection.dx, bestDirection.dy, 0).normalize();
//         this.node.position = this.node.position.add(moveDirection.multiplyScalar(this.speed * dt));

//         // 更新路径索引
//         if (this.node.position.subtract(this.path[this.currentPathIndex]).length() < 0.1) {
//             this.currentPathIndex++;
//         }
//     }
// }

// 处理玩家方向与障碍方向一致的情况
// 如果玩家方向与障碍方向一致，影响图可以帮助怪物选择一个更好的路径。例如，如果玩家在障碍物后面，影响图会在障碍物周围产生负面影响，迫使怪物选择一个绕过障碍物的路径。
// 通过这种方式，影响图和导航格子可以协同工作，解决复杂的路径规划问题。导航格子提供了基本的路径，而影响图则用于动态调整怪物的移动方向，以应对实时变化的游戏环境。