import { Node, tween, Vec3, Sprite, Material, resources, UITransform, Tween } from 'cc';
import { BaseEffect } from './Effect';
import { Effect } from './__private';
import scheduler from '../../utils/scheduler';

@Effect('StunEffect')
export class StunEffect extends BaseEffect {
    private originalPosition: Vec3 | null = null;
    private originalRotation: number = 0;
    private stunSprite: Sprite | null = null;
    private stunMaterial: Material | null = null;
    private shakeTween: Tween<Node> | null = null;
    private spinTween: Tween<Node> | null = null;
    private target:Node|null = null;

    async apply(target: Node, duration: number = 2): Promise<void> {
        // 保存原始位置和旋转
        this.originalPosition = target.position.clone();
        this.originalRotation = target.angle;

        this.target = target;
        // 创建眩晕图标
        await this.createStunIcon(target);

        // 创建晃动效果
        this.createShakeEffect(target, duration);

        // 创建旋转效果
        this.createSpinEffect(target, duration);

        // 设置定时器以结束效果
        scheduler.scheduleOnce(() => {
            this.reset();
            this.complete();
        }, duration);
    }

    private async createStunIcon(target: Node): Promise<void> {
        // 创建一个新的节点作为眩晕图标
        const stunNode = new Node('StunIcon');
        target.addChild(stunNode);
        
        const targetUITransform = target.getComponent(UITransform);
        if (targetUITransform) {
            stunNode.setPosition(0, targetUITransform.height + 20, 0);
        } else {
            stunNode.setPosition(0, 50, 0); // 默认高度
        }

        this.stunSprite = stunNode.addComponent(Sprite);
        
        // 加载眩晕图标材质
        this.stunMaterial = await this.loadMaterial('path/to/stun-material');
        if (this.stunMaterial && this.stunSprite) {
            this.stunSprite.customMaterial = this.stunMaterial;
        }
    }

    private createShakeEffect(target: Node, duration: number): void {
        const shakeStrength = 5;
        const shakeSpeed = 0.05;

        this.shakeTween = tween(target)
            .repeatForever(
                tween()
                    .to(shakeSpeed, { position: new Vec3(this.originalPosition.x + shakeStrength, this.originalPosition.y, this.originalPosition.z) })
                    .to(shakeSpeed, { position: new Vec3(this.originalPosition.x - shakeStrength, this.originalPosition.y, this.originalPosition.z) })
            )
            .start();
    }

    private createSpinEffect(target: Node, duration: number): void {
        this.spinTween = tween(target)
            .to(duration, { angle: 360 }, { easing: 'sineInOut' })
            .start();
    }

    reset(): void {
        let target = this.target;
        // 重置位置和旋转
        if (this.originalPosition) {
            target.setPosition(this.originalPosition);
        }
        target.angle = this.originalRotation;

        // 移除眩晕图标
        if (this.stunSprite) {
            this.stunSprite.node.removeFromParent();
            this.stunSprite.destroy();
        }

        // 停止所有动作
        if (this.shakeTween) {
            this.shakeTween.stop();
        }
        if (this.spinTween) {
            this.spinTween.stop();
        }
    }

    private loadMaterial(path: string): Promise<Material> {
        return new Promise((resolve, reject) => {
            resources.load(path, Material, (err, material) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(material);
                }
            });
        });
    }
}
