import { InputComponent } from "../component/InputComponent";
import { MovableComponent } from "../component/MovableComponent";
import { PathfindingComponent } from "../component/PathfindingComponent";
import { TransformComponent } from "../component/TransformComponent";
import { BaseSystem } from "./BaseSystem";

export class MovementSystem extends BaseSystem{
    update(deltaTime: number, entities: Entity[]): void {
        for (const entity of entities) {
            const transform = entity.getComponent<TransformComponent>();
            const movable = entity.getComponent<MovableComponent>();
            const input = entity.getComponent<InputComponent>();
            const pathfinding = entity.getComponent<PathfindingComponent>();

            // 如果摇杆处于激活状态，则进行直接移动
            if (input.joystickActive) {
                // 计算移动方向，并更新朝向，这里摇杆的输入直接转换成移动方向
                transform.rotation = Math.atan2(input.joystickDirection.y, input.joystickDirection.x);

                // 移动实体
                transform.position = transform.position.add(input.joystickDirection.scale(movable.speed * deltaTime));

                // 重置路径，因为玩家已经采取直接控制
                pathfinding.currentPath = [];
                pathfinding.pathIndex = 0;
                pathfinding.reachedTarget = true;
            } else {
                const transform = entity.getComponent<TransformComponent>();
               const movable = entity.getComponent<MovableComponent>();
               const pathfinding = entity.getComponent<PathfindingComponent>();

               if (pathfinding.currentPath.length > 0 && !pathfinding.reachedTarget) {
                   // 获取下一个路径点并朝向该点移动
                   const nextPoint = pathfinding.currentPath[pathfinding.pathIndex];

                   // 计算移动方向，并更新朝向
                   const direction = nextPoint.subtract(transform.position).normalize();
                   transform.rotation = Math.atan2(direction.y, direction.x);

                   // 移动实体
                   transform.position = transform.position.add(direction.scale(movable.speed * deltaTime));

                   // 检查是否到达下一个路径点
                   if (transform.position.distanceTo(nextPoint) < movable.speed * deltaTime) {
                       pathfinding.pathIndex++;
                       if (pathfinding.pathIndex >= pathfinding.currentPath.length) {
                           // 如果到达最后一个点，更新状态为到达目标
                           pathfinding.reachedTarget = true;
                       }
                   }
               }
            }
        }
    }
}