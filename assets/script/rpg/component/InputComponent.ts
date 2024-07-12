import { Vec2 } from "cc";
import { ECSComponent } from "../ecs/ECSComponent";

export class InputComponent extends ECSComponent {
    joystickDirection: Vec2; // 摇杆的方向，范围从-1到1
    joystickActive: boolean; // 摇杆是否被操作激活

    touches: Vec2; // 保存触摸的位置
    buttonStates: Map<string, { pressed: boolean, pressTime: number, released: boolean }> = new Map(); 保存按钮的按下状态

    
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