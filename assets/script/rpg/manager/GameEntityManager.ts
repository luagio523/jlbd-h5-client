

//怪物追踪，利用rvo移动，检测格子阻挡。如果A被阻挡，A找寻A*寻路。 顺便找到附近的符合条件怪物，加入移动群组，A作为群组领导。

import { Intersection2D, Rect, Vec2 } from "cc";
import { ECSEntity } from "../ecs/ECSEntity";
import { UnitTargetFlag, UnitTargetTeam, UnitTargetType } from "../enum/Unit";
import { ECSManager } from "../ecs/ESCManager";
import { ShapeUtil } from "../util/ShapeUtil";
import { TransformComponent } from "../component/TransformComponent";
import { ShapeComponent } from "../component/ShapeComponent";
import { UnitComponent } from "../component/UnitComponent";


// 如果主角移动的距离没有超过一个阈值，或者主角的新位置沿着原来的路径移动，那么就没有必要重新计算路径。
export interface QueryFilter {
    unitTargetFlag?: UnitTargetFlag;
    unitTargetTeam?: UnitTargetTeam;
    unitTargetType?: UnitTargetType;
}


export class GameEntityManager {

    private static instance: GameEntityManager;
    private selectedHero: ECSEntity | null = null;
    private playerControlledHero: ECSEntity | null = null;

    private constructor() {}

    public static getInstance(): GameEntityManager {
        if (!GameEntityManager.instance) {
            GameEntityManager.instance = new GameEntityManager();
        }
        return GameEntityManager.instance;
    }

    // 现有的查询方法...

    public getNearbyEntities(entity: ECSEntity, radius: number): ECSEntity[] {
        const center = entity.getComponent(TransformComponent).position;
        return this.queryEntitiesInCircle(center, radius);
    }

    public setSelectedHero(hero: ECSEntity | null): void {
        this.selectedHero = hero;
    }

    public getSelectedHero(): ECSEntity | null {
        return this.selectedHero;
    }

    public setPlayerControlledHero(hero: ECSEntity | null): void {
        this.playerControlledHero = hero;
    }

    public getPlayerControlledEntity(): ECSEntity | null {
        return this.playerControlledHero;
    }



    private  queryNearyByEntitiesWithRect(rect: Rect, filter?: (entity: ECSEntity) => boolean): Array<ECSEntity> {
        let entities = ECSManager.Inst.entities.all();
        return filter ? entities.filter(filter) : entities;
    }

    public  queryEntitiesInAABB(rect: Rect, filter?: QueryFilter): Array<ECSEntity> {
        return this.queryNearyByEntitiesWithRect(rect, (entity: ECSEntity): boolean => {
            if (filter && !this.isMatch(entity, filter)) return false;
            let transformComponent = entity.getComponent(TransformComponent);
            return ShapeUtil.pointInAABB(transformComponent.position, rect);
        });
    }

    public  queryEntitiesInCircle(center: Vec2, radius: number, filter?: QueryFilter): Array<ECSEntity> {
        let rect = new Rect(center.x - radius, center.y - radius, 2 * radius, 2 * radius);
        let radiusSqr = radius * radius;
        return this.queryNearyByEntitiesWithRect(rect, (entity: ECSEntity): boolean => {
            if (filter && !this.isMatch(entity, filter)) return false;
            let transformComponent = entity.getComponent(TransformComponent);
            return ShapeUtil.pointInCircle(transformComponent.position, center, radiusSqr);
        });
    }

    public  queryEntitiesInPolygon(polygon: Array<Vec2>, filter?: QueryFilter): Array<ECSEntity> {
        let rect = ShapeUtil.getBoundingBoxOfPolygon(polygon);
        return this.queryNearyByEntitiesWithRect(rect, (entity: ECSEntity): boolean => {
            if (filter && !this.isMatch(entity, filter)) return false;
            let transformComponent = entity.getComponent(TransformComponent);
            return ShapeUtil.pointInPolygon(transformComponent.position, polygon);
        });
    }

    public  queryEntitiesInOBB(aabb: Rect, radian: number, filter?: QueryFilter): Array<ECSEntity> {
        let rect = ShapeUtil.getBoundingBoxOfOBB(aabb);
        return this.queryNearyByEntitiesWithRect(rect, (entity: ECSEntity): boolean => {
            if (filter && !this.isMatch(entity, filter)) return false;
            let polygon = ShapeUtil.getPolygonOfOBB(aabb, radian);
            let transformComponent = entity.getComponent(TransformComponent);
            return ShapeUtil.pointInPolygon(transformComponent.position, polygon);
        });
    }

    public  queryEntitiesInRay(start: Vec2, end: Vec2, filter?: QueryFilter): Array<ECSEntity> {
        let rect = ShapeUtil.getBoundingBoxOfRay(start, end);
        let lineSegmentLengthSqr = Vec2.squaredDistance(start, end);
        return this.queryNearyByEntitiesWithRect(rect, (entity: ECSEntity): boolean => {
            if (filter && !this.isMatch(entity, filter)) return false;
            let transformComponent = entity.getComponent(TransformComponent);
            let shapeComponent = entity.getComponent(ShapeComponent);
            let radiusSqr = shapeComponent.radius << 1;
            return ShapeUtil.pointCloseToLineSegment(transformComponent.position, start, end, radiusSqr, lineSegmentLengthSqr);
        });
    }

    public  queryEntitiesInSector(center: Vec2, radius: number, angleStart: number, angleEnd: number, filter?: QueryFilter): Array<ECSEntity> {
        let rect = ShapeUtil.getBoundingBoxOfCircle(center, radius);
        let radiusSqr = radius * radius;
        return this.queryNearyByEntitiesWithRect(rect, (entity: ECSEntity): boolean => {
            if (filter && !this.isMatch(entity, filter)) return false;
            let transformComponent = entity.getComponent(TransformComponent);
            return ShapeUtil.pointInSector(transformComponent.position, center, radiusSqr, angleStart, angleEnd);
        });
    }

    private  isMatch(entity: ECSEntity, filter: QueryFilter): boolean {
        let unitComponent = entity.getComponent(UnitComponent);
        if (!unitComponent) return false;

        if (filter.unitTargetFlag && !(unitComponent.unitTargetFlag & filter.unitTargetFlag)) return false;
        if (filter.unitTargetTeam && !(unitComponent.unitTargetTeam & filter.unitTargetTeam)) return false;
        if (filter.unitTargetType && !(unitComponent.unitTargetType & filter.unitTargetType)) return false;

        return true;
    }
}