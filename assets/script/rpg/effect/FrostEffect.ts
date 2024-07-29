import { Node, tween, Sprite, Material, resources, UIOpacity, Vec3, Quat } from 'cc';
import { BaseEffect } from './Effect';
import { Effect } from './__private';

@Effect('FrostEffect')
export class FrostEffect extends BaseEffect {
    private frostNode: Node | null = null;
    private frostSprite: Sprite | null = null;
    private frostMaterial: Material | null = null;
    private rotationSpeed: number = 90; // 每秒旋转90度

    async apply(target: Node, duration: number = 5): Promise<void> {
        // 创建冰霜效果节点
        this.frostNode = new Node('FrostEffect');
        target.addChild(this.frostNode);

        // 设置冰霜效果节点的大小和位置
        this.frostNode.setScale(new Vec3(1.2, 1.2, 1.2)); // 稍微比目标大一些
        this.frostNode.setPosition(Vec3.ZERO);

        // 添加Sprite组件
        this.frostSprite = this.frostNode.addComponent(Sprite);

        // 加载并应用冰霜材质
        this.frostMaterial = await this.loadMaterial('path/to/frost-material');
        if (this.frostMaterial && this.frostSprite) {
            this.frostSprite.customMaterial = this.frostMaterial;
        }

        // 添加UIOpacity组件并设置初始透明度
        const uiOpacity = this.frostNode.addComponent(UIOpacity);
        uiOpacity.opacity = 255;

        // 开始旋转动画
        this.startRotation();

        // 创建淡入淡出动画
        tween(uiOpacity)
            .to(0.5, { opacity: 255 }) // 淡入
            .delay(duration - 1)
            .to(0.5, { opacity: 0 }) // 淡出
            .call(() => {
                this.reset();
                this.complete();
            })
            .start();
    }

    private startRotation(): void {
        tween(this.frostNode)
            .by(1, { angle: this.rotationSpeed })
            .repeatForever()
            .start();
    }

    reset(): void {
        if (this.frostNode) {
            this.frostNode.destroy();
            this.frostNode = null;
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
