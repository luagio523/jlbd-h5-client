import { Vec2 } from "cc";
import { ECSComponent } from "../ecs/ECSComponent";

export class MovableComponent extends ECSComponent{
    speed: number; // 移动速度
    heading: Vec2; // 实际朝向，用于平滑转向
}