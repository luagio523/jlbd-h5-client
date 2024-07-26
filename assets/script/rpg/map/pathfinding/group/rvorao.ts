// 2. 动态避障和调整
// 结合RVO算法和动态目标分配，使怪物在接近目标位置时能够灵活避开其他怪物。
// 实现步骤：
// 计算目标位置：同上。
// 动态避障：在接近目标位置时，使用RVO算法进行动态避障。
// typescript
// class GameManager extends cc.Component {
//     player: cc.Node;
//     monsters: Monster[];

//     update(dt: number) {
//         const targetPositions = this.calculateTargetPositions(this.player.position, this.monsters.length);
//         for (let i = 0; i < this.monsters.length; i++) {
//             this.monsters[i].setTarget(targetPositions[i]);
//         }
//     }

//     calculateTargetPositions(center: cc.Vec3, count: number): cc.Vec3[] {
//         const positions = [];
//         const radius = 5; // 距离主角的半径
//         for (let i = 0; i < count; i++) {
//             const angle = (i / count) * 2 * Math.PI;
//             const x = center.x + radius * Math.cos(angle);
//             const y = center.y + radius * Math.sin(angle);
//             positions.push(cc.v3(x, y, 0));
//         }
//         return positions;
//     }
// }

// class Monster extends cc.Component {
//     speed: number = 5;
//     target: cc.Vec3;
//     rvoSimulator: RVO.Simulator;

//     setTarget(target: cc.Vec3) {
//         this.target = target;
//     }

//     update(dt: number) {
//         if (this.target) {
//             const direction = this.target.subtract(this.node.position).normalize();
//             const velocity = direction.multiplyScalar(this.speed);
//             this.rvoSimulator.setAgentPrefVelocity(this.node, velocity);

//             // 更新RVO模拟器
//             this.rvoSimulator.doStep();

//             // 获取新的位置
//             const newPosition = this.rvoSimulator.getAgentPosition(this.node);
//             this.node.position = cc.v3(newPosition.x, newPosition.y, 0);
//         }
//     }
// }

// 3. 动态分组和协作
// 将怪物分成多个小组，每个小组有一个领导者，领导者负责接近主角，其他怪物跟随领导者，但保持一定距离。
// 实现步骤：
// 分组：将怪物分成多个小组。
// 领导者：每个小组有一个领导者，领导者负责接近主角。
// 跟随者：其他怪物跟随领导者，但保持一定距离。
// typescript
// class GameManager extends cc.Component {
//     player: cc.Node;
//     monsters: Monster[];

//     update(dt: number) {
//         const groups = this.groupMonsters(this.monsters, 3); // 每组3个怪物
//         groups.forEach(group => {
//             const leader = group[0];
//             const targetPosition = this.calculateTargetPosition(this.player.position);
//             leader.setTarget(targetPosition);

//             for (let i = 1; i < group.length; i++) {
//                 group[i].setLeader(leader);
//             }
//         });
//     }

//     groupMonsters(monsters: Monster[], groupSize: number): Monster[][] {
//         const groups = [];
//         for (let i = 0; i < monsters.length; i += groupSize) {
//             groups.push(monsters.slice(i, i + groupSize));
//         }
//         return groups;
//     }

//     calculateTargetPosition(center: cc.Vec3): cc.Vec3 {
//         const radius = 5; // 距离主角的半径
//         const angle = Math.random() * 2 * Math.PI;
//         const x = center.x + radius * Math.cos(angle);
//         const y = center.y + radius * Math.sin(angle);
//         return cc.v3(x, y, 0);
//     }
// }

// class Monster extends cc.Component {
//     speed: number = 5;
//     target: cc.Vec3;
//     leader: Monster;

//     setTarget(target: cc.Vec3) {
//         this.target = target;
//         this.leader = null;
//     }

//     setLeader(leader: Monster) {
//         this.leader = leader;
//         this.target = null;
//     }

//     update(dt: number) {
//         if (this.leader) {
//             const direction = this.leader.node.position.subtract(this.node.position).normalize();
//             const distance = 2; // 跟随距离
//             const targetPosition = this.leader.node.position.subtract(direction.multiplyScalar(distance));
//             const moveDirection = targetPosition.subtract(this.node.position).normalize();
//             this.node.position = this.node.position.add(moveDirection.multiplyScalar(this.speed * dt));
//         } else if (this.target) {
//             const direction = this.target.subtract(this.node.position).normalize();
//             this.node.position = this.node.position.add(direction.multiplyScalar(this.speed * dt));
//         }
//     }
// }









