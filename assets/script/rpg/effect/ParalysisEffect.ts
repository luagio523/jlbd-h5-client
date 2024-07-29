import { Node, Sprite, Material, resources, tween, Vec3, Color, UITransform, _decorator } from 'cc';
import { Effect } from './__private';

const { ccclass, property } = _decorator;

@Effect('ParalysisEffect')
export class ParalysisEffect extends BaseEffect {
    private paralysisEffectNode: Node | null = null;
    private originalColor: Color | null = null;
    private target: Node | null = null;

    async apply(target: Node, duration: number = 5): Promise<void> {
        this.target = target;

        // 保存原始颜色
        const sprite = target.getComponent(Sprite);
        if (sprite) {
            this.originalColor = sprite.color.clone();
        }

        // 创建麻痹视觉效果
        await this.createParalysisEffect(target);

        // 应用视觉效果
        this.applyVisualEffect(target);

        // 设置定时器以结束效果
        this.scheduleOnce(() => {
            this.reset();
            this.complete();
        }, duration);
    }

    private async createParalysisEffect(target: Node): Promise<void> {
        // 创建一个新的节点作为麻痹效果
        this.paralysisEffectNode = new Node('ParalysisEffect');
        target.addChild(this.paralysisEffectNode);

        const uiTransform = target.getComponent(UITransform);
        if (uiTransform) {
            this.paralysisEffectNode.setPosition(0, uiTransform.height / 2, 0);
        }

        const sprite = this.paralysisEffectNode.addComponent(Sprite);
        // 加载麻痹效果纹理
        const paralysisMaterial = await this.loadMaterial('path/to/paralysis-material');
        if (paralysisMaterial && sprite) {
            sprite.customMaterial = paralysisMaterial;
        }

        // 添加闪烁动画
        tween(sprite)
            .repeatForever(
                tween()
                    .to(0.5, { color: new Color(255, 255, 0, 150) })
                    .to(0.5, { color: new Color(255, 255, 0, 255) })
            )
            .start();
    }

    private applyVisualEffect(target: Node): void {
        const sprite = target.getComponent(Sprite);
        if (sprite) {
            // 将目标颜色变为黄色
            sprite.color = new Color(255, 255, 0);
        }
    }

    reset(): void {
        if (this.paralysisEffectNode) {
            this.paralysisEffectNode.removeFromParent();
            this.paralysisEffectNode.destroy();
            this.paralysisEffectNode = null;
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
