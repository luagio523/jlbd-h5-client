import { Vec2 } from "cc";
import { ECSEntity } from "../ecs/ECSEntity";
import { TransformComponent } from "../component/TransformComponent";




// 预定义的一些常用条件
export const TriggerConditions = {
    ENTER: (entity: ECSEntity, context: { event: string }) => context.event === 'enter',
    EXIT: (entity: ECSEntity, context: { event: string }) => context.event === 'exit',
    INTERACT: (entity: ECSEntity, context: { event: string }) => context.event === 'interact',
    IN_RANGE: (range: number) => (entity: ECSEntity, context: { position: Vec2 }) => {
        return Vec2.distance(entity.getComponent(TransformComponent).position, context.position) <= range;
    },
    HAS_ITEM: (itemId: string) => (entity: ECSEntity) => {
        // entity.getComponent('Inventory').hasItem(itemId),
        return false
    }
}