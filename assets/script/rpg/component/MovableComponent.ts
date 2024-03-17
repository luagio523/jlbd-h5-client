import { Vec2 } from "cc";

export class MovableComponent {
    speed: number; // 移动速度
    heading: Vec2; // 实际朝向，用于平滑转向
}