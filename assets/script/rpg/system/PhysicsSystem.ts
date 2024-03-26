// 为了实现固定时间步长运行，我们可以设置一个固定的时间增量，与物理系统的更新逻辑相结合。
// 物理系统应该累积过去的时间，并在达到固定时间步长时更新一次。

import { TransformComponent } from "../component/TransformComponent";
import { BaseSystem } from "./BaseSystem";
import { MovableComponent } from "../component/MovableComponent";
import { InputComponent } from "../component/InputComponent";
import { ECSEntity } from "../ecs/ECSEntity";
import { ShapeComponent } from "../component/ShapeComponent";

export class PhysicsSystem extends BaseSystem{
    private fixedDeltaTime: number; // 固定的时间步长
    private accumulatedTime: number = 0; // 时间累积器

    constructor(fixedDeltaTime: number) {
        super()
        this.fixedDeltaTime = fixedDeltaTime; // 例如：1/60 表示每秒更新60次
    }

    update(deltaTime: number): void {
        this.accumulatedTime += deltaTime;
        let entities = this.getEntitiesWithComponent(MovableComponent)
        while (this.accumulatedTime >= this.fixedDeltaTime) {
            for (const entity of entities) {
                const transform = entity.getComponent(TransformComponent);
                const collider = entity.getComponent(ShapeComponent);
                const movable = entity.getComponent(MovableComponent);
                const input = entity.getComponent(InputComponent);

                if (input.joystickActive) {
                    // 在这里处理摇杆移动和碰撞
                    this.handleJoystickMovement(entity, this.fixedDeltaTime);
                } else {
                    // 处理其他的物理逻辑，例如自动寻路移动
                }
            }
            this.accumulatedTime -= this.fixedDeltaTime; // 消耗固定的时间增量
        }
    }

    private handleJoystickMovement(entity: ECSEntity, deltaTime: number): void {
        // 获取必要的组件
        const transform = entity.getComponent(TransformComponent);
        const shape = entity.getComponent(ShapeComponent);
        const movable = entity.getComponent(MovableComponent);
        const input = entity.getComponent(InputComponent);

        // 计算预期位置
        let proposedPosition = transform.position.add(input.joystickDirection.multiplyScalar(movable.speed * deltaTime));
        let collisionOccurred = false;

        // // 执行碰撞检测
        // for (const otherEntity of entities) {
        //     if (entity === otherEntity) continue;
        //     const otherCollider = otherEntity.getComponent<ShapeComponent>();

        //     if (this.checkCollision(collider.bounds, otherCollider.bounds, proposedPosition)) {
        //         collisionOccurred = true;
        //         break;
        //     }
        // }

        // 如果没有碰撞，则移动到新位置
        if (!collisionOccurred) {
            transform.position = proposedPosition;
        }
    }

    // private checkCollision(shape1: Shape, shape2: Shape, position: Vector2): boolean {
    //     // 具体的碰撞检测逻辑
    //     // ...
    // }
}