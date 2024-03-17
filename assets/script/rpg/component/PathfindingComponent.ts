import { Vec2 } from "cc";

export class PathfindingComponent {
    targetPosition: Vec2; // 目标位置
    currentPath: Vec2[] = []; // 使用A*算法确定的当前路径点数组
    pathIndex: number = 0; // 当前路径数组中的索引
    reachedTarget: boolean = false; // 是否到达目标点
}