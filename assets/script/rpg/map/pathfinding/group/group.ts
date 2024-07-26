// // 4. 动态角色分组
// // 将靠近的怪物分组，每组只计算一个主要路径，组内其他怪物跟随这个路径，但保持一定的随机性和局部避障。

// class MonsterGroup {
//     leader: Monster;
//     followers: Monster[] = [];
//     path: cc.Vec3[] = [];

//     constructor(leader: Monster) {
//         this.leader = leader;
//     }

//     addFollower(monster: Monster) {
//         this.followers.push(monster);
//     }

//     updatePath(target: cc.Vec3) {
//         this.path = calculatePath(this.leader.node.position, target);
//     }
// }

// let monsterGroups: MonsterGroup[] = [];


// // 4.1 动态分组
// function groupMonsters(monsters: Monster[], groupRadius: number = 10) {
//     monsterGroups = [];
//     const ungroupedMonsters = [...monsters];

//     while (ungroupedMonsters.length > 0) {
//         const leader = ungroupedMonsters.shift()!;
//         const group = new MonsterGroup(leader);

//         for (let i = ungroupedMonsters.length - 1; i >= 0; i--) {
//             const monster = ungroupedMonsters[i];
//             if (leader.node.position.subtract(monster.node.position).length() <= groupRadius) {
//                 group.addFollower(monster);
//                 ungroupedMonsters.splice(i, 1);
//             }
//         }

//         monsterGroups.push(group);
//     }
// }

// // 4.2 更新路径
// function updateGroupPaths(target: cc.Vec3) {
//     for (const group of monsterGroups) {
//         group.updatePath(target);
//     }
// }


// // 4.3 怪物移动逻辑
// class Monster extends cc.Component {
//     group: MonsterGroup | null = null;
//     speed: number = 5;
//     randomOffset: cc.Vec3 = cc.Vec3.ZERO;

//     update(dt: number) {
//         if (!this.group) return;

//         let targetPosition: cc.Vec3;

//         if (this === this.group.leader) {
//             // 领导者跟随主路径
//             targetPosition = this.group.path[0] || this.group.leader.node.position;
//         } else {
//             // 跟随者跟随领导者，但保持一定距离
//             const leaderPos = this.group.leader.node.position;
//             const directionToLeader = leaderPos.subtract(this.node.position).normalize();
//             targetPosition = leaderPos.subtract(directionToLeader.multiplyScalar(5));

//             // 添加随机偏移以避免完全重叠
//             if (this.randomOffset.equals(cc.Vec3.ZERO)) {
//                 this.randomOffset = cc.Vec3.new(Math.random() - 0.5, Math.random() - 0.5, 0).normalize().multiplyScalar(2);
//             }
//             targetPosition = targetPosition.add(this.randomOffset);
//         }

//         // 移动逻辑
//         const direction = targetPosition.subtract(this.node.position).normalize();
//         this.node.position = this.node.position.add(direction.multiplyScalar(this.speed * dt));

//         // 局部避障（简化版）
//         this.avoidLocalObstacles();
//     }

//     avoidLocalObstacles() {
//         // 简单的局部避障逻辑
//         // 可以检查附近的其他怪物和障碍物，并调整位置
//     }
// }


// class GameManager extends cc.Component {
//     monsters: Monster[] = [];
//     player: cc.Node | null = null;

//     start() {
//         // 初始化怪物和玩家
//         this.groupMonsters();
//     }

//     update(dt: number) {
//         if (this.player) {
//             // 定期更新组路径
//             if (/* 某些条件，例如每隔几秒或玩家移动一定距离 */) {
//                 this.groupMonsters();
//                 updateGroupPaths(this.player.position);
//             }
//         }
//     }

//     groupMonsters() {
//         groupMonsters(this.monsters);
//     }
// }
