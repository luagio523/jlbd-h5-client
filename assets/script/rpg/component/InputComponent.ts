import { Vec2 } from "cc";

export class InputComponent {
    joystickDirection: Vec2; // 摇杆的方向，范围从-1到1
    joystickActive: boolean; // 摇杆是否被操作激活
}