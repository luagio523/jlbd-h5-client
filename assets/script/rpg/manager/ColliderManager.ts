import { Intersection2D, Rect } from "cc";
import { GameEntityManager } from "./GameEntityManager";
import { ECSEntity } from "../ecs/ECSEntity";
import { TransformComponent } from "../component/TransformComponent";
import { ShapeComponent } from "../component/ShapeComponent";
import { ShapeUtil } from "../util/ShapeUtil";
import { QueryManager } from "./QueryManager";
import MapManager from "./MapManager";
import { GameMap } from "../map/GameMap";

export class ColliderManager {
    private static instance: ColliderManager;
    private gameMap:GameMap

    private constructor() {}

    public initialize(gameMap:GameMap) {
        this.gameMap = gameMap
    }

    public static getInstance(): ColliderManager {
        if (!ColliderManager.instance) {
            ColliderManager.instance = new ColliderManager();
        }
        return ColliderManager.instance;
    }

    /**
     * 检测实体是否会被阻挡
     * @param entity 
     * @returns 
     */
    public checkEntityBlocked(entity: ECSEntity): boolean {
        if (this.checkEntityStaticBlocked(entity)) {
            return true;
        }
        if (this.checkEntityDynamicBlocked(entity)) {
            return true;
        }
        return false;
    }

    /**
     * 检测实体是否被静态障碍物阻挡
     * @param entity 
     * @returns 
     */
    public checkEntityStaticBlocked(entity: ECSEntity): boolean {
        let transformComponent = entity.getComponent(TransformComponent);
        let position = transformComponent.position;
        return !MapManager.getInstance().getGameMap().isWalkable(position.x, position.y);
    }

    /**
     * 检测实体是否被动态实体阻挡
     * @param entity 
     * @returns 
     */
    public checkEntityDynamicBlocked(entity: ECSEntity): boolean {
        let transformComponent = entity.getComponent(TransformComponent);
        let shapeComponent = entity.getComponent(ShapeComponent);
        let checkRect = shapeComponent.getFootSquare(transformComponent.position);
        let queryManager = QueryManager.getInstance();
        let entities = queryManager.queryEntitiesInAABB(checkRect);
        for (const queryEntity of entities) {
            if (entity != queryEntity) { // 不是自身
                let queryTransformComponent = queryEntity.getComponent(TransformComponent);
                let queryShapeComponent = queryEntity.getComponent(ShapeComponent);
                let entityRect = queryShapeComponent.getFootSquare(queryTransformComponent.position);
                if (ShapeUtil.rectRect(checkRect, entityRect)) {
                    return true;
                }
            }
        }
        return false;
    }
}
