import { Vec2 } from "cc";
import { ECSComponent } from "../ecs/ECSComponent";


export enum PathfindingState {
    NONE,
    IDLE,
    FOLLOWING_PATH,
    REACHED_TARGET,
    PATH_INVALID
}

export class PathfindingComponent extends ECSComponent {
    private targetPosition: Vec2 | null = null;
    private currentPath: Vec2[] = [];
    private pathIndex: number = 0;
    private nextPoint: Vec2 | null = null;
    private distanceToNextPoint: number = 0;
    private state: PathfindingState = PathfindingState.IDLE;
    private pathUpdateInterval: number = 0.5; // 路径更新间隔（秒）
    private lastPathUpdateTime: number = 0;
    private pathfindingRadius: number = 1; // 寻路半径，用于确定是否到达目标点

    constructor() {
        super();
    }

    public setTarget(target: Vec2): void {
        this.targetPosition = target;
        this.state = PathfindingState.IDLE; // 设置新目标时重置状态
        this.pathIndex = 0;
        this.currentPath = []; // 清空当前路径
    }

    public getTarget(): Vec2 | null {
        return this.targetPosition;
    }

    public setPath(path: Vec2[]): void {
        this.currentPath = path;
        this.pathIndex = 0;
        this.state = path.length > 0 ? PathfindingState.FOLLOWING_PATH : PathfindingState.PATH_INVALID;
        this.updateNextPoint();
    }

    public getCurrentPath(): Vec2[] {
        return this.currentPath;
    }

    public getNextPoint(): Vec2 | null {
        return this.nextPoint;
    }

    public getDistanceToNextPoint(): number {
        return this.distanceToNextPoint;
    }

    public getState(): PathfindingState {
        return this.state;
    }

    public setState(state: PathfindingState): void {
        this.state = state;
    }

    public isPathUpdateNeeded(currentTime: number): boolean {
        return currentTime - this.lastPathUpdateTime >= this.pathUpdateInterval;
    }

    public updateLastPathUpdateTime(currentTime: number): void {
        this.lastPathUpdateTime = currentTime;
    }

    public advanceToNextPoint(): void {
        this.pathIndex++;
        this.updateNextPoint();
    }

    public hasReachedTarget(currentPosition: Vec2): boolean {
        return this.targetPosition !== null && 
               Vec2.distance(currentPosition, this.targetPosition) <= this.pathfindingRadius;
    }

    public hasReachedNextPoint(currentPosition: Vec2): boolean {
        return this.nextPoint !== null && 
               Vec2.distance(currentPosition, this.nextPoint) <= this.pathfindingRadius;
    }

    public setPathfindingRadius(radius: number): void {
        this.pathfindingRadius = radius;
    }

    public getPathfindingRadius(): number {
        return this.pathfindingRadius;
    }

    private updateNextPoint(): void {
        if (this.pathIndex < this.currentPath.length) {
            this.nextPoint = this.currentPath[this.pathIndex];
        } else {
            this.nextPoint = null;
            this.state = PathfindingState.REACHED_TARGET;
        }
    }

    public updateDistanceToNextPoint(currentPosition: Vec2): void {
        if (this.nextPoint) {
            this.distanceToNextPoint = Vec2.distance(currentPosition, this.nextPoint);
        } else {
            this.distanceToNextPoint = 0;
        }
    }

    public reset(): void {
        this.targetPosition = null;
        this.currentPath = [];
        this.pathIndex = 0;
        this.nextPoint = null;
        this.distanceToNextPoint = 0;
        this.state = PathfindingState.IDLE;
    }
}