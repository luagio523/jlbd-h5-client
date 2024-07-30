import { Vec2 } from "cc";
import { ECSComponent } from "../ecs/ECSComponent";

import { ecsclass } from "../ecs/__private";
ecsclass("InputComponent")
export class InputComponent extends ECSComponent {
    joystickDirection: Vec2; // 摇杆的方向，范围从-1到1
    joystickActive: boolean; // 摇杆是否被按下
    angle:number; // 摇杆的角度，范围从-180到180    
    constructor() {
        super();
    }

    public setJoystickInput(angle:number): void {
        if(angle == 255){
            this.joystickActive = false;
        }else{
            this.joystickActive = true;
        }
        this.angle = angle;
        this.joystickDirection = this.decompressAngleToVec2(angle);
    }

    public  decompressAngleToVec2(compressedAngle: number): Vec2 | null {
        if (compressedAngle === 255) {
            return new Vec2(0, 0); // 返回中心位置
        }

        const angle = (compressedAngle / 254) * 360;
        const radians = angle * (Math.PI / 180);
        const x = Math.cos(radians);
        const y = Math.sin(radians);

        return new Vec2(x, y).normalize();
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