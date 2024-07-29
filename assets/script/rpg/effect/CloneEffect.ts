import { Node, tween, Sprite, Material, resources, Vec3, Color, UIOpacity } from 'cc';
import { BaseEffect } from './Effect';
import { Effect } from './__private';
import scheduler from '../../utils/scheduler';

@Effect('CloneEffect')
export class CloneEffect extends BaseEffect {
    private cloneNode: Node | null = null;
    private cloneSprite: Sprite | null = null;
    private cloneMaterial: Material | null = null;
    private cloneOpacity: UIOpacity | null = null;

    async apply(target: Node, duration: number = 5): Promise<void> {
        // 创建分身节点
        this.cloneNode = new Node('Clone');
        target.parent.addChild(this.cloneNode);

        // 设置分身的初始位置、缩放和旋转
        this.cloneNode.setPosition(target.position.clone());
        this.cloneNode.setScale(target.scale.clone());
        this.cloneNode.setRotation(target.rotation.clone());

        // 添加Sprite组件
        this.cloneSprite = this.cloneNode.addComponent(Sprite);
        const targetSprite = target.getComponent(Sprite);
        if (targetSprite) {
            this.cloneSprite.spriteFrame = targetSprite.spriteFrame;
        }

        // 添加UIOpacity组件
        this.cloneOpacity = this.cloneNode.addComponent(UIOpacity);
        this.cloneOpacity.opacity = 0; // 初始设置为完全透明

        // 加载并应用分身材质
        this.cloneMaterial = await this.loadMaterial('path/to/clone-material');
        if (this.cloneMaterial && this.cloneSprite) {
            this.cloneSprite.customMaterial = this.cloneMaterial;
        }

        // 创建分身效果动画
        this.createCloneEffect(duration);

        // 设置定时器以结束效果
        scheduler.scheduleOnce(() => {
            this.reset();
            this.complete();
        }, duration);
    }

    private createCloneEffect(duration: number): void {
        const fadeDuration = 0.5; // 淡入淡出时间

        if (this.cloneOpacity) {
            // 淡入效果
            tween(this.cloneOpacity)
                .to(fadeDuration, { opacity: 255 })
                .start();

            // 淡出效果
            tween(this.cloneOpacity)
                .delay(duration - fadeDuration)
                .to(fadeDuration, { opacity: 0 })
                .start();
        }
    }

    reset(): void {
        if (this.cloneNode) {
            this.cloneNode.destroy();
            this.cloneNode = null;
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
