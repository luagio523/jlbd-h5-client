import { Vec2 } from "cc";
import { Event, GButton, GComponent, GObject, GTween, EaseType } from "fairygui-cc";
import { FairyUIAdapter } from "../../core/ui/UIAdapter";

export class Joystick extends FairyUIAdapter {

    private joystickBg: GObject;
    private joystickHandle: GButton;
    private radius: number;
    private validArea: GObject;
    private startPosition: Vec2 = new Vec2();
    private touchId: number = -1;
    private lastSentAngle: number = -1;
    private radiusSquared: number;
    private tween: any = null;
    private onJoyStickMoveCallback: (angle: number) => void;

    public injectUI(ui: GComponent): void {
        super.injectUI(ui);

        this.validArea = this.getUIChild<GObject>("joystick_touch");
        this.joystickBg = this.getUIChild<GObject>("joystick_center");
        this.joystickHandle = this.getUIChild<GButton>("joystick");
        this.joystickHandle.changeStateOnClick = false;

        this.radius = 90;
        this.radiusSquared = this.radius * this.radius;

        this.validArea.on(Event.TOUCH_BEGIN, this.onTouchStart, this);
        this.validArea.on(Event.TOUCH_MOVE, this.onTouchMove, this);
        this.validArea.on(Event.TOUCH_END, this.onTouchEnd, this);
    }

    private onTouchStart(event: Event) {
        if (this.touchId === -1) {
            // 取消当前的缓动
            if (this.tween) {
                this.tween.kill();
                this.tween = null;
            }

            this.touchId = event.touchId;
            const touchPos = event.pos;
            this.startPosition.set(touchPos.x, touchPos.y);
            // 将背景中心点设置到点击位置
            this.joystickBg.setPosition(touchPos.x, touchPos.y);
            this.joystickHandle.setPosition(touchPos.x, touchPos.y);
            this.joystickHandle.selected = true;
            event.captureTouch();
        }
    }

    private onTouchMove(event: Event) {
        if (this.touchId === event.touchId) {
            const touchPos = event.pos;
            const offsetX = touchPos.x - this.startPosition.x;
            const offsetY = touchPos.y - this.startPosition.y;
            const distanceSquared = offsetX * offsetX + offsetY * offsetY;

            let finalX = offsetX;
            let finalY = offsetY;

            if (distanceSquared > this.radiusSquared) {
                const scale = this.radius / Math.sqrt(distanceSquared);
                finalX *= scale;
                finalY *= scale;
            }

            // 更新手柄位置，确保在半径范围内
            this.joystickHandle.setPosition(
                this.startPosition.x + finalX,
                this.startPosition.y + finalY
            );

            const angle = this.getCompressedAngle(finalX, finalY);
            this.sendEvent(angle);
        }
    }

    private onTouchEnd(event: Event) {
        if (this.touchId === event.touchId) {
            this.touchId = -1;
            // 使用缓动效果将手柄移回中心位置
            this.tween = GTween.to2(
                this.joystickHandle.x,
                this.joystickHandle.y,
                this.startPosition.x,
                this.startPosition.y,
                0.3
            )
            .setTarget(this.joystickHandle, this.joystickHandle.setPosition)
            .setEase(EaseType.CircOut)
            .onComplete(this.onTweenComplete, this);

            this.sendEvent(255); // 发送中心位置角度
        }
    }

    private onTweenComplete(): void {
        // 缓动完成后的回调
        this.joystickHandle.selected = false;
        this.tween = null;
    }

    private sendEvent(angle: number) {
        if (angle !== this.lastSentAngle) {
            this.lastSentAngle = angle;

            if (this.onJoyStickMoveCallback) {
                this.onJoyStickMoveCallback(angle);
            }
        }
    }

    public onJoyStickMove(callback: (angle: number) => void): void {
        this.onJoyStickMoveCallback = callback;
    }

    private getCompressedAngle(x: number, y: number): number {
        let angle = Math.atan2(y, x) * 180 / Math.PI;

        if (angle < 0) angle += 360; // 压缩角度到0-254范围
        return Math.round(angle * 254 / 360);
    }

