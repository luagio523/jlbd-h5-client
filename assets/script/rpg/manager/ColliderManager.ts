import { Intersection2D, Rect } from "cc";
import { EntityQueryManager } from "./EntityQueryManager";
import { ECSEntity } from "../ecs/ECSEntity";
import { TransformComponent } from "../component/TransformComponent";
import { ShapeComponent } from "../component/ShapeComponent";
import { ShapeUtil } from "../util/ShapeUtil";
import { GameMap } from "../map/GameMap";

export class ColliderManager{
    /**
     * 检测实体是否会被阻挡
     * @param entity 
     * @returns 
     */
    public static checkEntityBlocked(entity:ECSEntity):boolean{
        if(this.checkEntityStaticBlocked(entity)){
            return true 
        }
        if(this.checkEntityDynamicBlocked(entity)){ //检测是否懂
            return true 
        }
        return false 
    }

    /**
     * 检测实体是否被静态障碍物阻挡
     * @param entity 
     * @returns 
     */
    public static checkEntityStaticBlocked(entity:ECSEntity):boolean{
        let transformComponent = entity.getComponent(TransformComponent)
        let position = transformComponent.position
        return !GameMap.ins().isWalkable(position.x,position.y)
    }

    /**
     * 检测实体是否被动态实体阻挡
     * @param entity 
     * @returns 
     */
    public static checkEntityDynamicBlocked(entity:ECSEntity):boolean{
        let transformComponent = entity.getComponent(TransformComponent)
        let shapeComponent = entity.getComponent(ShapeComponent)
        let checkRect= shapeComponent.getFootSquare(transformComponent.position)
        let entities = EntityQueryManager.queryNearyByEntitiesWithRect(checkRect);
        for (const queryEntity of entities) {
            if(entity != queryEntity){ //不是自身
                let transformComponent = queryEntity.getComponent(TransformComponent)
                let shapeComponent = queryEntity.getComponent(ShapeComponent)
                let entityRect = shapeComponent.getFootSquare(transformComponent.position)
                if (ShapeUtil.rectRect(checkRect,entityRect)){
                    return true 
                }
            }
        }
        return false
    }
}

