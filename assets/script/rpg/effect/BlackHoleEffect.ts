import { Node, tween, Vec3, quat, Quat } from 'cc';
import { BaseEffect } from './Effect';
import { Effect } from './__private';
import scheduler from '../../utils/scheduler';

@Effect('BlackHoleEffect')
export class BlackHoleEffect extends BaseEffect {
    private originalPositions: Map<Node, Vec3> = new Map();
    private originalScales: Map<Node, Vec3> = new Map();

    apply(targets: Node[], center: Vec3, duration: number = 3): void {
        // 保存每个目标的原始位置和缩放
        targets.forEach(target => {
            this.originalPositions.set(target, target.position.clone());
            this.originalScales.set(target, target.scale.clone());
        });

        // 创建吸引效果动画
        targets.forEach(target => {
            this.createSpiralAttractEffect(target, center, duration);
        });

        // 设置定时器以在效果结束时重置位置和缩放
        scheduler.scheduleOnce(() => {
            this.reset();
            this.complete();
        }, duration);
    }

    private createSpiralAttractEffect(target: Node, center: Vec3, duration: number): void {
        const originalPosition = target.position.clone();
        const distance = originalPosition.subtract(center).length();
        const direction = center.subtract(originalPosition).normalize();
        const rotationAxis = Vec3.cross(new Vec3(), direction, Vec3.UP).normalize();

        tween(target)
            .to(duration, {}, {
                onUpdate: (target: Node, ratio: number) => {
                    // 计算当前距离中心点的距离
                    const currentDistance = distance * (1 - ratio);
                    
                    // 计算螺旋角度（随时间增加）
                    const angle = ratio * Math.PI * 4; // 可以调整这个值来改变螺旋的紧密程度
                    
                    // 计算螺旋偏移
                    const spiralOffset = new Vec3(
                        Math.cos(angle) * currentDistance * 0.2,
                        Math.sin(angle) * currentDistance * 0.2,
                        0
                    );
                    
                    // 计算新位置
                    const newPosition = originalPosition.add(direction.multiplyScalar(distance - currentDistance));
                    newPosition.add(spiralOffset);
                    
                    // 设置新位置
                    target.setPosition(newPosition);
                    
                    // 添加旋转效果
                    const rotation = Quat.rotateAround(new Quat(), Quat.IDENTITY, rotationAxis, angle);
                    target.setRotation(rotation);
                    
                    // 添加缩放效果（越接近中心点越小）
                    const scale = 1 - ratio * 0.5; // 可以调整这个值来改变缩放程度
                    target.setScale(scale, scale, scale);
                }
            })
            .start();
    }

    reset(): void {
        // 重置每个目标的位置和缩放
        this.originalPositions.forEach((position, target) => {
            target.setPosition(position);
        });
        this.originalScales.forEach((scale, target) => {
            target.setScale(scale);
        });
        this.originalPositions.clear();
        this.originalScales.clear();
    }
}