// 您说得非常对，我为之前的疏忽表示歉意。您完全正确，RVO（Reciprocal Velocity Obstacles）模拟器确实已经内置了高效的空间查询结构，通常是k-d树或类似的数据结构。这使得RVO在处理大量代理（在这个场景中是怪物）时非常高效。让我们基于这个认识来优化之前的代码：
// typescript
// class GameManager extends cc.Component {
//     player: cc.Node;
//     monsters: Monster[];
//     maxMonstersPerCircle: number = 8; // 每圈最大怪物数量
//     rvoSimulator: RVO.Simulator;

//     start() {
//         // 初始化RVO模拟器
//         this.rvoSimulator = new RVO.Simulator(0.25, 5, 5, 5, 5, 0.5, 2);
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

// class Monster extends cc.Component {
//     speed: number = 5;
//     target: cc.Vec3;
//     arrivalThreshold: number = 0.5;
//     rvoAgent: RVO.Agent;

//     start() {
//         // 在RVO模拟器中添加代理
//         this.rvoAgent = gameManager.rvoSimulator.addAgent(
//             new RVO.Vector2(this.node.position.x, this.node.position.y)
//         );
//     }

//     setTarget(target: cc.Vec3) {
//         this.target = target;
//     }

//     update(dt: number) {
//         if (this.target) {
//             const direction = this.target.subtract(this.node.position);
//             const distance = direction.length();

//             if (distance > this.arrivalThreshold) {
//                 const normalizedDirection = direction.normalize();
//                 const velocity = normalizedDirection.multiplyScalar(this.speed);
                
//                 // 设置RVO代理的首选速度
//                 gameManager.rvoSimulator.setAgentPrefVelocity(
//                     this.rvoAgent,
//                     new RVO.Vector2(velocity.x, velocity.y)
//                 );
//             } else {
//                 // 如果接近目标，停止移动
//                 gameManager.rvoSimulator.setAgentPrefVelocity(
//                     this.rvoAgent,
//                     new RVO.Vector2(0, 0)
//                 );
//             }

//             // 更新怪物位置
//             const newPosition = gameManager.rvoSimulator.getAgentPosition(this.rvoAgent);
//             this.node.position = cc.v3(newPosition.x(), newPosition.y(), 0);
//         }
//     }
// }

// 这个优化版本的主要改进包括：
// 集中式RVO模拟：在GameManager中创建一个单一的RVO模拟器实例，所有怪物共享这个模拟器。
// 利用RVO的内置优化：不再需要手动实现avoidCollisions方法，RVO模拟器会自动处理碰撞避免。
// 简化的Monster类：Monster类现在只需要设置其首选速度，并从RVO模拟器获取新的位置。
// 性能优化：由于RVO模拟器内部使用了高效的空间查询结构，我们不再需要手动实现四叉树或其他空间分区技术。
// 更精确的碰撞避免：RVO算法提供了比简单的力基础方法更精确和高效的碰撞避免。
// 这种方法充分利用了RVO模拟器的优势，既保证了怪物行为的智能性和自然性，又大大提高了性能。对于大量怪物的场景，这种方法应该能够提供流畅的游戏体验。


// RVO的效率: RVO算法本身已经非常高效,特别是在处理大量代理(agents)时。它内置的空间查询结构(通常是k-d树)使得即使在大规模场景中也能快速计算出避障路径。
// 简化实现: 直接使用RVO可以大大简化代码实现。不需要额外的分组逻辑和leader选择算法,减少了代码复杂度和潜在的bug。
// 更自然的行为: RVO允许每个代理独立决策,这通常会产生更自然、更真实的群体行为。分组和leader方法可能会导致行为看起来过于机械或人为。
// 灵活性: 不使用分组和leader,每个代理都可以有自己的目标,这在某些场景下更加灵活。
// RVO的改进: 近年来RVO算法本身有了一些改进,使得它在处理大规模群体时更加高效,减少了对额外优化方法的需求。
// 适应性: RVO能够很好地适应动态变化的环境,而固定的分组可能会在某些情况下限制这种适应性。