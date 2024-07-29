import { Node, Sprite, Material, resources, tween } from 'cc';
import { BaseEffect } from './Effect';
import { Effect } from './__private';

@Effect('PetrifyEffect')
export class PetrifyEffect extends BaseEffect {
    private originalMaterial: Material | null = null;
    private sprite: Sprite | null = null;
    private petrifyMaterial: Material | null = null;

    async apply(target: Node, duration: number = 3): Promise<void> {
        this.sprite = target.getComponent(Sprite);
        if (!this.sprite) {
            console.error('Sprite component not found on target node');
            return;
        }

        // 保存原始材质
        this.originalMaterial = this.sprite.customMaterial;

        // 加载石化材质
        this.petrifyMaterial = await this.loadMaterial('path/to/petrify-material');
        if (!this.petrifyMaterial) {
            console.error('Failed to load petrify material');
            return;
        }

        // 应用石化材质
        this.sprite.customMaterial = this.petrifyMaterial;

        // 创建石化效果动画
        this.createPetrifyEffect(duration);
    }

    private createPetrifyEffect(duration: number): void {
        let progress = 0;

        tween()
            .to(duration, {}, {
                onUpdate: (target: any, ratio: number) => {
                    progress = ratio;
                    if (this.petrifyMaterial) {
                        this.petrifyMaterial.setProperty('petrifyProgress', progress);
                    }
                }
            })
            .call(() => {
                this.reset();
                this.complete();
            })
            .start();
    }

    reset(): void {
        if (this.sprite && this.originalMaterial) {
            this.sprite.customMaterial = this.originalMaterial;
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
