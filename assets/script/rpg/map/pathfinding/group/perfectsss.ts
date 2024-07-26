// 实现步骤
// 分组和领导者设置：将怪物分成多个小组，每个小组有一个领导者。
// 全局路径规划：使用A*算法或其他全局寻路算法来计算从当前区域到目标区域的路径。
// 动态目标分配：计算怪物的目标位置，确保怪物均匀分布在主角周围。
// RVO动态避障：在接近目标位置时，使用RVO算法进行动态避障，避免怪物之间的碰撞。
// 代码示例
// 1. 分组和领导者设置
// typescript
// class GameManager extends cc.Component {
//     player: cc.Node;
//     monsters: Monster[];
//     maxMonstersPerCircle: number = 8; // 每圈最大怪物数量
//     rvoSimulator: RVO.Simulator;
//     navigationGrid: NavigationGrid; // 导航网格，用于路径规划

//     start() {
//         // 初始化RVO模拟器
//         this.rvoSimulator = new RVO.Simulator(0.25, 5, 5, 5, 5, 0.5, 2);
//         this.navigationGrid = new NavigationGrid(fullMapGrid); // 假设fullMapGrid是地图数据
//         this.groupMonsters();
//     }

//     update(dt: number) {
//         const sortedMonsters = this.sortMonstersByDistanceToPlayer();
//         const targetPositions = this.calculateTargetPositions(this.player.position, sortedMonsters.length);
        
//         for (let i = 0; i < sortedMonsters.length; i++) {
//             sortedMonsters[i].setTarget(targetPositions[i]);
//         }

//         // 更新RVO模拟器
//         this.rvoSimulator.doStep();
//     }

//     groupMonsters() {
//         // 将怪物分成多个小组，每个小组有一个领导者
//         const groupSize = 5; // 每组5个怪物
//         for (let i = 0; i < this.monsters.length; i += groupSize) {
//             const group = this.monsters.slice(i, i + groupSize);
//             const leader = group[0];
//             leader.isLeader = true;
//             for (let j = 1; j < group.length; j++) {
//                 group[j].setLeader(leader);
//             }
//         }
//     }

//     sortMonstersByDistanceToPlayer(): Monster[] {
//         return this.monsters.slice().sort((a, b) => {
//             const distA = this.player.position.subtract(a.node.position).lengthSqr();
//             const distB = this.player.position.subtract(b.node.position).lengthSqr();
//             return distA - distB;
//         });
//     }

//     calculateTargetPositions(center: cc.Vec3, count: number): cc.Vec3[] {
//         const positions = [];
//         let currentRadius = 5; // 初始半径
//         let monstersInCurrentCircle = 0;
//         let currentCircle = 0;

//         for (let i = 0; i < count; i++) {
//             if (monstersInCurrentCircle >= this.maxMonstersPerCircle) {
//                 currentCircle++;
//                 currentRadius += 3; // 增加半径
//                 monstersInCurrentCircle = 0;
//             }

//             const angle = (monstersInCurrentCircle / this.maxMonstersPerCircle) * 2 * Math.PI;
//             const x = center.x + currentRadius * Math.cos(angle);
//             const y = center.y + currentRadius * Math.sin(angle);
//             positions.push(cc.v3(x, y, 0));

//             monstersInCurrentCircle++;
//         }

//         return positions;
//     }
// }

// 2. 全局路径规划
// typescript
// class NavigationGrid {
//     grid: number[][];

//     constructor(grid: number[][]) {
//         this.grid = grid;
//     }

//     findPath(start: cc.Vec3, end: cc.Vec3): cc.Vec3[] {
//         // 使用A*算法或其他全局寻路算法来计算路径
//         // 这里只是一个示例实现
//         const openList = [];
//         const closedList = new Set();
//         const startNode = { position: start, g: 0, h: this.heuristic(start, end), f: 0, parent: null };
//         startNode.f = startNode.g + startNode.h;
//         openList.push(startNode);

//         while (openList.length > 0) {
//             openList.sort((a, b) => a.f - b.f);
//             const currentNode = openList.shift();

//             if (currentNode.position.equals(end)) {
//                 return this.reconstructPath(currentNode);
//             }

//             closedList.add(currentNode.position.toString());

//             const neighbors = this.getNeighbors(currentNode.position);
//             for (const neighbor of neighbors) {
//                 if (closedList.has(neighbor.toString())) {
//                     continue;
//                 }

//                 const gScore = currentNode.g + this.distance(currentNode.position, neighbor);
//                 let neighborNode = openList.find(node => node.position.equals(neighbor));

//                 if (!neighborNode) {
//                     neighborNode = { position: neighbor, g: gScore, h: this.heuristic(neighbor, end), f: 0, parent: currentNode };
//                     neighborNode.f = neighborNode.g + neighborNode.h;
//                     openList.push(neighborNode);
//                 } else if (gScore < neighborNode.g) {
//                     neighborNode.g = gScore;
//                     neighborNode.f = neighborNode.g + neighborNode.h;
//                     neighborNode.parent = currentNode;
//                 }
//             }
//         }

