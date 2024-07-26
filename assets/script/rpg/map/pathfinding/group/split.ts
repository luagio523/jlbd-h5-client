// 1. 宏观层（Global Layer）
// 宏观层将地图分割成较大的区域，并预先计算这些区域之间的路径。可以使用图（Graph）来表示这些区域及其连接。
// typescript
// class MacroNode {
//     id: number;
//     neighbors: MacroNode[];
//     center: cc.Vec3;

//     constructor(id: number, center: cc.Vec3) {
//         this.id = id;
//         this.center = center;
//         this.neighbors = [];
//     }

//     addNeighbor(node: MacroNode) {
//         this.neighbors.push(node);
//     }
// }

// class MacroGraph {
//     nodes: MacroNode[];

//     constructor() {
//         this.nodes = [];
//     }

//     addNode(node: MacroNode) {
//         this.nodes.push(node);
//     }

//     findPath(startNode: MacroNode, endNode: MacroNode): MacroNode[] {
//         // 使用A*或其他算法在宏观层面找到路径
//         return [];
//     }
// }

// 2. 中观层（Mid-Level Layer）
// 在当前区域内使用简化的寻路算法，如跳点搜索（Jump Point Search, JPS）。这个层次的寻路算法只在当前大区域内进行。
// typescript
// class MidLevelPathfinder {
//     grid: number[][];

//     constructor(grid: number[][]) {
//         this.grid = grid;
//     }

//     findPath(start: cc.Vec3, end: cc.Vec3): cc.Vec3[] {
//         // 使用JPS或其他简化的寻路算法
//         return [];
//     }
// }

// 3. 微观层（Local Layer）
// 在怪物附近使用RVO（Reciprocal Velocity Obstacles）或其他局部避障算法。这一层次主要处理怪物之间的碰撞和局部避障。
// typescript
// class LocalAvoidance {
//     static avoidCollisions(monster: Monster, neighbors: Monster[], dt: number) {
//         // 使用RVO或其他局部避障算法
//     }
// }

// 综合实现
// 结合以上三个层次的寻路系统，我们可以创建一个综合的路径规划系统。
// typescript
// class PathfindingSystem {
//     macroGraph: MacroGraph;
//     midLevelPathfinder: MidLevelPathfinder;
//     grid: number[][];

//     constructor(grid: number[][]) {
//         this.grid = grid;
//         this.macroGraph = this.createMacroGraph(grid);
//         this.midLevelPathfinder = new MidLevelPathfinder(grid);
//     }

//     createMacroGraph(grid: number[][]): MacroGraph {
//         const graph = new MacroGraph();
//         // 根据大地图格子数据创建宏观层图
//         return graph;
//     }

//     findPath(start: cc.Vec3, end: cc.Vec3): cc.Vec3[] {
//         const startNode = this.macroGraph.findClosestNode(start);
//         const endNode = this.macroGraph.findClosestNode(end);

//         // 宏观层路径
//         const macroPath = this.macroGraph.findPath(startNode, endNode);

//         // 中观层路径
//         let fullPath: cc.Vec3[] = [];
//         for (let i = 0; i < macroPath.length - 1; i++) {
//             const segmentStart = macroPath[i].center;
//             const segmentEnd = macroPath[i + 1].center;
//             const segmentPath = this.midLevelPathfinder.findPath(segmentStart, segmentEnd);
//             fullPath = fullPath.concat(segmentPath);
//         }

//         // 将起点和终点连接到宏观路径
//         const startSegment = this.midLevelPathfinder.findPath(start, macroPath[0].center);
//         const endSegment = this.midLevelPathfinder.findPath(macroPath[macroPath.length - 1].center, end);
//         fullPath = startSegment.concat(fullPath).concat(endSegment);

//         return fullPath;
//     }
// }
















// class MidLevelPathfinder {
//     grid: number[][];
    
//     constructor(grid: number[][]) {
//         this.grid = grid;
//     }

//     findPath(start: cc.Vec3, end: cc.Vec3, searchArea?: {minX: number, minY: number, maxX: number, maxY: number}): cc.Vec3[] {
//         // 如果提供了搜索区域，就只在该区域内搜索
//         if (searchArea) {
//             return this.findPathInArea(start, end, searchArea);
//         } else {
//             // 否则在整个地图上搜索（效率较低，通常不推荐）
//             return this.findPathInWholeMap(start, end);
//         }
//     }

//     private findPathInArea(start: cc.Vec3, end: cc.Vec3, area: {minX: number, minY: number, maxX: number, maxY: number}): cc.Vec3[] {
//         // 使用 JPS 或其他高效算法在指定区域内寻路
//         // 这里只搜索限定区域内的格子
//         // ...实现寻路算法...
//     }

//     private findPathInWholeMap(start: cc.Vec3, end: cc.Vec3): cc.Vec3[] {
//         // 在整个地图上寻路（效率较低）
//         // ...实现寻路算法...
//     }
// }
