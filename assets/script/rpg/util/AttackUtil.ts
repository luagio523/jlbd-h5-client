// 以下是如何在TypeScript中实现这个概念的步骤：
// 定义BOSS的位置。
// 设置小兵的数量。
// 根据BOSS的位置和小兵的数量来计算圆周上每个小兵的目标位置。
// 以下是一个示例代码，实现了上述逻辑：
// typescript
// interface Position {
//   x: number;
//   y: number;
// }

// // 计算围绕某点的圆形位置的函数
// function calculateCircularPositions(center: Position, radius: number, count: number): Position[] {
//   let positions: Position[] = [];
//   const angleIncrement = Math.PI * 2 / count; // 围绕圆的角度增量

//   for (let i = 0; i < count; i++) {
//     const angle = angleIncrement * i; // 当前小兵的角度位置
//     positions.push({
//       x: center.x + radius * Math.cos(angle), // 根据角度和半径计算x坐标
//       y: center.y + radius * Math.sin(angle), // 根据角度和半径计算y坐标
//     });
//   }

//   return positions;
// }

// // BOSS的位置
// const bossPosition: Position = { x: 100, y: 100 };
// // 小兵数量
// const minionCount: number = 10;
// // 想要小兵围绕BOSS的半径
// const attackRadius: number = 30; // 这个值应根据BOSS的实际大小和游戏设计来调整

// // 计算小兵的目标位置
// const minionPositions: Position[] = calculateCircularPositions(bossPosition, attackRadius, minionCount);

// // 输出结果，以验证位置
// console.log('Minion Target Positions:', minionPositions);
// 在这份代码中，calculateCircularPositions函数负责为每个小兵生成一个圆周上的点。我们传入BOSS的位置作为圆心，设置一个攻击半径以及小兵的数量来生成位置。代码在循环中计算每个角度上的点，然后利用三角函数确定位置坐标。
// 你需要根据你的游戏具体的逻辑和游戏引擎来调整这个代码，确保它可以和你的游戏世界以及AI系统无缝结合。
// 这只是一个基本的实现示范，实际上，你还需要考虑小兵之间和BOSS之间的交互，可能还要调整小兵的路径寻找和行为以在移动过程中使用RVO算法避免碰撞。





// 要分配10个目标位置给10个小兵，可以以一种简单的方式进行分配：让每个小兵走向距离其当前位置最近的目标点。这种方法的优点是直观简单，且能确保所有小兵尽可能快地到达其目标位置。
// 以下是一个可能的TypeScript实现示范：
// 假设我们有一个数组，存储所有小兵的当前位置。
// 我们使用先前计算出的10个目标位置数组。
// 对于每个小兵，我们遍历所有未被分配的目标位置，找出与该小兵当前位置距离最近的一个。
// 将这个位置分配给这个小兵，并将该位置从未分配目标位置列表中移除。
// 下面是如何在TypeScript中实现这一过程的代码：
// typescript
// // 假定minions是一个包含所有小兵当前位置的数组
// const minions: Position[] = [
//   { x: 90, y: 105 }, { x: 95, y: 110 },
//   // ...这里还有其他8个小兵的当前位置
// ];

// // 假定minionPositions是之前计算出来的目标位置数组
// let minionTargetPositions: Position[] = [
//   // ...10个目标位置
// ];

// // 用来计算两点之间距离的辅助函数
// function calculateDistance(a: Position, b: Position): number {
//   return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
// }

// // 用于分配每个小兵最近目标点的函数
// function assignMinionsToPositions(minions: Position[], targetPositions: Position[]): Position[] {
//   const assignments: Position[] = [];
  
//   minions.forEach(minion => {
//     let closestDistance = Infinity;
//     let closestIndex = -1;
    
//     // 查找最近的目标点
//     targetPositions.forEach((target, index) => {
//       const distance = calculateDistance(minion, target);
//       if (distance < closestDistance) {
//         closestDistance = distance;
//         closestIndex = index;
//       }
//     });
    
//     // 分配最近的目标点给小兵并标记此目标点已分配
//     assignments.push(targetPositions[closestIndex]);
//     targetPositions.splice(closestIndex, 1);
//   });
  
//   return assignments;
// }

