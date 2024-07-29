import { Node, Color, tween, Sprite, Material, resources, Vec4 } from 'cc';
import { BaseEffect } from './Effect';
import { Effect } from './__private';
import scheduler from '../../utils/scheduler';

@Effect('GlowEffect')
export class GlowEffect extends BaseEffect {
    private originalMaterial: Material | null = null;
    private sprite: Sprite | null = null;
    private glowMaterial: Material | null = null;
    private glowTween: any = null;

    constructor() {
        super();
    }

    async apply(target: Node, color: Color, intensity: number = 1, duration: number = 1): Promise<void> {
        const sprite = target.getComponent(Sprite);
        if (!sprite) {
            console.error('Sprite component not found on target node');
            return;
        }
        this.sprite = sprite;

        // 保存原始材质
        if (!this.originalMaterial) {
            this.originalMaterial = sprite.customMaterial;
        }

        // 加载外发光材质
        this.glowMaterial = await this.loadMaterial('path/to/glow-material');
        if (!this.glowMaterial) {
            console.error('Failed to load glow material');
            return;
        }

        // 设置初始外发光颜色和强度
        const glowColorVec4 = new Vec4(color.r / 255, color.g / 255, color.b / 255, 0);
        this.glowMaterial.setProperty('glowColor', glowColorVec4);
        this.glowMaterial.setProperty('glowIntensity', 0);

        // 应用外发光材质
        sprite.customMaterial = this.glowMaterial;

        // 创建脉冲效果
        this.createPulseEffect(glowColorVec4, intensity, duration);

        // 设置定时器以结束效果
        scheduler.scheduleOnce(() => {
            this.reset();
            this.complete();
        }, duration);
    }

    private createPulseEffect(color: Vec4, maxIntensity: number, duration: number): void {
        const halfDuration = duration / 2;
        const pulseCount = Math.floor(duration / 0.5); // 每0.5秒一次脉冲

        this.glowTween = tween(this.glowMaterial)
            .repeat(pulseCount,
                tween()
                    .to(halfDuration / pulseCount, { glowIntensity: maxIntensity }, { easing: 'sineIn' })
                    .to(halfDuration / pulseCount, { glowIntensity: 0 }, { easing: 'sineOut' })
            )
            .start();
    }

    reset(): void {
        if (this.sprite && this.originalMaterial) {
            this.sprite.customMaterial = this.originalMaterial;
        }
        if (this.glowTween) {
            this.glowTween.stop();
            this.glowTween = null;
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
