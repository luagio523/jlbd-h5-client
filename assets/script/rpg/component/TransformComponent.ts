import { Vec2 } from "cc";
import { ECSComponent } from "../ecs/ECSComponent";

export class TransformComponent extends ECSComponent{
    position: Vec2; // 2D世界中的x和y
    rotation: number; // 实体的朝向
}