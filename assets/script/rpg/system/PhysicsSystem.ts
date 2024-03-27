// 为了实现固定时间步长运行，我们可以设置一个固定的时间增量，与物理系统的更新逻辑相结合。
// 物理系统应该累积过去的时间，并在达到固定时间步长时更新一次。

import { TransformComponent } from "../component/TransformComponent";
import { BaseSystem } from "./BaseSystem";
import { MovableComponent } from "../component/MovableComponent";
import { InputComponent } from "../component/InputComponent";
import { ECSEntity } from "../ecs/ECSEntity";
import { ShapeComponent } from "../component/ShapeComponent";
import { ColliderManager } from "../manager/ColliderManager";
import { Timer } from "../../core/common/timer/Timer";

export class PhysicsSystem extends BaseSystem{
    private fixedDeltaTime: number; // 固定的时间步长
    private accumulatedTime: number = 0; // 时间累积器

    private timer:Timer

    constructor(fixedDeltaTime: number) {
        super()
        this.timer = new Timer(fixedDeltaTime,this.handleMovement.bind(this))
        this.fixedDeltaTime = fixedDeltaTime; // 例如：1/60 表示每秒更新60次
    }

    update(deltaTime: number): void {
       this.timer.update(deltaTime)
    }

    private handleMovement(deltaTime:number):void{
        let entities = this.getEntitiesWithComponent(MovableComponent)
        for (const entity of entities) {
            
            const input = entity.getComponent(InputComponent);

            if (input.joystickActive) {
                // 在这里处理摇杆移动和碰撞
                this.handleJoystickMovement(entity, this.fixedDeltaTime);
            } else {
                const transform = entity.getComponent(TransformComponent);
                const collider = entity.getComponent(ShapeComponent);
                const movable = entity.getComponent(MovableComponent);
                // 处理其他的物理逻辑，例如自动寻路移动
            }
        }
    }

    private handleJoystickMovement(entity: ECSEntity, deltaTime: number): void {
        // 获取必要的组件
        const transform = entity.getComponent(TransformComponent);
        const movable = entity.getComponent(MovableComponent);
        const input = entity.getComponent(InputComponent);
        let currentPosition = transform.position
        // 计算预期位置
        let proposedPosition = transform.position.add(input.joystickDirection.multiplyScalar(movable.speed * deltaTime));

        transform.position = proposedPosition
        if(ColliderManager.checkEntityBlocked(entity)){ // 执行碰撞检测
            transform.position = currentPosition //还是当前位置
        }

    }

}