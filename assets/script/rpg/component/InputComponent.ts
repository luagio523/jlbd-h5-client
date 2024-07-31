import { Vec2 } from "cc";
import { ECSComponent } from "../ecs/ECSComponent";

import { ecsclass } from "../ecs/__private";
ecsclass("InputComponent")
export class InputComponent extends ECSComponent {
    joystickDirection: Vec2; // 摇杆的方向，范围从-1到1 //已经归一normalize了
    joystickActive: boolean; // 摇杆是否被按下
    constructor() {
        super();
    }

    public setJoystickInput(angle: number): void {
        if (angle === 255) {
            this.joystickActive = false;
            this.joystickDirection = new Vec2(0, 0); // 中心位置
            return;
        } else {
            this.joystickActive = true;
        }
    
        // 计算方向向量
        const normalizedAngle = (angle / 254) * 360; // 将压缩角度映射到0-360
        const radians = normalizedAngle * (Math.PI / 180);
        this.joystickDirection = new Vec2(Math.cos(radians), Math.sin(radians));
    
        // 反转 y 轴
        this.joystickDirection.y = -this.joystickDirection.y;
    
        // 归一化方向向量
        const length = Math.sqrt(this.joystickDirection.x * this.joystickDirection.x + this.joystickDirection.y * this.joystickDirection.y);
        if (length > 0) {
            this.joystickDirection.x /= length;
            this.joystickDirection.y /= length;
        }
    
        // console.log("Joystick input direction:", this.joystickDirection);
    }
    
}



// inputComp.buttonStates.forEach((state, buttonName) => {
//     if (state.pressed && !state.released) {
//         // 处理按钮按下的逻辑
//         console.log(buttonName + " button is pressed.");

//         // 按下立即施法的逻辑可以在这里执行
//     }

//     if (state.released) {
//         // 处理按钮被松开的逻辑
//         console.log(buttonName + " button is released.");

//         // 如果涉及到长按技能等逻辑，可以在这里检查并执行

//         // 重置按键状态
//         state.released = false;
//     }
// });

// 定义触摸输入的数据结构
export class TouchInput {
    startPosition: Vec2; // 触摸开始的位置
    currentPositon: Vec2; // 当前触摸位置
    endPosition: Vec2; // 触摸结束的位置（如果有）
    isActive: boolean; // 是否正在触摸
    isTapping: boolean; // 是否是轻触（非拖动）
}