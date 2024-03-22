import { Vec2 } from "cc";
import { ECSComponent } from "../ecs/ECSComponent";

export class InputComponent extends ECSComponent{
    joystickDirection: Vec2; // 摇杆的方向，范围从-1到1
    joystickActive: boolean; // 摇杆是否被操作激活

    buttonsPressed: Map<string, boolean>; // 存储按钮的按下状态

    touch: TouchInput; // 记录触摸输入数据
}


// 定义触摸输入的数据结构
export class TouchInput {
    startPosition: Vec2; // 触摸开始的位置
    currentPositon: Vec2; // 当前触摸位置
    endPosition: Vec2; // 触摸结束的位置（如果有）
    isActive: boolean; // 是否正在触摸
    isTapping: boolean; // 是否是轻触（非拖动）
}