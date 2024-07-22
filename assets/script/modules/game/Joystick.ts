import { Vec2 } from "cc";
import { Event, GButton, GComponent, GObject, GRoot } from "fairygui-cc";
import { FairyUIAdapter } from "../../core/ui/UIAdapter";
import app from "../../App";

export class Joystick extends FairyUIAdapter {
    public static readonly JOYSTICK_MOVE = "joystick_move";

    private joystickBg: GObject;
    private joystickHandle: GObject;
    private radius: number;
    private validArea: GObject;
    private startPosition: Vec2 = new Vec2();
    private touchId: number | null = null;
    private direction: Vec2 = new Vec2();
    private lastSentAngle: number = -1;

    public injectUI(ui: GComponent): void {
        super.injectUI(ui)

        console.log("Joystick injected", 1);

        this.validArea = this.getUIChild<GObject>("joystick_touch");
        this.joystickBg = this.getUIChild<GObject>("joystick_center");
        this.joystickHandle = this.getUIChild<GButton>("joystick");

        this.radius = 100;

        console.log("Joystick injected", this.validArea, this.joystickBg, this.joystickHandle);

        this.validArea.on(Event.TOUCH_BEGIN, this.onTouchStart, this);
        // this.validArea.on(Event.TOUCH_MOVE, this.onTouchMove, this);
        this.validArea.on(Event.TOUCH_END, this.onTouchEnd, this);
        // this.validArea.on(Event.TOUCH_CANCEL, this.onTouchEnd, this);

        GRoot.inst.on(Event.TOUCH_MOVE, this.onTouchMove, this);

    }

    private onTouchStart(event: Event) {
        console.log(this.touchId,"Joystick start",event.touchId)
        if (this.touchId === null) {
            this.touchId = event.touchId;
            const touchPos = event.pos 
            this.startPosition.set(touchPos.x, touchPos.y);
            // 将背景中心点设置到点击位置
            this.joystickBg.setPosition(touchPos.x, touchPos.y );
            this.joystickHandle.setPosition(touchPos.x, touchPos.y);
        }
    }

    private onTouchMove(event: Event) {
        if (this.touchId === event.touchId) {
            const touchPos = event.pos;
            const offset = new Vec2(touchPos.x - this.startPosition.x, touchPos.y - this.startPosition.y);
            const distance = Math.sqrt(offset.x * offset.x + offset.y * offset.y);

            if (distance > this.radius) {
                const angle = Math.atan2(offset.y, offset.x);
                offset.x = Math.cos(angle) * this.radius;
                offset.y = Math.sin(angle) * this.radius;
            }
            // 更新手柄位置，确保在半径范围内
            this.joystickHandle.setPosition(
                this.startPosition.x + offset.x ,
                this.startPosition.y + offset.y 
            );
            this.direction.set(offset.x / this.radius, offset.y / this.radius);
            this.sendEvent();
        }
    }

    private onTouchEnd(event: Event) {
        console.log("Joystick onTouchEnd", event.pos);
        if (this.touchId === event.touchId) {
            this.touchId = null;
            // 重置背景和手柄位置
            this.joystickBg.setPosition(this.startPosition.x , this.startPosition.y );
            this.joystickHandle.setPosition(this.startPosition.x , this.startPosition.y );
            this.direction.set(0, 0);
            this.sendEvent();
        }
    }

    private sendEvent() {
        const angle = this.getCompressedAngle();
        if (angle !== this.lastSentAngle) {
            this.lastSentAngle = angle;
            let direction = this.direction.clone()
            app.message.emit(Joystick.JOYSTICK_MOVE, angle);
        }
    }

    private getCompressedAngle(): number {
        if (this.direction.x === 0 && this.direction.y === 0) {
            return 255; // 特殊值表示中心位置
        }
        let angle = Math.atan2(this.direction.y, this.direction.x) * 180 / Math.PI;
        if (angle < 0) angle += 360;
        return Math.round(angle * 254 / 360);
    }
}
