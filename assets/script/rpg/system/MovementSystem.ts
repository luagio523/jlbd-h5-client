import { Vec2 } from "cc";
import { InputComponent } from "../component/InputComponent";
import { MovableComponent } from "../component/MovableComponent";
import { PathfindingComponent } from "../component/PathfindingComponent";
import { TransformComponent } from "../component/TransformComponent";
import { BaseSystem } from "./BaseSystem";
import { ECSEntity } from "../ecs/ECSEntity";
import { ModifierManager } from "../manager/ModifierManager";
import { ModifierFunction } from "../enum/Modifier";

export class MovementSystem extends BaseSystem {
    private modifierManager: ModifierManager;

    constructor() {
        super();
        this.modifierManager = ModifierManager.getInstance();
    }

    update(deltaTime: number): void {
        const entities = this.getEntitiesWithComponents(TransformComponent, MovableComponent);
        
        for (const entity of entities) {
            const transform = entity.getComponent(TransformComponent);
            const movable = entity.getComponent(MovableComponent);
            const input = entity.getComponent(InputComponent);
            const pathfinding = entity.getComponent(PathfindingComponent);

            // 应用速度修改器
            const speedModifier = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE);
            const currentSpeed = movable.baseSpeed * (1 + speedModifier / 100);

            if (input && input.joystickActive) {
                this.handleJoystickMovement(entity, transform, input, currentSpeed, deltaTime);
            } else if (pathfinding && pathfinding.currentPath.length > 0 && !pathfinding.reachedTarget) {
                this.handlePathfindingMovement(entity, transform, pathfinding, currentSpeed, deltaTime);
            }

            // 更新该实体的 modifiers
            this.modifierManager.updateModifiers(entity, deltaTime);
        }
    }

    private handleJoystickMovement(entity: ECSEntity, transform: TransformComponent, input: InputComponent, speed: number, deltaTime: number): void {
        transform.rotation = Math.atan2(input.joystickDirection.y, input.joystickDirection.x);
        transform.position = transform.position.add(input.joystickDirection.multiplyScalar(speed * deltaTime));

        const pathfinding = entity.getComponent(PathfindingComponent);
        if (pathfinding) {
            pathfinding.currentPath = [];
            pathfinding.pathIndex = 0;
            pathfinding.reachedTarget = true;
        }
    }

    private handlePathfindingMovement(entity: ECSEntity, transform: TransformComponent, pathfinding: PathfindingComponent, speed: number, deltaTime: number): void {
        const nextPoint = pathfinding.currentPath[pathfinding.pathIndex];
        const direction = nextPoint.subtract(transform.position).normalize();
        
        transform.rotation = Math.atan2(direction.y, direction.x);
        transform.position = transform.position.add(direction.multiplyScalar(speed * deltaTime));

        if (this.hasReachedPoint(transform.position, nextPoint, speed * deltaTime)) {
            pathfinding.pathIndex++;
            if (pathfinding.pathIndex >= pathfinding.currentPath.length) {
                pathfinding.reachedTarget = true;
            }
        }
    }

    private hasReachedPoint(currentPosition: Vec2, targetPoint: Vec2, threshold: number): boolean {
        return Vec2.distance(currentPosition, targetPoint) < threshold;
    }
}