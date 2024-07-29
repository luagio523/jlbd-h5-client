import { Node, Color, tween, Sprite, Material, resources, UIOpacity } from 'cc';
import { BaseEffect } from './Effect';
import { Effect } from './__private';
import scheduler from '../../utils/scheduler';


@Effect('InvisibilityEffect')
export class InvisibilityEffect extends BaseEffect {
    private originalMaterial: Material | null = null;
    private originalOpacity: number = 255;
    private sprite: Sprite | null = null;
    private uiOpacity: UIOpacity | null = null;
    private invisibilityMaterial: Material | null = null;

    async apply(target: Node, duration: number = 5): Promise<void> {
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
        if (!this.originalMaterial) {
            this.originalMaterial = this.sprite.customMaterial;
        }

        // 加载隐身材质
        this.invisibilityMaterial = await this.loadMaterial('path/to/invisibility-material');
        if (!this.invisibilityMaterial) {
            console.error('Failed to load invisibility material');
            return;
        }

        // 应用隐身材质
        this.sprite.customMaterial = this.invisibilityMaterial;

        // 创建隐身动画
        tween(this.uiOpacity)
            .to(0.5, { opacity: 50 }) // 降低透明度到20%
            .call(() => {
                // 保持隐身状态
                scheduler.scheduleOnce(() => {
                    this.fadeOut(duration - 0.5);
                }, duration - 1);
            })
            .start();
    }

    private fadeOut(duration: number): void {
        tween(this.uiOpacity)
            .to(duration, { opacity: this.originalOpacity })
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