    public static decompressAngleToVec2(compressedAngle: number): Vec2 | null {
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




// import { Vec2 } from "cc";
// import { Event, GButton, GComponent, GObject, GRoot, GTween, EaseType } from "fairygui-cc";
// import { FairyUIAdapter } from "../../core/ui/UIAdapter";
// import app from "../../App";
// import { TrigLookupTables } from "../../core/common/math/TrigLookupTables";

// export class Joystick extends FairyUIAdapter {
//     public static readonly JOYSTICK_MOVE = "joystick_move";

//     private joystickBg: GObject;
//     private joystickHandle: GButton;
//     private radius: number;
//     private validArea: GObject;
//     private startPosition: Vec2 = new Vec2();
//     private touchId: number = -1;
//     private lastSentAngle: number = -1;
//     private radiusSquared: number;
//     private tween: any = null;
//     private onJoyStickMoveCallback: (direction: Vec2,angle: number ) => void;

//     public injectUI(ui: GComponent): void {
//         super.injectUI(ui)

//         this.validArea = this.getUIChild<GObject>("joystick_touch");
//         this.joystickBg = this.getUIChild<GObject>("joystick_center");
//         this.joystickHandle = this.getUIChild<GButton>("joystick");
//         this.joystickHandle.changeStateOnClick = false;
        
//         this.radius = 90;
//         this.radiusSquared = this.radius * this.radius;

//         this.validArea.on(Event.TOUCH_BEGIN, this.onTouchStart, this);
//         this.validArea.on(Event.TOUCH_MOVE, this.onTouchMove, this);
//         this.validArea.on(Event.TOUCH_END, this.onTouchEnd, this);
//     }

//     private onTouchStart(event: Event) {
//         if (this.touchId === -1) {
//             // 取消当前的缓动
//             if (this.tween) {
//                 this.tween.kill();
//                 this.tween = null;
//             }

//             this.touchId = event.touchId;
//             const touchPos = event.pos;
//             this.startPosition.set(touchPos.x, touchPos.y);
//             // 将背景中心点设置到点击位置
//             this.joystickBg.setPosition(touchPos.x, touchPos.y);
//             this.joystickHandle.setPosition(touchPos.x, touchPos.y);
//             this.joystickHandle.selected = true;
//             event.captureTouch();
//         }
//     }

//     private onTouchMove(event: Event) {
//         if (this.touchId === event.touchId) {
//             const touchPos = event.pos;
//             const offsetX = touchPos.x - this.startPosition.x;
//             const offsetY = touchPos.y - this.startPosition.y;
//             const distanceSquared = offsetX * offsetX + offsetY * offsetY;
    
//             let finalX = offsetX;
//             let finalY = offsetY;
    
//             if (distanceSquared > this.radiusSquared) {
//                 const scale = this.radius / Math.sqrt(distanceSquared);
//                 finalX *= scale;
//                 finalY *= scale;
//             }
    
//             // 更新手柄位置，确保在半径范围内
//             this.joystickHandle.setPosition(
//                 this.startPosition.x + finalX,
//                 this.startPosition.y + finalY
//             );
    
//             const invRadius = 1 / this.radius;
//             this.direction.set(finalX * invRadius, finalY * invRadius);
//             this.sendEvent();
//         }
//     }

//     private onTouchEnd(event: Event) {
//         if (this.touchId === event.touchId) {
//             this.touchId = -1;
//             // 使用缓动效果将手柄移回中心位置
//             this.tween = GTween.to2(
//                 this.joystickHandle.x,
//                 this.joystickHandle.y,
//                 this.startPosition.x,
//                 this.startPosition.y,
//                 0.3
//             )
//             .setTarget(this.joystickHandle, this.joystickHandle.setPosition)
//             .setEase(EaseType.CircOut)
//             .onComplete(this.onTweenComplete, this);

//             this.direction.set(0, 0);
//             this.sendEvent();
//         }
//     }

//     private onTweenComplete(): void {
//         // 缓动完成后的回调
//         this.joystickHandle.selected = false;
//         this.tween = null;
//     }

//     private sendEvent() {
//         const angle = this.getCompressedAngle();
//         if (angle !== this.lastSentAngle) {
//             this.lastSentAngle = angle;

//             if(this.onJoyStickMoveCallback) {
//                 this.onJoyStickMoveCallback(this.direction.clone(),angle);
//             }
//         }
//     }


//     public onJoyStickMove(callback: ( direction: Vec2,angle: number) => void): void {
//         this.onJoyStickMoveCallback = callback;
//     }

//     private getCompressedAngle(): number {
//         if (this.direction.x === 0 && this.direction.y === 0) {
//             return 255; // 特殊值表示中心位置
//         }
//         let angle = Math.atan2(this.direction.y, this.direction.x) * 180 / Math.PI;


//         if (angle < 0) angle += 360; //压缩角度到0-254范围
//         return Math.round(angle * 254 / 360);
//     }

    
//     public static decompressAngleToVec2(compressedAngle: number): Vec2 | null {
//         if (compressedAngle === 255) {
//             return new Vec2(0, 0); // or return a specific direction like { x: 0, y: 0 }
//         }
    
//         const angle = (compressedAngle / 254) * 360;
    
//         const radians = angle * (Math.PI / 180);
    
//         const x = Math.cos(radians);
//         const y = Math.sin(radians);
    
//         return new Vec2(x, y).normalize();
//     }
    

//     // private getCompressedAngle(): number {
//     //     if (this.direction.x === 0 && this.direction.y === 0) {
//     //         return 255; // 特殊值表示中心位置
//     //     }
//     //     const trigTables = TrigLookupTables.getInstance();
//     //     const angle = trigTables.fastAtan2(this.direction.y, this.direction.x);
//     //     const normalizedAngle = angle < 0 ? angle + TrigLookupTables.TWO_PI : angle;
//     //     return Math.round(normalizedAngle * 254 / TrigLookupTables.TWO_PI);
//     // }
    
// }
