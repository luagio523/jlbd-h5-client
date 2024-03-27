import {  Rect, Vec2, utils } from "cc";
import { ECSComponent } from "../ecs/ECSComponent";

/**
 * 角色形状矩形 下边中心是实体位置
 */
export class ShapeComponent extends ECSComponent{
    public width: number = 0; // 角色图像的宽度, 
    public height: number = 0; // 角色图像的高度, 从配置表里面读取
    public radius: number = 0; // 角色在地图上的逻辑范围;


    /**
     * 获取脚底所占据的矩形
     * @param center 
     * @param radius 
     * @returns 
     */
    public getFootSquare(position: Vec2) {
        let width = this.radius + this.radius
        return new Rect(position.x - this.radius,position.y - this.radius,width,width)
    }

    /**
     * 获取形状所占据矩形 (角色形状矩形 下边中心是实体位置)
     * @param position 
     * @param radius 
     * @returns 
     */
    public getShapeSquare(position: Vec2) :Rect{
        return new Rect(position.x - this.width>>1,position.y - this.height>>1,this.width,this.height)
    }

    /**
     * 获取形状中心 
     * @param position 
     * @returns 
     */
    public getShapeCenter(position:Vec2):Vec2{
        return new Vec2(position.x,position.y+this.height>>1)
    }

}

//