import { BaseSystem } from "./BaseSystem";

class NavSystem extends BaseSystem{
    update(deltaTime: number, entities: Entity[]): void {
        for (const entity of entities) {
            const pathfinding = entity.getComponent<PathfindingComponent>();
            const transform = entity.getComponent<TransformComponent>();

            if (pathfinding.targetPosition && !pathfinding.reachedTarget) {
                if (pathfinding.currentPath.length === 0 || pathfinding.pathIndex >= pathfinding.currentPath.length) {
                    // 如果没有路径或者路径已经走完了，则请求新的路径
                    // 假定已经有一个函数来获取路径：getPathUsingAStar(startPosition, targetPosition)
                    pathfinding.currentPath = getPathUsingAStar(transform.position, pathfinding.targetPosition);
                    pathfinding.pathIndex = 0;
                }
            }
        }
    }
}