import { Node, tween, Sprite, Material, resources, UIOpacity, Vec3, Color } from 'cc';
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
    private timer:number = 0;

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
        this.originalMaterial = this.sprite.customMaterial;

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
            .to(0.5, { opacity: 50 }) // 快速变为半透明
            .delay(duration - 1)
            .to(0.5, { opacity: this.originalOpacity }) // 缓慢恢复可见
            .call(() => {
                this.reset();
                this.complete();
            })
            .start();

        // 设置材质的时间参数，用于着色器中的动画效果
        this.timer = scheduler.scheduleGlobal(() => {
            if (this.invisibilityMaterial) {
                this.invisibilityMaterial.setProperty('time', Date.now() / 1000);
            }
        }, 0.05);
    }

    reset(): void {
        if (this.sprite && this.originalMaterial && this.uiOpacity) {
            this.sprite.customMaterial = this.originalMaterial;
            this.uiOpacity.opacity = this.originalOpacity;
        }
        if(this.timer !=-1){
            scheduler.unscheduleGlobal(this.timer);
            this.timer = -1;
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
