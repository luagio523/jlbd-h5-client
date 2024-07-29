import { Node, Sprite, Material, resources, tween, Vec3, Color, UITransform, Tween } from 'cc';
import { BaseEffect } from './Effect';
import { Effect } from './__private';
import scheduler from '../../utils/scheduler';

@Effect('SilenceEffect')
export class SilenceEffect extends BaseEffect {
    private silenceIconNode: Node | null = null;
    private originalColor: Color | null = null;
    private target: Node | null = null;

    async apply(target: Node, duration: number = 5): Promise<void> {
        this.target = target;

        // 保存原始颜色
        const sprite = target.getComponent(Sprite);
        if (sprite) {
            this.originalColor = sprite.color.clone();
        }

        // 创建沉默图标
        await this.createSilenceIcon(target);

        // 应用视觉效果
        this.applyVisualEffect(target);

        // 设置定时器以结束效果
        scheduler.scheduleOnce(() => {
            this.reset();
            this.complete();
        }, duration);
    }

    private async createSilenceIcon(target: Node): Promise<void> {
        // 创建一个新的节点作为沉默图标
        this.silenceIconNode = new Node('SilenceIcon');
        target.addChild(this.silenceIconNode);

        const uiTransform = target.getComponent(UITransform);
        const targetHeight = uiTransform ? uiTransform.height : 50; // 默认高度为50

        this.silenceIconNode.setPosition(0, targetHeight + 20, 0);

        const sprite = this.silenceIconNode.addComponent(Sprite);
        
        // 加载沉默图标材质
        const silenceMaterial = await this.loadMaterial('path/to/silence-icon-material');
        if (silenceMaterial && sprite) {
            sprite.customMaterial = silenceMaterial;
        }

        // 添加图标动画
        tween(this.silenceIconNode)
            .repeatForever(
                tween()
                    .to(0.5, { position: new Vec3(0, targetHeight + 30, 0) })
                    .to(0.5, { position: new Vec3(0, targetHeight + 20, 0) })
            )
            .start();
    }

    private applyVisualEffect(target: Node): void {
        const sprite = target.getComponent(Sprite);
        if (sprite) {
            // 将目标颜色变为灰色
            sprite.color = new Color(150, 150, 150);

            // 添加闪烁效果
            tween(sprite)
                .repeatForever(
                    tween()
                        .to(0.5, { color: new Color(150, 150, 150, 200) })
                        .to(0.5, { color: new Color(150, 150, 150, 255) })
                )
                .start();
        }
    }

    reset(): void {
        if (this.silenceIconNode) {
            this.silenceIconNode.removeFromParent();
            this.silenceIconNode.destroy();
            this.silenceIconNode = null;
        }

        if (this.target) {
            const sprite = this.target.getComponent(Sprite);
            if (sprite && this.originalColor) {
                sprite.color = this.originalColor;
            }
            // 停止所有 Tween 动画
            Tween.stopAllByTarget(this.target);
        }

        this.target = null;
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
