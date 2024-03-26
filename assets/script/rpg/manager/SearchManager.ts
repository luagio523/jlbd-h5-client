

//怪物追踪，利用rvo移动，检测格子阻挡。如果A被阻挡，A找寻A*寻路。 顺便找到附近的符合条件怪物，加入移动群组，A作为群组领导。

import { Rect, Vec2 } from "cc";
import { ECSEntity } from "../ecs/ECSEntity";
import { UnitTargetFlag, UnitTargetTeam, UnitTargetType } from "../enum/Unit";
import { ECSManager } from "../ecs/ESCManager";
import { RectUtil } from "../util/RectUtil";


// 如果主角移动的距离没有超过一个阈值，或者主角的新位置沿着原来的路径移动，那么就没有必要重新计算路径。
export interface QueryFilter {
    unitTargetFlag?:UnitTargetFlag;
    unitTargetTeam?:UnitTargetTeam;
    unitTargetType?:UnitTargetType;
}


export type Circle = {position: Vec2, radius: number}
export type Polygon = Array<Vec2>

export class OBB {
    rect:Rect; //矩形
    radian:number; //旋转角度
}

export class EntityQueryManager {


    public queryNearyByEntitiesWithRect(rect:Rect, filter?:(entity:ECSEntity)=>boolean):Array<ECSEntity>{
        let entities = ECSManager.Inst.entities.all();
        return filter ? entities.filter(filter) : entities;
    }
    
    public queryEntitiesInAABB(rect:Rect, queryFilter?:QueryFilter):Array<ECSEntity>{
        // 如果没有提供queryFilter，直接查询并返回
        if (!queryFilter) {
            return this.queryNearyByEntitiesWithRect(rect);
        }
    
        // 如果提供了queryFilter，创建一个filter并执行查询
        return this.queryNearyByEntitiesWithRect(rect, (entity:ECSEntity):boolean => {
            //获取组件信息
            // let unitComponent = entity.getUnitComponent(); 
    
            // if(queryFilter.unitTargetFlag && unitComponent.unitTargetFlag !== queryFilter.unitTargetFlag)
            //     return false; 
            // if(queryFilter.unitTargetTeam && unitComponent.unitTargetTeam !== queryFilter.unitTargetTeam)
            //     return false; 
            // if(queryFilter.unitTargetType && unitComponent.unitTargetType !== queryFilter.unitTargetType)
            //     return false;
    
            // 所有过滤条件都符合，返回true
            return true;
        });
    }