// // 执行分配函数并获得分配结果
// const assignments = assignMinionsToPositions(minions, minionTargetPositions);

// // 输出结果
// console.log('Assignments:', assignments);
// 本例中，assignMinionsToPositions函数处理分配逻辑，它迭代每一个小兵并找到未被分配目标中最近的一个。
// 请注意，这个例子假设小兵的数量和目标点的数量相等，并且每个小兵都能够被分配到一个目标点。在实际应用时，
// 你可能需要进一步考虑小兵在移动到目标点的过程中是否需要避开障碍物，或者如果BOSS移动了怎么办等问题。
// 这需要你的游戏逻辑和引擎提供更多的支持。此外，这个算法也不考虑已经向某个目标点移动的小兵，可能需要额外逻辑来处理这种情况。
























// // 假设有一个用于表示网格的类
// class Grid {
//     public width: number;
//     public height: number;
//     public cells: boolean[][];
  
//     constructor(width: number, height: number) {
//       this.width = width;
//       this.height = height;
//       this.cells = new Array(height);
//       for (let i = 0; i < height; i++) {
//         this.cells[i] = new Array(width).fill(false);
//       }
//     }
  
//     // 标记网格中被动态目标占据的单元格为 true
//     markOccupied(x: number, y: number): void {
//       if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
//         this.cells[y][x] = true;
//       }
//     }
//   }
  
//   // 动态目标的位置和尺寸
//   interface DynamicObject {
//     x: number;
//     y: number;
//     width: number;
//     height: number;
//   }
  
//   // 将动态目标位置转化为网格单元格并标记为占用
//   function calculateOccupiedGrids(grid: Grid, obj: DynamicObject): void {
//     // 根据对象在世界中的位置找到对应的网格坐标
//     const startX = Math.floor(obj.x / grid.width);
//     const startY = Math.floor(obj.y / grid.height);
//     const endX = Math.ceil((obj.x + obj.width) / grid.width);
//     const endY = Math.ceil((obj.y + obj.height) / grid.height);
  
//     // 遍历对象占据的网格范围标记为占用
//     for (let y = startY; y < endY; y++) {
//       for (let x = startX; x < endX; x++) {
//         grid.markOccupied(x, y);
//       }
//     }
//   }
  
//   // 创建一个新的网格实例
//   const myGrid = new Grid(100, 100);
  
//   // 创建一个新的动态目标实例
//   const dynamicObject: DynamicObject = {
//     x: 20, // 动态目标在世界中的x坐标
//     y: 45, // 动态目标在世界中的y坐标
//     width: 10, // 动态目标的宽度
//     height: 15, // 动态目标的高度
//   };
  
//   // 计算并标记该动态目标在网格上的位置
//   calculateOccupiedGrids(myGrid, dynamicObject);
  
//   // 现在`myGrid.cells`数组中会有一些被标记为 true 的元素，表示动态目标占据的网格



//   interface CircularObject {
//     x: number;
//     y: number;
//     radius: number;
//   }
  
//   function calculateOccupiedGridsForCircle(grid: Grid, obj: CircularObject): void {
//     const startX = Math.floor((obj.x - obj.radius) / grid.size);
//     const startY = Math.floor((obj.y - obj.radius) / grid.size);
//     const endX = Math.ceil((obj.x + obj.radius) / grid.size);
//     const endY = Math.ceil((obj.y + obj.radius) / grid.size);
  
//     // 对网格中的每一个单元格进行检测，看是否位于圆形目标的半径之内
//     for (let y = startY; y <= endY; y++) {
//       for (let x = startX; x <= endX; x++) {
//         const cellCenterX = x * grid.size + grid.size / 2;
//         const cellCenterY = y * grid.size + grid.size / 2;
        
//         const distX = cellCenterX - obj.x;
//         const distY = cellCenterY - obj.y;
//         const distance = Math.sqrt(distX * distX + distY * distY);
  
//         if (distance < obj.radius + (grid.size / Math.sqrt(2))) { // 考虑到单元格的对角线距离
//           grid.markOccupied(x, y);
//         }
//       }
//     }
//   }
  
//   const myGrid = new Grid(10, 100, 100); // 创建一个网格，每个单元格大小为10x10
  
