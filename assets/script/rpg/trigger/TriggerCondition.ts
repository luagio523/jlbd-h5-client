import { Vec2 } from "cc";
import { ECSEntity } from "../ecs/ECSEntity";
import { TransformComponent } from "../component/TransformComponent";




// 预定义的一些常用条件
export const TriggerConditions = {
    ENTER: (entity: ECSEntity, context: { event: string }) => context.event === 'enter',
    EXIT: (entity: ECSEntity, context: { event: string }) => context.event === 'exit',
    INTERACT: (entity: ECSEntity, context: { event: string }) => context.event === 'interact',
    IN_RANGE: (range: number) => (entity: ECSEntity, context: { position: Vec2 }) => {
        const transform = entity.getComponent(TransformComponent);
        // 检查组件和位置的有效性
        if (!transform || !context.position) {
            console.warn("Entity is missing TransformComponent or context position is invalid.");
            return false;
        }
        return Vec2.distance(transform.position, context.position) <= range;
    },
    HAS_ITEM: (itemId: string) => (entity: ECSEntity) => {
        // const inventory = entity.getComponent('Inventory');
        // if (!inventory) {
        //     console.warn("Entity is missing Inventory component.");
        //     return false;
        // }
        // return inventory.hasItem(itemId);

        return false;
    }
}