import { Vec2 } from "cc";
import { MovableComponent } from "../component/MovableComponent";
import { PathfindingComponent, PathfindingState } from "../component/PathfindingComponent";
import { TransformComponent } from "../component/TransformComponent";
import { BaseSystem } from "./BaseSystem";
import { ECSEntity } from "../ecs/ECSEntity";



export class PathfindingSystem extends BaseSystem {
    update(deltaTime: number): void {
        const currentTime = Date.now() / 1000;
        const entities = this.getEntitiesWithComponents(PathfindingComponent, TransformComponent);

        for (const entity of entities) {
            const pathfinding = entity.getComponent(PathfindingComponent);
            const transform = entity.getComponent(TransformComponent);

            if (pathfinding.getState() === PathfindingState.FOLLOWING_PATH) {
                pathfinding.updateDistanceToNextPoint(transform.position);

                if (pathfinding.hasReachedNextPoint(transform.position)) {
                    pathfinding.advanceToNextPoint();
                }

                if (pathfinding.hasReachedTarget(transform.position)) {
                    pathfinding.setState(PathfindingState.REACHED_TARGET);
                }
            }

            if (pathfinding.isPathUpdateNeeded(currentTime)) {
                // 使用A*算法或其他寻路算法更新路径
                const newPath = this.calculatePath(transform.position, pathfinding.getTarget());
                pathfinding.setPath(newPath);
                pathfinding.updateLastPathUpdateTime(currentTime);
            }
        }
    }

    private calculatePath(start: Vec2, end: Vec2 | null): Vec2[] {
        // 实现您的寻路算法
        // 返回计算得到的路径
        return [];
    }
}

// export class NavSystem extends BaseSystem {
//     private readonly DISTANCE_THRESHOLD = 0.1; // 设置一个小的阈值

//     update(deltaTime: number): void {
//         const entities = this.getEntitiesWithComponents(PathfindingComponent, MovableComponent, TransformComponent);
//         for (const entity of entities) {
//             this.updateEntityNavigation(entity, deltaTime);
//         }
//     }

//     private updateEntityNavigation(entity: ECSEntity, deltaTime: number): void {
//         const pathfinding = entity.getComponent(PathfindingComponent);
//         const movable = entity.getComponent(MovableComponent);
//         const transform = entity.getComponent(TransformComponent);

//         if (pathfinding.reachedTarget) return;

//         if (this.needNewPath(pathfinding)) {
//             this.calculateNewPath(transform, pathfinding);
//         }

//         const distanceToMove = movable.getSpeed() * deltaTime;
//         if (pathfinding.distanceToNextPoint <= distanceToMove + this.DISTANCE_THRESHOLD) {
//             this.moveToNextPoint(pathfinding, transform);
//         } else {
//             pathfinding.distanceToNextPoint -= distanceToMove;
//         }

//         transform.updateHeading(deltaTime);
//     }

//     private needNewPath(pathfinding: PathfindingComponent): boolean {
//         return pathfinding.currentPath.length === 0 || pathfinding.pathIndex >= pathfinding.currentPath.length;
//     }

//     private calculateNewPath(transform: TransformComponent, pathfinding: PathfindingComponent): void {
//         pathfinding.currentPath = this.getPathUsingNav(transform.position, pathfinding.targetPosition);
//         pathfinding.pathIndex = 0;
//         this.calculateWhenChangeNextPoint(transform, pathfinding);
//     }

//     private moveToNextPoint(pathfinding: PathfindingComponent, transform: TransformComponent): void {
//         pathfinding.pathIndex++;
//         if (pathfinding.pathIndex < pathfinding.currentPath.length) {
//             this.calculateWhenChangeNextPoint(transform, pathfinding);
//         } else {
//             pathfinding.reachedTarget = true;
//         }
//     }

//     private getPathUsingNav(start: Vec2, target: Vec2): Array<Vec2> {
//         // 实现路径查找算法
//         return [];
//     }

//     private calculateWhenChangeNextPoint(transform: TransformComponent, pathfinding: PathfindingComponent): void {
//         pathfinding.nextPoint = pathfinding.currentPath[pathfinding.pathIndex];
//         transform.setTargetPosition(pathfinding.nextPoint);
//         pathfinding.distanceToNextPoint = Vec2.distance(transform.position, pathfinding.nextPoint);
//     }
// }