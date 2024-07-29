
import { Node, Vec3, tween, Sprite, Material, resources, UIOpacity, Color, UITransform } from 'cc';
import { BaseEffect } from './Effect';
import { Effect } from './__private';
import scheduler from '../../utils/scheduler';

@Effect('AstralSpiritEffect')
export class AstralSpiritEffect extends BaseEffect {
    private spiritNode: Node | null = null;
    private spiritSprite: Sprite | null = null;
    private spiritMaterial: Material | null = null;

    async apply(caster: Node, direction: Vec3, duration: number = 8): Promise<void> {
        // 创建灵体节点
        this.spiritNode = new Node('AstralSpirit');
        caster.parent.addChild(this.spiritNode);

        // 设置灵体初始位置
        this.spiritNode.setPosition(caster.position);

        // 添加UITransform组件并设置大小
        const uiTransform = this.spiritNode.addComponent(UITransform);
        uiTransform.setContentSize(100, 100); // 设置适当的大小

        // 添加Sprite组件
        this.spiritSprite = this.spiritNode.addComponent(Sprite);

        // 加载并应用灵体材质
        this.spiritMaterial = await this.loadAstralSpiritMaterial();
        if (this.spiritMaterial && this.spiritSprite) {
            this.spiritSprite.customMaterial = this.spiritMaterial;
        }

        // 添加UIOpacity组件并设置半透明
        const uiOpacity = this.spiritNode.addComponent(UIOpacity);
        uiOpacity.opacity = 180; // 约70%透明度

        // 创建灵体移动动画
        const distance = 1000; // 移动距离
        const moveTime = 4; // 移动时间
        tween(this.spiritNode)
            .to(moveTime, { position: caster.position.add(direction.normalize().multiplyScalar(distance)) })
            .to(moveTime, { position: caster.position })
            .call(() => {
                this.reset();
                this.complete();
            })
            .start();

        // 添加脉动效果
        this.addPulseEffect();

        // 设置定时器以结束效果
        scheduler.scheduleOnce(() => {
            this.reset();
            this.complete();
        }, duration);
    }

    private addPulseEffect(): void {
        if (!this.spiritNode) return;

        const originalScale = this.spiritNode.scale;
        tween(this.spiritNode)
            .repeatForever(
                tween()
                    .to(0.5, { scale: originalScale.multiplyScalar(1.2) })
                    .to(0.5, { scale: originalScale })
            )
            .start();
    }

    reset(): void {
        if (this.spiritNode) {
            this.spiritNode.destroy();
            this.spiritNode = null;
        }
    }

    private async loadAstralSpiritMaterial(): Promise<Material> {
        return new Promise((resolve, reject) => {
            resources.load('materials/astral-spirit-material', Material, (err, material) => {
                if (err) {
                    console.error('Failed to load astral spirit material:', err);
                    reject(err);
                } else {
                    // 设置材质属性
                    material.setProperty('mainColor', new Color(255, 255, 255, 180));
                    material.setProperty('glowColor', new Color(0, 128, 255, 255));
                    material.setProperty('glowIntensity', 0.5);
                    material.setProperty('waveSpeed', 2.0);
                    material.setProperty('waveAmplitude', 0.1);
                    resolve(material);
                }
            });
        });
    }
}