//         return []; // 未找到路径
//     }

//     private getNeighbors(position: cc.Vec3): cc.Vec3[] {
//         const neighbors = [];
//         const directions = [
//             cc.v3(-1, 0, 0), cc.v3(1, 0, 0),
//             cc.v3(0, -1, 0), cc.v3(0, 1, 0)
//         ];

//         for (const dir of directions) {
//             const neighbor = position.add(dir);
//             if (this.isWalkable(neighbor)) {
//                 neighbors.push(neighbor);
//             }
//         }

//         return neighbors;
//     }

//     private isWalkable(position: cc.Vec3): boolean {
//         const row = Math.floor(position.y);
//         const col = Math.floor(position.x);
//         return this.grid[row] && this.grid[row][col] === 1; // 1表示可通行，0表示不可通行
//     }

//     private heuristic(a: cc.Vec3, b: cc.Vec3): number {
//         return Math.abs(a.x - b.x) + Math.abs(a.y - b.y); // 曼哈顿距离
//     }

//     private distance(a: cc.Vec3, b: cc.Vec3): number {
//         return a.subtract(b).length();
//     }

//     private reconstructPath(node): cc.Vec3[] {
//         const path = [];
//         let currentNode = node;
//         while (currentNode) {
//             path.unshift(currentNode.position);
//             currentNode = currentNode.parent;
//         }
//         return path;
//     }
// }

// 3. 怪物类实现
// typescript
// class Monster extends cc.Component {
//     speed: number = 5;
//     target: cc.Vec3;
//     arrivalThreshold: number = 0.5;
//     rvoAgent: RVO.Agent;
//     isLeader: boolean = false;
//     leader: Monster;
//     path: cc.Vec3[] = [];
//     currentPathIndex: number = 0;

//     start() {
//         // 在RVO模拟器中添加代理
//         this.rvoAgent = gameManager.rvoSimulator.addAgent(
//             new RVO.Vector2(this.node.position.x, this.node.position.y)
//         );
//     }

//     setTarget(target: cc.Vec3) {
//         this.target = target;
//         if (this.isLeader) {
//             this.path = gameManager.navigationGrid.findPath(this.node.position, target);
//             this.currentPathIndex = 0;
//         }
//     }

//     setLeader(leader: Monster) {
//         this.leader = leader;
//     }

//     update(dt: number) {
//         if (this.isLeader && this.path.length > 0) {
//             this.moveToTarget(dt);
//         } else if (this.leader) {
//             this.followLeader(dt);
//         }

//         // 更新怪物位置
//         const newPosition = gameManager.rvoSimulator.getAgentPosition(this.rvoAgent);
//         this.node.position = cc.v3(newPosition.x(), newPosition.y(), 0);
//     }

//     moveToTarget(dt: number) {
//         if (this.currentPathIndex >= this.path.length) {
//             return;
//         }

//         const targetPosition = this.path[this.currentPathIndex];
//         const direction = targetPosition.subtract(this.node.position);
//         const distance = direction.length();

//         if (distance > this.arrivalThreshold) {
//             const normalizedDirection = direction.normalize();
//             const velocity = normalizedDirection.multiplyScalar(this.speed);
            
//             // 设置RVO代理的首选速度
//             gameManager.rvoSimulator.setAgentPrefVelocity(
//                 this.rvoAgent,
//                 new RVO.Vector2(velocity.x, velocity.y)
//             );
//         } else {
//             this.currentPathIndex++;
//         }
//     }

//     followLeader(dt: number) {
//         const leaderPosition = this.leader.node.position;
//         const direction = leaderPosition.subtract(this.node.position);
//         const distance = direction.length();

//         if (distance > this.arrivalThreshold) {
//             const normalizedDirection = direction.normalize();
//             const velocity = normalizedDirection.multiplyScalar(this.speed);
            
//             // 设置RVO代理的首选速度
//             gameManager.rvoSimulator.setAgentPrefVelocity(
//                 this.rvoAgent,
//                 new RVO.Vector2(velocity.x, velocity.y)
//             );
//         } else {
//             // 如果接近目标，停止移动
//             gameManager.rvoSimulator.setAgentPrefVelocity(
//                 this.rvoAgent,
//                 new RVO.Vector2(0, 0)
//             );
//         }
//     }
// }

// 总结
// 通过结合RVO算法、分组方法和全局路径规划，可以实现更加有组织和智能的群体行为。具体步骤包括：
// 分组和领导者设置：将怪物分成多个小组，每个小组有一个领导者。
// 全局路径规划：使用A*算法或其他全局寻路算法来计算从当前区域到目标区域的路径。
// 动态目标分配：计算怪物的目标位置，确保怪物均匀分布在主角周围。
// RVO动态避障：在接近目标位置时，使用RVO算法进行动态避障，避免怪物之间的碰撞。
// 这种方法既利用了RVO算法的高效避障能力，又通过分组和领导者设置实现了有组织的群体行为，非常适合模拟RTS游戏中的单位移动。如果您有任何其他问题或需要进一步的帮助，请随时告诉我。
