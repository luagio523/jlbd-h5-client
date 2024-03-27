import { Vec2 } from "cc";
import { MovableComponent } from "../component/MovableComponent";
import { PathfindingComponent } from "../component/PathfindingComponent";
import { TransformComponent } from "../component/TransformComponent";
import { BaseSystem } from "./BaseSystem";


export class NavSystem extends BaseSystem {
    update(deltaTime: number): void {
        let entities = this.getEntitiesWithComponent(PathfindingComponent)
        for (const entity of entities) {
            const pathfinding = entity.getComponent(PathfindingComponent);
            const movable = entity.getComponent(MovableComponent);
            const transform = entity.getComponent(TransformComponent);

            if (!pathfinding.reachedTarget) {
                if (pathfinding.currentPath.length === 0 || pathfinding.pathIndex >= pathfinding.currentPath.length) {
                    pathfinding.currentPath = this.getPathUsingNav(transform.position, pathfinding.targetPosition);
                    pathfinding.pathIndex = 0;
                    this.calculateWhenChangeNextPoint(transform,pathfinding,movable)
                }
            
                if (pathfinding.distanceToNextPoint < movable.speed * deltaTime) {
                    pathfinding.pathIndex += 1;
                    if (pathfinding.pathIndex < pathfinding.currentPath.length) {
                        this.calculateWhenChangeNextPoint(transform,pathfinding,movable)
                    } else {
                        pathfinding.reachedTarget = true;
                    } 
                } else {
                    // 如果没有达到目标点，我们就减去在这一帧中移动的距离
                    pathfinding.distanceToNextPoint -= movable.speed * deltaTime;
                }
            }
        }
    }

    private getPathUsingNav(start:Vec2,target:Vec2):Array<Vec2>{
        return []
    }

    private calculateWhenChangeNextPoint(transform:TransformComponent,pathfinding:PathfindingComponent,movable:MovableComponent) {
        pathfinding.nextPoint = pathfinding.currentPath[pathfinding.pathIndex];
        movable.heading = pathfinding.nextPoint.subtract(transform.position).normalize();
        pathfinding.distanceToNextPoint = Vec2.distance(transform.position,pathfinding.nextPoint);  // 计算并存储距离
    }
}