import { ECSComponent } from "../ecs/ECSComponent";

export class ColliderComponent extends ECSComponent{
    public width: number = 0; // 角色图像的宽度, 
    public height: number = 0; // 角色图像的高度, 从配置表里面读取
    public radius: number = 0; // 角色在地图上的逻辑范围;
}