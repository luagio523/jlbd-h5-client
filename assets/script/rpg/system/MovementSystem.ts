import { Vec2 } from "cc";
import { InputComponent } from "../component/InputComponent";
import { PathfindingComponent } from "../component/PathfindingComponent";
import { TransformComponent } from "../component/TransformComponent";
import { BaseSystem } from "./BaseSystem";
import { ECSEntity } from "../ecs/ECSEntity";
import { ModifierManager } from "../manager/ModifierManager";
import { SpeedCalculator } from "../calculator/SpeedCalculator";
import { MovableComponent } from "../component/MovableComponent";
import { AttackComponent } from "../component/AttackComponent";

export class MovementSystem extends BaseSystem {
    private speedCalculator: SpeedCalculator;

    constructor() {
        super();
        this.speedCalculator = new SpeedCalculator(ModifierManager.getInstance())
    }

    update(deltaTime: number): void {
        const entities = this.getEntitiesWithComponents(TransformComponent, MovableComponent);
        
        for (const entity of entities) {
            const transform = entity.getComponent(TransformComponent);
            const movable = entity.getComponent(MovableComponent);
            const input = entity.getComponent(InputComponent);
            const pathfinding = entity.getComponent(PathfindingComponent);
            const attack = entity.getComponent(AttackComponent);

            const calculatedSpeed = this.speedCalculator.calculateFinalSpeed(entity, movable.getBaseSpeed());
            movable.updateSpeed(calculatedSpeed, deltaTime);

            if (input && input.joystickActive) {
                this.handleJoystickMovement(entity, transform, input, movable.getSpeed(), deltaTime);
            } else if (pathfinding && !pathfinding.reachedTarget) {
                this.handlePathfindingMovement(entity, transform, pathfinding, movable.getSpeed(), deltaTime);
            } else if (attack && attack.getTarget()) {
                const target = attack.getTarget();
                if (target) {
                    const targetTransform = target.getComponent(TransformComponent);
                    if (targetTransform) {
                        const distance = Vec2.distance(transform.position, targetTransform.position);
                        if (!attack.isInAttackRange(distance)) {
                            this.handleTrackingMovement(entity, transform, targetTransform.position, movable.getSpeed(), deltaTime);
                        }
                    }
                }
            }
            
            transform.updateHeading(deltaTime);
        }
    }

    private handleTrackingMovement(
        entity: ECSEntity, 
        transform: TransformComponent, 
        targetPosition: Vec2,
        speed: number, 
        deltaTime: number
    ): void {
        const direction = targetPosition.subtract(transform.position).normalize();
        transform.position = transform.position.add(direction.multiplyScalar(speed * deltaTime));
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