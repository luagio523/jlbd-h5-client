

//怪物追踪，利用rvo移动，检测格子阻挡。如果A被阻挡，A找寻A*寻路。 顺便找到附近的符合条件怪物，加入移动群组，A作为群组领导。

import { Intersection2D, Rect, Vec2 } from "cc";
import { ECSEntity } from "../ecs/ECSEntity";
import { UnitTargetFlag, UnitTargetTeam, UnitTargetType } from "../enum/Unit";
import { ECSManager } from "../ecs/ESCManager";
import { ShapeUtil } from "../util/ShapeUtil";
import { TransformComponent } from "../component/TransformComponent";
import { ShapeComponent } from "../component/ShapeComponent";


// 如果主角移动的距离没有超过一个阈值，或者主角的新位置沿着原来的路径移动，那么就没有必要重新计算路径。
export interface QueryFilter {
    unitTargetFlag?: UnitTargetFlag;
    unitTargetTeam?: UnitTargetTeam;
    unitTargetType?: UnitTargetType;
}

/**
 * 用于区域实体查询管理
 */
export class EntityQueryManager {

    /**
     * 查询附近的实体
     * @param rect 
     * @param filter 
     * @returns 
     */
    public static  queryNearyByEntitiesWithRect(rect: Rect, filter?: (entity: ECSEntity) => boolean): Array<ECSEntity> {
        let entities = ECSManager.Inst.entities.all();
        return filter ? entities.filter(filter) : entities;
    }

    //查询是否在AABB
    public static  queryEntitiesInAABB(rect: Rect, filter?: QueryFilter): Array<ECSEntity> {
        // 如果提供了queryFilter，创建一个filter并执行查询
        return this.queryNearyByEntitiesWithRect(rect, (entity: ECSEntity): boolean => {
            if (filter && !this.isMatch(entity, filter)) return false
            let transformComponent = entity.getComponent(TransformComponent)
            return ShapeUtil.pointInAABB(transformComponent.position,rect);
        });
    }


    // 查询圆形范围内的实体
    public static  queryEntitiesInCircle(center: Vec2, radius: number, filter?: QueryFilter) {
        //构造一个矩形，矩形的中心点与圆心重合，矩形的高和宽都等于圆的直径
        let rect = new Rect(center.x - radius, center.y - radius, 2 * radius, 2 * radius);
        let radiusSqr = radius*radius
        return this.queryNearyByEntitiesWithRect(rect, (entity: ECSEntity): boolean => {
            if (filter && !this.isMatch(entity, filter)) return false
            let transformComponent = entity.getComponent(TransformComponent)
            // let shapeComponent = entity.getComponent(ShapeComponent)
            // return Intersection2D.circleCircle(center,radius,transformComponent.position,shapeComponent.radius);
            return ShapeUtil.pointInCircle(transformComponent.position,center,radiusSqr)
        });
    }

    // 查询多边形范围内的实体
    public static  queryEntitiesInPolygon(polygon: Array<Vec2>, filter?: QueryFilter) {
        //获取多边形的外接矩形
        let rect = ShapeUtil.getBoundingBoxOfPolygon(polygon);
        return this.queryNearyByEntitiesWithRect(rect, (entity: ECSEntity): boolean => {
            if (filter && !this.isMatch(entity, filter)) return false

            let transformComponent = entity.getComponent(TransformComponent)
            return ShapeUtil.pointInPolygon(transformComponent.position, polygon); //只要点位于区域就行
        });
    }

    // 查询旋转矩形OBB范围内的实体
    public static  queryEntitiesInOBB(aabb: Rect, radian: number, filter?: QueryFilter) {
        let rect = ShapeUtil.getBoundingBoxOfOBB(aabb);
        //首先获取矩形范围内的所有实体
        return this.queryNearyByEntitiesWithRect(rect, (entity: ECSEntity): boolean => {
            if (filter && !this.isMatch(entity, filter)) return false

            let polygon = ShapeUtil.getPolygonOfOBB(aabb, radian)
            let transformComponent = entity.getComponent(TransformComponent)
            return ShapeUtil.pointInPolygon(transformComponent.position, polygon)
        });
    }

    //通过射线查询
    public static  queryEntitiesInRay(start: Vec2, end: Vec2, filter?: QueryFilter) {
        //获取射线的外接矩形
        let rect = ShapeUtil.getBoundingBoxOfRay(start, end);
        let lineSegmentLengthSqr = Vec2.squaredDistance(start,end)
        //首先获取矩形范围内的所有实体
        return this.queryNearyByEntitiesWithRect(rect, (entity: ECSEntity): boolean => {
            if (filter && !this.isMatch(entity, filter)) return false

            let transformComponent = entity.getComponent(TransformComponent)
            let shapeComponent = entity.getComponent(ShapeComponent)
            // let rect = shapeComponent.getShapeSquare(transformComponent.position) //射线就使用身体形状
            // return ShapeUtil.rayRect(start, end, rect);
            let radiusSqr = shapeComponent.radius << 1
            return ShapeUtil.pointCloseToLineSegment(transformComponent.position,start,end,radiusSqr,lineSegmentLengthSqr)
        });
    }


    //通过扇形查询
    public static  queryEntitiesInSector(center: Vec2, radius: number, angleStart: number, angleEnd: number, filter?: QueryFilter) {
        // 构造一个表示扇形的矩形，以圆心为中心，直径为两倍距离
        let rect = ShapeUtil.getBoundingBoxOfCircle(center, radius);
        let radiusSqr = radius*radius
        return this.queryNearyByEntitiesWithRect(rect, (entity: ECSEntity): boolean => {
            if (filter && !this.isMatch(entity, filter)) return false

            let transformComponent = entity.getComponent(TransformComponent)
            return  ShapeUtil.pointInSector(transformComponent.position,center,radiusSqr,angleStart,angleEnd)
        });
    }

    private static isMatch(entity: ECSEntity, filter?: QueryFilter): boolean {
        // let unitComponent = entity.getUnitComponent(); 

        // if(queryFilter.unitTargetFlag && unitComponent.unitTargetFlag !== queryFilter.unitTargetFlag)
        //     return false; 
        // if(queryFilter.unitTargetTeam && unitComponent.unitTargetTeam !== queryFilter.unitTargetTeam)
        //     return false; 
        // if(queryFilter.unitTargetType && unitComponent.unitTargetType !== queryFilter.unitTargetType)
        //     return false;

        // 所有过滤条件都符合，返回true
        return true
    }
}