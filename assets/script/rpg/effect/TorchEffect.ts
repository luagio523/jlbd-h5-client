import { _decorator, Component, Node, Sprite, Material, resources, Vec3, UIOpacity, tween, ParticleSystem, SpriteFrame } from 'cc';
import { BaseEffect } from './Effect'; // 确保引入 BaseEffect
import { Effect } from './__private';

const { ccclass, property } = _decorator;

@Effect('TorchEffect')
export class TorchEffect extends BaseEffect {
    private torchNode: Node | null = null; // 火把效果节点
    private torchSprite: Sprite | null = null; // 火把精灵
    private torchMaterial: Material | null = null; // 火把材质
    private flameSystem: ParticleSystem | null = null; // 火焰粒子系统

    /**
     * 应用火把效果
     * @param target 目标节点（火把所在的节点）
     * @param spritePath 火把精灵的资源路径
     * @param lightColor 光的颜色
     * @param lightRadius 光的范围
     * @param lightHeight 光源高度,适用于2D场景
     */
    public async apply(target: Node, spritePath: string, lightColor: Vec3, lightRadius: number, lightHeight: number = 2): Promise<void> {
        // 创建火把效果节点
        this.torchNode = new Node('TorchEffect');
        target.addChild(this.torchNode);
        this.torchNode.setPosition(new Vec3(0, lightHeight, 0)); // 设置位置为目标节点的高度

        // 添加精灵组件
        this.torchSprite = this.torchNode.addComponent(Sprite);
        
        // 加载并设置火把精灵
        const spriteFrame = await this.loadSpriteFrame(spritePath);
        if (this.torchSprite && spriteFrame) {
            this.torchSprite.spriteFrame = spriteFrame;
        }

        // 创建材质并应用 Shader
        this.torchMaterial = new Material();
        await resources.load('torch-effect', Material, (err, material) => {
            if (!err) {
                this.torchMaterial = material;
                this.torchSprite.setSharedMaterial(0, this.torchMaterial); // 使用 setSharedMaterial
            }
        });

        // 设置光源参数
        this.torchMaterial.setProperty('lightPosition', this.torchNode.position);
        this.torchMaterial.setProperty('lightColor', lightColor); // 设置光的颜色
        this.torchMaterial.setProperty('lightRadius', lightRadius); // 设置光的范围

        // 创建并配置粒子系统
        this.flameSystem = this.torchNode.addComponent(ParticleSystem);
        this.flameSystem.play(); // 启动粒子系统

        // 添加UIOpacity组件并设置初始透明度
        const uiOpacity = this.torchNode.addComponent(UIOpacity);
        uiOpacity.opacity = 255;

        // 创建淡入淡出动画
        tween(uiOpacity)
            .to(0.5, { opacity: 255 }) // 淡入
            .delay(1) // 持续一段时间
            .to(0.5, { opacity: 0 }) // 淡出
            .call(() => {
                this.reset();
                this.complete();
            })
            .start();
    }

    /**
     * 加载精灵帧
     * @param path 精灵帧的路径
     */
    private loadSpriteFrame(path: string): Promise<SpriteFrame> {
        return new Promise((resolve, reject) => {
            resources.load(path, SpriteFrame, (err, spriteFrame) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(spriteFrame);
                }
            });
        });
    }

    /**
     * 更新火把的位置
     * @param target 目标节点（角色）
     * @param lightHeight 光源高度,适用于2D场景
     */
    public updatePosition(target: Node, lightHeight: number): void {
        if (this.torchNode) {
            // 更新火把效果节点的位置，使其跟随目标节点
            this.torchNode.setPosition(target.position.add(new Vec3(0, lightHeight, 0)));
            // 更新光源位置
            this.torchMaterial.setProperty('lightPosition', this.torchNode.position);
        }
    }

    /**
     * 重置效果
     */
    public reset(): void {
        if (this.torchNode) {
            this.torchNode.destroy(); // 销毁火把效果节点
            this.torchNode = null; // 清空引用
        }
    }

    /**
     * 完成效果
     */
    public complete(): void {
        this.reset(); // 重置效果
        super.complete(); // 调用基类的 complete 方法
    }
}
