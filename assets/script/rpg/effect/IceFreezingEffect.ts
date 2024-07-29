import { Node, tween, Sprite, Material, resources, UIOpacity, Vec3, Color } from 'cc';
import { BaseEffect } from './Effect';
import { Effect } from './__private';

@Effect('IceFreezingEffect')
export class IceFreezingEffect extends BaseEffect {
    private iceNode: Node | null = null;
    private iceSprite: Sprite | null = null;
    private iceMaterial: Material | null = null;

    async apply(target: Node, duration: number = 3): Promise<void> {
        // 创建冰冻效果节点
        this.iceNode = new Node('IceFreezingEffect');
        target.addChild(this.iceNode);

        // 设置冰冻效果节点的大小和位置
        this.iceNode.setScale(new Vec3(1.1, 1.1, 1.1)); // 稍微比目标大一些
        this.iceNode.setPosition(Vec3.ZERO);

        // 添加Sprite组件
        this.iceSprite = this.iceNode.addComponent(Sprite);

        // 加载并应用冰冻材质
        this.iceMaterial = await this.loadMaterial('path/to/ice-freezing-material');
        if (this.iceMaterial && this.iceSprite) {
            this.iceSprite.customMaterial = this.iceMaterial;
        }

        // 添加UIOpacity组件并设置初始透明度
        const uiOpacity = this.iceNode.addComponent(UIOpacity);
        uiOpacity.opacity = 0;

        // 创建冰冻效果动画
        tween(uiOpacity)
            .to(0.5, { opacity: 255 }) // 快速冰冻
            .call(() => {
                // 冰冻完成后，可以在这里添加额外的效果，比如停止目标的动作
                if (this.iceMaterial) {
                    this.iceMaterial.setProperty('freezeIntensity', 1);
                }
            })
            .delay(duration - 1)
            .to(0.5, { opacity: 0 }) // 缓慢解冻
            .call(() => {
                this.reset();
                this.complete();
            })
            .start();
    }

    reset(): void {
        if (this.iceNode) {
            this.iceNode.destroy();
            this.iceNode = null;
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
