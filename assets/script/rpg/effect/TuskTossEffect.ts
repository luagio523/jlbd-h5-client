import { Node, Vec3, tween, Tween, _decorator } from 'cc';
import { BaseEffect } from './Effect';
import { Effect } from './__private';

@Effect('TuskTossEffect')
export class TuskTossEffect extends BaseEffect {
    private originalPosition: Vec3 | null = null;
    private originalScale: Vec3 | null = null;
    private originalAngle: number = 0;
    private target: Node | null = null;

    apply(target: Node, startPos: Vec3, direction: Vec3, distance: number = 300, duration: number = 1): void {
        this.target = target;

        // 保存原始属性
        this.originalPosition = target.position.clone();
        this.originalScale = target.scale.clone();
        this.originalAngle = target.angle;

        // 设置起始位置
        target.setPosition(startPos);

        // 计算终点位置
        const endPos = startPos.add(direction.normalize().multiplyScalar(distance));

        // 创建抛物线路径
        const controlPoint = new Vec3(
            startPos.x + (endPos.x - startPos.x) / 2,
            startPos.y + 150, // 抛物线最高点
            startPos.z + (endPos.z - startPos.z) / 2
        );

        const totalFrames = duration * 60; // 假设每秒60帧
        let currentFrame = 0;

        // 创建抛物线动画
        tween(this)
            .to(duration, {}, {
                onUpdate: () => {
                    currentFrame++;
                    const t = currentFrame / totalFrames;
                    const x = (1 - t) * (1 - t) * startPos.x + 2 * (1 - t) * t * controlPoint.x + t * t * endPos.x;
                    const y = (1 - t) * (1 - t) * startPos.y + 2 * (1 - t) * t * controlPoint.y + t * t * endPos.y;
                    target.setPosition(new Vec3(x, y, startPos.z));
                }
            })
            .call(() => {
                this.reset();
                this.complete();
            })
            .start();

        // 创建旋转动画
        tween(target)
            .to(duration, { angle: this.originalAngle + 720 }) // 旋转两圈
            .start();

        // 创建缩放动画，模拟3D效果
        tween(target)
            .to(duration / 2, { scale: new Vec3(1.2, 1.2, 1.2) })
            .to(duration / 2, { scale: this.originalScale })
            .start();
    }

    reset(): void {
        if (this.target && this.originalPosition && this.originalScale) {
            this.target.setPosition(this.originalPosition);
            this.target.setScale(this.originalScale);
            this.target.angle = this.originalAngle;
        }
        this.target = null;
    }
}
