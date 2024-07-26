// 使用影响图优化的方案
// 初始路径计算：使用A*或其他寻路算法计算初始路径。
// 影响图更新：每帧更新影响图，包括：
// 主角位置（正面影响）
// 障碍物位置（负面影响）
// 其他怪物位置（轻微负面影响）
// 怪物移动：
// 主要遵循初始路径
// 使用影响图进行局部调整，避开障碍物和其他怪物
// 路径重新计算条件：
// 当怪物偏离初始路径超过一定距离
// 当主角移动距离超过阈值
// 定期更新（例如每几秒）
// 实现示例
// typescript
// class Monster extends cc.Component {
//     speed: number = 5;
//     path: cc.Vec3[] = [];
//     currentPathIndex: number = 0;
//     lastPathfindingTime: number = 0;
//     pathfindingInterval: number = 5; // 5秒重新寻路一次
//     maxDeviationDistance: number = 5; // 最大偏离距离

//     update(dt: number) {
//         const currentTime = Date.now() / 1000;
//         const playerPosition = gameManager.player.position;

//         // 检查是否需要重新寻路
//         if (this.shouldRecalculatePath(currentTime, playerPosition)) {
//             this.path = gameManager.navigationGrid.findPath(this.node.position, playerPosition);
//             this.currentPathIndex = 0;
//             this.lastPathfindingTime = currentTime;
//         }

//         if (this.path.length === 0) {
//             return;
//         }

//         const targetPosition = this.path[this.currentPathIndex];
//         const influenceMap = gameManager.influenceMap;
//         const influenceDirection = this.getInfluenceDirection(influenceMap);

//         // 混合路径方向和影响图方向
//         const pathDirection = targetPosition.subtract(this.node.position).normalize();
//         const combinedDirection = pathDirection.add(influenceDirection.multiplyScalar(0.3)).normalize();

//         // 移动怪物
//         const newPosition = this.node.position.add(combinedDirection.multiplyScalar(this.speed * dt));

//         // 检查新位置是否可通行
//         if (this.isPositionWalkable(newPosition)) {
//             this.node.position = newPosition;
//         } else {
//             // 如果不可通行，尝试仅沿影响图方向移动
//             const influenceOnlyPosition = this.node.position.add(influenceDirection.multiplyScalar(this.speed * dt));
//             if (this.isPositionWalkable(influenceOnlyPosition)) {
//                 this.node.position = influenceOnlyPosition;
//             }
//             // 如果仍然不可通行，保持原位置
//         }

//         // 更新路径索引
//         if (this.node.position.subtract(targetPosition).length() < 1.0) {
//             this.currentPathIndex++;
//         }
//     }

//     shouldRecalculatePath(currentTime: number, playerPosition: cc.Vec3): boolean {
//         // 定期重新寻路
//         if (currentTime - this.lastPathfindingTime > this.pathfindingInterval) {
//             return true;
//         }

//         // 玩家移动距离过大
//         if (playerPosition.subtract(this.path[this.path.length - 1]).length() > this.maxDeviationDistance) {
//             return true;
//         }

//         // 怪物偏离路径过远
//         if (this.currentPathIndex < this.path.length) {
//             const currentTarget = this.path[this.currentPathIndex];
//             if (this.node.position.subtract(currentTarget).length() > this.maxDeviationDistance) {
//                 return true;
//             }
//         }

//         return false;
//     }

//     getInfluenceDirection(influenceMap: InfluenceMap): cc.Vec3 {
//         // 简化版：检查周围8个方向的影响值
//         const directions = [
//             {dx: -1, dy: -1}, {dx: 0, dy: -1}, {dx: 1, dy: -1},
//             {dx: -1, dy: 0},                   {dx: 1, dy: 0},
//             {dx: -1, dy: 1},  {dx: 0, dy: 1},  {dx: 1, dy: 1}
//         ];

//         let bestDirection = cc.v3(0, 0, 0);
//         let maxInfluence = -Infinity;

//         const {row, col} = influenceMap.worldToGrid(this.node.position);

//         for (const dir of directions) {
//             const newRow = row + dir.dy;
//             const newCol = col + dir.dx;
//             if (newRow >= 0 && newRow < influenceMap.grid.length &&
//                 newCol >= 0 && newCol < influenceMap.grid[0].length) {
//                 const influence = influenceMap.grid[newRow][newCol];
//                 if (influence > maxInfluence) {
//                     maxInfluence = influence;
//                     bestDirection = cc.v3(dir.dx, dir.dy, 0);
//                 }
//             }
//         }

//         return bestDirection.normalize();
//     }

//     isPositionWalkable(position: cc.Vec3): boolean {
//         // 检查位置是否在障碍物上
//         // 这里需要根据你的游戏逻辑实现
//         return true; // 示例返回值
//     }
// }