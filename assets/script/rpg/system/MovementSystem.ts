import { Vec2 } from "cc";
import { InputComponent } from "../component/InputComponent";
import { PathfindingComponent, PathfindingState } from "../component/PathfindingComponent";
import { TransformComponent } from "../component/TransformComponent";
import { BaseSystem } from "./BaseSystem";
import { ECSEntity } from "../ecs/ECSEntity";
import { ModifierManager } from "../manager/ModifierManager";
import { SpeedCalculator } from "../calculator/SpeedCalculator";
import { MovableComponent } from "../component/MovableComponent";
import { AttackComponent } from "../component/AttackComponent";
import { ColliderManager } from "../manager/ColliderManager";

export class MovementSystem extends BaseSystem {
    private speedCalculator: SpeedCalculator;
    private colliderManager: ColliderManager;
    constructor() {
        super();
        this.speedCalculator = new SpeedCalculator(ModifierManager.getInstance())
        this.colliderManager = ColliderManager.getInstance();
    }

    update(deltaTime: number): void {
        const entities = this.getEntitiesWithComponents(TransformComponent, MovableComponent);//获取有这两种组件的实体列表
        
        for (const entity of entities) {
            const transform = entity.getComponent(TransformComponent);
            const movable = entity.getComponent(MovableComponent);
            const input = entity.getComponent(InputComponent);
            const pathfinding = entity.getComponent(PathfindingComponent);
            const attack = entity.getComponent(AttackComponent);

            const calculatedSpeed = this.speedCalculator.calculateFinalSpeed(entity, movable.getBaseSpeed());
            movable.updateSpeed(calculatedSpeed);

            if (input && input.joystickActive) {
                this.handleJoystickMovement(entity, transform, input, movable.getSpeedPerSecond(), deltaTime);
            } else if (pathfinding && pathfinding.getState() === PathfindingState.FOLLOWING_PATH) {
                this.handlePathfindingMovement( transform, pathfinding, movable.getSpeedPerSecond(), deltaTime);
            } else if ( attack && attack.getTarget()) {
                this.handleAttackMovement( transform, attack, movable.getSpeedPerSecond(), deltaTime);
            }
            
            transform.updateHeading(deltaTime);
        }
    }
   


    private handleJoystickMovement(entity: ECSEntity, transform: TransformComponent, input: InputComponent, speed: number, deltaTime: number): Vec2 {
        transform.rotation = Math.atan2(input.joystickDirection.y, input.joystickDirection.x);
        // 计算方向向量乘以速度和时间增量
        const movement = input.joystickDirection.clone().multiplyScalar(speed * deltaTime);
        // 计算提议的位置
        const proposedPosition = transform.position.add(movement);

        // console.log("joystickDirection", input.joystickDirection, "movement", movement, "proposedPosition", proposedPosition)
        // console.log("speed", speed * deltaTime,speed)

        let currentPosition = transform.position
        transform.position = proposedPosition
        // if(this.colliderManager.checkEntityBlocked(entity)){ // 执行碰撞检测
        //     transform.position = currentPosition //还是当前位置
        // }

        // const pathfinding = entity.getComponent(PathfindingComponent);
        // if (pathfinding) {
        //     pathfinding.setState(PathfindingState.NONE);
        // }

        return proposedPosition;
    }

    private handlePathfindingMovement( transform: TransformComponent, pathfinding: PathfindingComponent, speed: number, deltaTime: number): void {
        const nextPoint = pathfinding.getNextPoint();
        if (!nextPoint) return;

        const direction = nextPoint.subtract(transform.position).normalize();
        transform.rotation = Math.atan2(direction.y, direction.x);
        transform.position = transform.position.add(direction.multiplyScalar(speed * deltaTime));
    }

    private handleAttackMovement(transform: TransformComponent, attack: AttackComponent, speed: number, deltaTime: number): void {
        const target = attack.getTarget();
        if (!target) return;

        const targetTransform = target.getComponent(TransformComponent);
        if (!targetTransform) return;

        const distance = Vec2.distance(transform.position, targetTransform.position);
        if (!attack.isInAttackRange(distance)) {
            this.handleTrackingMovement( transform, targetTransform.position, speed, deltaTime);
        }
    }

    private handleTrackingMovement(
        transform: TransformComponent, 
        targetPosition: Vec2,
        speed: number, 
        deltaTime: number
    ): void {
        const direction = targetPosition.subtract(transform.position).normalize();
        transform.position = transform.position.add(direction.multiplyScalar(speed * deltaTime));
        transform.rotation = Math.atan2(direction.y, direction.x);
    }
}