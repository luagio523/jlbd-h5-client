import { Component, Node, Vec3, _decorator, Camera, EventTarget, Size, Rect, misc, Tween, tween } from 'cc';
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
    private eventTarget = new EventTarget();
    private mapSize: Size = new Size(0, 0);
    private viewportSize: Size = new Size(0, 0);
    private boundaryArea: Rect | null = null;
    private halfDeadZoneWidth: number = 0;
    private halfDeadZoneHeight: number = 0;
    private lastCameraPosition: Vec3 = new Vec3();
    private tempVec3: Vec3 = new Vec3();
    private frameCount: number = 0;

    start() {
        this.camera = this.getComponent(Camera);
        if (!this.camera) {
            console.error("Camera component not found on this node.");
            return;
        }

        if (this.target) {
            this.lastTargetPosition.set(this.target.worldPosition);
        }

        this.halfDeadZoneWidth = this.deadZoneWidth * 0.5;
        this.halfDeadZoneHeight = this.deadZoneHeight * 0.5;
        this.lastCameraPosition.set(this.node.worldPosition);
    }

    public setMapSize(width: number, height: number): void {
        this.mapSize.width = width;
        this.mapSize.height = height;
        this.updateBoundaryFromSizes();
    }

    public setViewportSize(width: number, height: number): void {
        this.viewportSize.width = width;
        this.viewportSize.height = height;
        this.updateBoundaryFromSizes();
    }

    public setBoundaryArea(boundaryArea: Rect): void {
        this.boundaryArea = boundaryArea;
    }

    private updateBoundaryFromSizes(): void {
        if (!this.boundaryArea && this.mapSize.width > 0 && this.mapSize.height > 0 && this.viewportSize.width > 0 && this.viewportSize.height > 0) {
            const halfViewportWidth = this.viewportSize.width * 0.5;
            const halfViewportHeight = this.viewportSize.height * 0.5;
            this.boundaryArea = new Rect(
                halfViewportWidth,
                halfViewportHeight,
                this.mapSize.width - this.viewportSize.width,
                this.mapSize.height - this.viewportSize.height
            );
        }
    }

    public setTargetPosition(position: Vec3): void {
        if (this.target) {
            this.target.setWorldPosition(position);
        }
    }

    lateUpdate(dt: number) {
        if (!this.target || !this.camera || !this.boundaryArea) return;

        this.frameCount++;
        if (this.frameCount % 2 !== 0) return; // 每两帧更新一次

        const targetPosition = this.target.worldPosition;
        const cameraPosition = this.node.worldPosition;

        // 计算目标移动的距离
        const deltaX = targetPosition.x - this.lastTargetPosition.x;
        const deltaY = targetPosition.y - this.lastTargetPosition.y;

        // 更新上一帧的目标位置
        this.lastTargetPosition.set(targetPosition);

        // 检查是否超出死区
        if (Math.abs(deltaX) > this.halfDeadZoneWidth || Math.abs(deltaY) > this.halfDeadZoneHeight) {
            // 计算新的目标相机位置
            let targetX = cameraPosition.x + deltaX;
            let targetY = cameraPosition.y + deltaY;

            // 限制相机位置在边界区域内
            targetX = misc.clampf(targetX, this.boundaryArea.xMin, this.boundaryArea.xMax);
            targetY = misc.clampf(targetY, this.boundaryArea.yMin, this.boundaryArea.yMax);

            // 使用 SmoothDamp 进行平滑移动
            const newX = this.smoothDamp(cameraPosition.x, targetX, this.velocity.x, this.smoothTime, dt);
            const newY = this.smoothDamp(cameraPosition.y, targetY, this.velocity.y, this.smoothTime, dt);

            // 更新相机位置
            this.tempVec3.set(newX, newY, cameraPosition.z);
            this.node.setWorldPosition(this.tempVec3);

            // 只在相机实际移动时触发事件
            if (!this.lastCameraPosition.equals(this.tempVec3)) {
                this.eventTarget.emit('camera-moved', this.tempVec3);
                this.lastCameraPosition.set(this.tempVec3);
            }
        }

        // 在更新相机位置后应用震动偏移
        if (!this.shakeOffset.equals(Vec3.ZERO)) {
            this.node.position = this.node.position.add(this.shakeOffset);
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
        change = misc.clampf(change, -maxChange, maxChange);
        target = current - change;
        const temp = (currentVelocity + omega * change) * dt;
        currentVelocity = (currentVelocity - omega * temp) * exp;
        let output = target + (change + temp) * exp;
        if ((originalTo - current > 0) === (output > originalTo)) {
            output = originalTo;
            currentVelocity = (output - originalTo) / dt;
        }
        return output;
    }

    public onCameraMoved(callback: (position: Vec3) => void): void {
        this.eventTarget.on('camera-moved', callback);
    }

    public offCameraMoved(callback: (position: Vec3) => void): void {
        this.eventTarget.off('camera-moved', callback);
    }


    //*********************************************基于相机的一些效果******************************************************** */

    private shakeOffset: Vec3 = new Vec3();
    private shakeTween: Tween<Vec3> | null = null;

    public shake(duration: number, intensity: number): void {
        if (this.shakeTween) {
            this.shakeTween.stop();
        }

        this.shakeOffset.set(Vec3.ZERO);
        this.shakeTween = tween(this.shakeOffset)
            .to(duration, new Vec3(intensity, intensity, 0), {
                onUpdate: (target: Vec3) => {
                    const randomOffset = new Vec3(
                        (Math.random() - 0.5) * 2 * target.x,
                        (Math.random() - 0.5) * 2 * target.y,
                        0
                    );
                    this.node.position = this.node.position.add(randomOffset);
                }
            })
            .call(() => {
                this.shakeOffset.set(Vec3.ZERO);
                this.shakeTween = null;
            })
            .start();
    }
}
