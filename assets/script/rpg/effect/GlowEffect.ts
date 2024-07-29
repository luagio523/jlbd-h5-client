import { Node, tween, Sprite, Material, resources, UIOpacity, Color } from 'cc';
import { BaseEffect } from './Effect';
import { Effect } from './__private';

@Effect('GlowEffect')
export class GlowEffect extends BaseEffect {
    private originalMaterial: Material | null = null;
    private originalOpacity: number = 255;
    private sprite: Sprite | null = null;
    private uiOpacity: UIOpacity | null = null;
    private glowMaterial: Material | null = null;

    async apply(target: Node, color: Color = Color.WHITE, intensity: number = 1, duration: number = 3): Promise<void> {
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

        // 加载发光材质
        this.glowMaterial = await this.loadMaterial('path/to/glow-material');
        if (!this.glowMaterial) {
            console.error('Failed to load glow material');
            return;
        }

        // 设置发光材质的颜色和强度
        this.glowMaterial.setProperty('glowColor', color);
        this.glowMaterial.setProperty('glowIntensity', intensity);

        // 应用发光材质
        this.sprite.customMaterial = this.glowMaterial;

        // 创建闪烁效果
        this.createFlashingEffect(duration);
    }

    private createFlashingEffect(duration: number): void {
        const flashDuration = 0.5; // 每次闪烁的持续时间
        const flashCount = Math.floor(duration / flashDuration);

        tween(this.uiOpacity)
            .repeat(flashCount,
                tween()
                    .to(flashDuration / 2, { opacity: 255 })
                    .to(flashDuration / 2, { opacity: 100 })
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
