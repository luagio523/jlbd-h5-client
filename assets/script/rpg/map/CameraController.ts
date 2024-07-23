import { Component, Node, Vec3, _decorator, Camera } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraController')
export class CameraController extends Component {
    @property(Node)
    target: Node | null = null;

    @property
    smoothTime: number = 0.3;

    @property
    deadZoneWidth: number = 100;

    @property
    deadZoneHeight: number = 100;

    private camera: Camera | null = null;
    private velocity: Vec3 = new Vec3();
    private lastTargetPosition: Vec3 = new Vec3();

    start() {
        this.camera = this.getComponent(Camera);
        if (!this.camera) {
            console.error("Camera component not found on this node.");
            return;
        }

        if (this.target) {
            this.lastTargetPosition.set(this.target.worldPosition);
        }
    }

    public setTargetPosition(position: Vec3): void {
        if (this.target) {
            this.target.setWorldPosition(position);
        }
    }

    lateUpdate(dt: number) {
        if (!this.target || !this.camera) return;

        const targetPosition = this.target.worldPosition;
        const cameraPosition = this.node.worldPosition;

        // 计算目标移动的距离
        const deltaX = targetPosition.x - this.lastTargetPosition.x;
        const deltaY = targetPosition.y - this.lastTargetPosition.y;

        // 更新上一帧的目标位置
        this.lastTargetPosition.set(targetPosition);

        // 检查是否超出死区
        if (Math.abs(deltaX) > this.deadZoneWidth / 2 || Math.abs(deltaY) > this.deadZoneHeight / 2) {
            // 计算新的目标相机位置
            const targetX = cameraPosition.x + deltaX;
            const targetY = cameraPosition.y + deltaY;

            // 使用 SmoothDamp 进行平滑移动
            const newX = this.smoothDamp(cameraPosition.x, targetX, this.velocity.x, this.smoothTime, dt);
            const newY = this.smoothDamp(cameraPosition.y, targetY, this.velocity.y, this.smoothTime, dt);

            // 更新相机位置
            this.node.setWorldPosition(newX, newY, cameraPosition.z);
        }
    }

    private smoothDamp(current: number, target: number, currentVelocity: number, smoothTime: number, dt: number): number {
        smoothTime = Math.max(0.0001, smoothTime);
        const omega = 2 / smoothTime;

        const x = omega * dt;
        const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
        let change = current - target;
        const originalTo = target;

        const maxChange = Number.MAX_VALUE * smoothTime;
        change = Math.min(Math.max(change, -maxChange), maxChange);
        target = current - change;

        const temp = (this.velocity.x + omega * change) * dt;
        this.velocity.x = (this.velocity.x - omega * temp) * exp;
        let output = target + (change + temp) * exp;

        if (originalTo - current > 0 === output > originalTo) {
            output = originalTo;
            this.velocity.x = (output - originalTo) / dt;
        }

        return output;
    }
}