//   const circularObject: CircularObject = {
//     x: 200, // 圆形目标的中心x坐标
//     y: 200, // 圆形目标的中心y坐标
//     radius: 30, // 圆形目标的半径
//   };
  
//   calculateOccupiedGridsForCircle(myGrid, circularObject);
  
//   // `myGrid.cells`数组中会有一些被标记为 true 的元素，表示圆形目标覆盖的网格单元




//   如果你在处理寻路时，小怪物刚好处于网格线上而占据了两个格子的问题，可能会影响到寻路算法的性能和路径的准确性。这个问题通常是由于网格太粗、怪物尺寸太小或者坐标定位的方式导致的。为了克服这一问题，有几个解决办法可以考虑：
// 调整网格的大小：如果可能，增加网格的分辨率（即减小网格的尺寸），这样即使小怪物占据了两个格子也不会对寻路产生太大影响。
// 圆形碰撞检测：当怪物较小并接近网格线时，使用圆形（以怪物为中心，半径足够小）进行碰撞检测而非外接矩形方法，以减少占据多余格子的情况。
// 基于位置的占据：根据怪物的中心位置对网格进行占据标记。只有当怪物的中心点落在某个格子内时，该格子才被认为是被占据的。这样可以避免怪物处于格子线上时占据多个格子。
// 边界检测优化：在计算怪物占据的格子时，为边界条件设置一个阈值，如果怪物的边缘只是轻微地超过网格线，就不将其视为占据邻近的格子。
// 使用更复杂的碰撞检测：采用更精细的碰撞检测算法，例如四叉树或空间哈希等，这些算法可以提供更细粒度的碰撞检测，但相应地会增加计算复杂度。
// 基于像素的寻路：如果游戏允许，可以使用基于像素的寻路算法而不是基于网格的算法，这可以让寻路过程更加精确，避免格子限制造成的问题。
// 寻路算法的调整：允许寻路算法在检测到小怪物时特殊处理，例如绕过占据两个格子的小怪物，或者在占据多个格子时特殊处理。
// 这里有一个示例，展示了基于怪物中心位置来判断怪物占据哪个格子的方法：
// typescript
// class Grid {
//   // ...（之前的Grid类代码相同）
// }

// interface Entity {
//   x: number;
//   y: number;
//   size: number; // 假设实体也是圆形，size为其直径
// }

// function calculateOccupiedGridsForEntity(grid: Grid, entity: Entity): void {
//   const centerX = Math.floor(entity.x / grid.size);
//   const centerY = Math.floor(entity.y / grid.size);

//   // 如果实体较小，只标记实体中心所在的格子
//   if (entity.size < grid.size) {
//     grid.markOccupied(centerX, centerY);
//   } else {
//     // 如果实体较大，则需要标记外接矩形或采用其他策略标记占据的格子
//     // ...（其他逻辑代码）
//   }
// }

// // ...（使用实体位置的示例和其他代码部分）
// 在应用以上任何策略前，最好根据你的游戏具体需求和性能要求来做决定，而且这些策略也可以相互结合来解决这一问题。







// findPath(startX: number, startY: number, endX: number, endY: number): Node[] | null {
//     let openList: Node[] = [];
//     var closestNodeToTarget: Node = this.nodes[startY][startX]; // 初始设置为起始点
//     // ...省略初步设置
  
//     while (openList.length > 0) {
//       // ...省略排序等步骤
//       let currentNode = openList.shift()!;
  
//       // 检查此刻的点是否比我们已经遇到的点更靠近目标
//       if(this.heuristic(currentNode, endNode) < this.heuristic(closestNodeToTarget, endNode)) {
//           closestNodeToTarget = currentNode;
//       }
  
//       if(currentNode === endNode) {
//           let path: Node[] = [];
//           let current: Node | null = currentNode;
//           while(current != null) {
//               path.unshift(current);
//               current = current.parent;
//           }
//           return path;
//       }
  
//       // ...剩余代码
//     }
  
//     // 如果没有找到可行路径，则根据距离目标最近的节点返回路径 
//     if (closestNodeToTarget) {
//       let path: Node[] = [];
//       let current: Node | null = closestNodeToTarget;
//       while(current != null) {
//           path.unshift(current);
//           current = current.parent;
//       }
//       return path;
//     }
    
//     return null; // 如果从未移动过，返回null
//   }