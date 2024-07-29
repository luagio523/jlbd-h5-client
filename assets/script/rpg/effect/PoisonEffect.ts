import { Node, tween, Sprite, Material, resources, UIOpacity, Color } from 'cc';
import { BaseEffect } from './Effect';
import { Effect } from './__private';

@Effect('PoisonEffect')
export class PoisonEffect extends BaseEffect {
    private originalMaterial: Material | null = null;
    private originalOpacity: number = 255;
    private sprite: Sprite | null = null;
    private uiOpacity: UIOpacity | null = null;
    private poisonMaterial: Material | null = null;

    async apply(target: Node, color: Color = new Color(0, 255, 0, 255), intensity: number = 1, duration: number = 5): Promise<void> {
        this.sprite = target.getComponent(Sprite);
        if (!this.sprite) {
            console.error('Sprite component not found on target node');
            return;
        }

        // 获取或添加 UIOpacity 组件
        this.uiOpacity = target.getComponent(UIOpacity);
        if (!this.uiOpacity) {
            this.uiOpacity = target.addComponent(UIOpacity);
        }

        // 保存原始不透明度和材质
        this.originalOpacity = this.uiOpacity.opacity;
        this.originalMaterial = this.sprite.customMaterial;

        // 加载中毒材质
        this.poisonMaterial = await this.loadMaterial('path/to/poison-material');
        if (!this.poisonMaterial) {
            console.error('Failed to load poison material');
            return;
        }

        // 设置中毒材质的颜色和强度
        this.poisonMaterial.setProperty('poisonColor', color);
        this.poisonMaterial.setProperty('poisonIntensity', intensity);

        // 应用中毒材质
        this.sprite.customMaterial = this.poisonMaterial;

        // 创建中毒效果动画
        this.createPoisonEffect(duration);
    }

    private createPoisonEffect(duration: number): void {
        const pulseDuration = 1; // 每次脉动的持续时间
        const pulseCount = Math.floor(duration / pulseDuration);

        tween(this.uiOpacity)
            .repeat(pulseCount,
                tween()
                    .to(pulseDuration / 2, { opacity: 200 })
                    .to(pulseDuration / 2, { opacity: 255 })
            )
            .call(() => {
                this.reset();
                this.complete();
            })
            .start();
    }

    reset(): void {
        if (this.sprite && this.originalMaterial && this.uiOpacity) {
            this.sprite.customMaterial = this.originalMaterial;
            this.uiOpacity.opacity = this.originalOpacity;
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
