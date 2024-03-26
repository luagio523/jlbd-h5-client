import {  Rect, Vec2, utils } from "cc";
import { ECSComponent } from "../ecs/ECSComponent";

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
    public getFootSquare(center: { x: number, y: number }, radius: number) {
        let width = radius + radius
        return new Rect(center.x - radius,center.y - radius,width,width)
    }

    /**
     * 获取形状所占据矩形
     * @param center 
     * @param radius 
     * @returns 
     */
    public getShapeSquare(center: Vec2, width: number, height: number) :Rect{
        return new Rect(center.x - width>>1,center.y - height>>1,width,height)
    }

}