import { Node, tween, Sprite, Material, resources, UIOpacity, Color } from 'cc';
import { BaseEffect } from './Effect';
import { Effect } from './__private';

@Effect('BorrowedTimeEffect')
export class BorrowedTimeEffect extends BaseEffect {
    private originalMaterial: Material | null = null;
    private originalOpacity: number = 255;
    private sprite: Sprite | null = null;
    private uiOpacity: UIOpacity | null = null;
    private borrowedTimeMaterial: Material | null = null;

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

        // 加载回光返照材质
        this.borrowedTimeMaterial = await this.loadMaterial('path/to/borrowed-time-material');
        if (!this.borrowedTimeMaterial) {
            console.error('Failed to load borrowed time material');
            return;
        }

        // 应用回光返照材质
        this.sprite.customMaterial = this.borrowedTimeMaterial;

        // 创建回光返照动画
        tween(this.uiOpacity)
            .to(0.5, { opacity: 180 }) // 降低透明度到70%
            .to(duration - 1, { opacity: 180 })
            .to(0.5, { opacity: this.originalOpacity }) // 恢复透明度
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





// import { BorrowedTimeEffect } from './BorrowedTimeEffect';
// import { Node, Component, _decorator } from 'cc';

// const { ccclass, property } = _decorator;

// @ccclass('GameController')
// export class GameController extends Component {
//     private borrowedTimeEffect: BorrowedTimeEffect;

//     start() {
//         this.borrowedTimeEffect = new BorrowedTimeEffect();
//     }

//     triggerBorrowedTime(target: Node) {
//         const duration = 5; // 持续时间5秒
//         this.borrowedTimeEffect.apply(target, duration);
//     }

//     update(dt: number) {
//         if (this.borrowedTimeEffect) {
//             this.borrowedTimeEffect.update(dt);
//         }
//     }

//     onDestroy() {
//         if (this.borrowedTimeEffect) {
//             this.borrowedTimeEffect.complete();
//             this.borrowedTimeEffect = null;
//         }
//     }
// }