    // 查询圆形范围内的实体
public queryEntitiesInCircle(center:Vec2, radius:number, filter?:QueryFilter){
    //构造一个矩形，矩形的中心点与圆心重合，矩形的高和宽都等于圆的直径
    let rect = new Rect(center.x - radius, center.y - radius, 2 * radius, 2 * radius);

    //首先获取矩形范围内的所有实体
    return this.queryNearyByEntitiesWithRect(rect, (entity:ECSEntity):boolean => {
        //获取组件信息
        // let unitComponent = entity.getUnitComponent(); 

        // if(queryFilter.unitTargetFlag && unitComponent.unitTargetFlag !== queryFilter.unitTargetFlag)
        //     return false; 
        // if(queryFilter.unitTargetTeam && unitComponent.unitTargetTeam !== queryFilter.unitTargetTeam)
        //     return false; 
        // if(queryFilter.unitTargetType && unitComponent.unitTargetType !== queryFilter.unitTargetType)
        //     return false;

        // 所有过滤条件都符合，返回true
        return true;
    });
}

// 查询多边形范围内的实体
public queryEntitiesInPolygon(polygon:Array<Vec2>, filter?:QueryFilter){
    //获取多边形的外接矩形
    let rect = RectUtil.getBoundingBoxOfPolygon(polygon);

    return this.queryNearyByEntitiesWithRect(rect, (entity:ECSEntity):boolean => {
        //获取组件信息
        // let unitComponent = entity.getUnitComponent(); 

        // if(queryFilter.unitTargetFlag && unitComponent.unitTargetFlag !== queryFilter.unitTargetFlag)
        //     return false; 
        // if(queryFilter.unitTargetTeam && unitComponent.unitTargetTeam !== queryFilter.unitTargetTeam)
        //     return false; 
        // if(queryFilter.unitTargetType && unitComponent.unitTargetType !== queryFilter.unitTargetType)
        //     return false;

        // 所有过滤条件都符合，返回true
        return true;
    });
}

// 查询旋转矩形OBB范围内的实体
public queryEntitiesInOBB(aabb:Rect,radian:number, filter?:QueryFilter){
    let rect = RectUtil.getBoundingBoxOfOBB(aabb);
    //首先获取矩形范围内的所有实体
    return this.queryNearyByEntitiesWithRect(rect, (entity:ECSEntity):boolean => {
        //获取组件信息
        // let unitComponent = entity.getUnitComponent(); 

        // if(queryFilter.unitTargetFlag && unitComponent.unitTargetFlag !== queryFilter.unitTargetFlag)
        //     return false; 
        // if(queryFilter.unitTargetTeam && unitComponent.unitTargetTeam !== queryFilter.unitTargetTeam)
        //     return false; 
        // if(queryFilter.unitTargetType && unitComponent.unitTargetType !== queryFilter.unitTargetType)
        //     return false;

        // 所有过滤条件都符合，返回true
        return true;
    });
}

//通过射线查询
public queryEntitiesInRay(start:Vec2,end:Vec2,filter?:QueryFilter){
    //获取射线的外接矩形
    let rect = RectUtil.getBoundingBoxOfRay(start, end);

     //首先获取矩形范围内的所有实体
     return this.queryNearyByEntitiesWithRect(rect, (entity:ECSEntity):boolean => {
        //获取组件信息
        // let unitComponent = entity.getUnitComponent(); 

        // if(queryFilter.unitTargetFlag && unitComponent.unitTargetFlag !== queryFilter.unitTargetFlag)
        //     return false; 
        // if(queryFilter.unitTargetTeam && unitComponent.unitTargetTeam !== queryFilter.unitTargetTeam)
        //     return false; 
        // if(queryFilter.unitTargetType && unitComponent.unitTargetType !== queryFilter.unitTargetType)
        //     return false;

        // 所有过滤条件都符合，返回true
        return true;
    });
}



public queryEntitiesInSector(center:Vec2, radius:number, angleStart:number, angleEnd:number, filter?:QueryFilter){
    // 构造一个表示扇形的矩形，以圆心为中心，直径为两倍距离
    let rect = RectUtil.getBoundingBoxOfCircle(center,radius);

    // 首先获取矩形范围内的所有实体
     //首先获取矩形范围内的所有实体
     return this.queryNearyByEntitiesWithRect(rect, (entity:ECSEntity):boolean => {
        //获取组件信息
        // let unitComponent = entity.getUnitComponent(); 

        // if(queryFilter.unitTargetFlag && unitComponent.unitTargetFlag !== queryFilter.unitTargetFlag)
        //     return false; 
        // if(queryFilter.unitTargetTeam && unitComponent.unitTargetTeam !== queryFilter.unitTargetTeam)
        //     return false; 
        // if(queryFilter.unitTargetType && unitComponent.unitTargetType !== queryFilter.unitTargetType)
        //     return false;

        // 所有过滤条件都符合，返回true
        return true;
    });

    // // 对获取的实体进行二次筛选，只返回在扇形范围内的实体
    // let entitiesInSector = entitiesInRect.filter(entity => {
    //     let dx = entity.x - center.x;
    //     let dy = entity.y - center.y;
    //     let distance = Math.sqrt(dx * dx + dy * dy);  // 计算实体与中心点的距离
    //     let angle = Math.atan2(dy, dx);  // 计算实体相对于中心点的角度
        
    //     if (distance <= radius && angle >= angleStart && angle <= angleEnd) {
    //         return true;
    //     }
        
    //     return false;
    // });

    // return entitiesInSector;
}



    // // 查询扇形范围内的实体
    // public queryEntitiesInSector(sector:Sector, filter?:QueryFilter){

    // }
}