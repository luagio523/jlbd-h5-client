import { Node, Sprite, Material, resources, tween, Vec3, Label, ParticleSystem, UIOpacity, Color } from 'cc';
import { BaseEffect } from './Effect';
import { Effect } from './__private';
import scheduler from '../../utils/scheduler';

@Effect('CriticalHitEffect')
export class CriticalHitEffect extends BaseEffect {
    private slashNode: Node | null = null;
    private damageLabel: Node | null = null;
    private bloodParticle: ParticleSystem | null = null;

    async apply(target: Node, damage: number, direction: Vec3): Promise<void> {
        // 创建斩击效果
        await this.createSlashEffect(target, direction);

        // 创建伤害数字
        this.createDamageLabel(target, damage);

        // 创建血液粒子效果
        this.createBloodParticle(target);

        // 设置定时器以结束效果
        scheduler.scheduleOnce(() => {
            this.reset();
            this.complete();
        }, 1); // 效果持续1秒
    }

    private async createSlashEffect(target: Node, direction: Vec3): Promise<void> {
        // this.slashNode = new Node('SlashEffect');
        // target.addChild(this.slashNode);

        // const sprite = this.slashNode.addComponent(Sprite);
        // const slashMaterial = await this.loadMaterial('path/to/slash-material');
        // if (slashMaterial && sprite) {
        //     sprite.customMaterial = slashMaterial;
        // }

        // // 设置斩击方向
        // this.slashNode.setRotationFromEuler(0, 0, Vec3.angle(Vec3.RIGHT, direction) * (direction.y < 0 ? -1 : 1));

        // // 创建斩击动画
        // tween(this.slashNode)
        //     .to(0.1, { scale: new Vec3(2, 2, 2) })
        //     .to(0.1, { scale: Vec3.ZERO })
        //     .start();
    }

    private createDamageLabel(target: Node, damage: number): void {
        this.damageLabel = new Node('DamageLabel');
        const label = this.damageLabel.addComponent(Label);
        const uiOpacity = this.damageLabel.addComponent(UIOpacity);
        target.addChild(this.damageLabel);
        label.string = damage.toString();
        label.fontSize = 40;
        label.color = new Color(255, 0, 0); // 红色

        // 创建伤害数字动画
        tween(this.damageLabel)
            .to(0.5, { position: new Vec3(0, 100, 0), scale: new Vec3(1.5, 1.5, 1.5) })
            .call(() => {
                tween(uiOpacity)
                    .to(0.5, { opacity: 0 })
                    .start();
            })
            .start();
    }

    private createBloodParticle(target: Node): void {
        // this.bloodParticle = new Node('BloodParticle').addComponent(ParticleSystem);
        // target.addChild(this.bloodParticle.node);

        // // 设置粒子系统属性
        // // 这里需要根据具体的粒子系统设置进行调整
        // this.bloodParticle.duration = 0.5;
        // this.bloodParticle.emissionRate = 100;
        // this.bloodParticle.startColor = new Color(255, 0, 0);
        // this.bloodParticle.startSize = 5;
        // this.bloodParticle.startLifetime = 0.5;

        // // 播放粒子效果
        // this.bloodParticle.play();
    }

    reset(): void {
        if (this.slashNode) {
            this.slashNode.removeFromParent();
            this.slashNode.destroy();
        }
        if (this.damageLabel) {
            this.damageLabel.removeFromParent();
            this.damageLabel.destroy();
        }
        if (this.bloodParticle) {
            this.bloodParticle.node.removeFromParent();
            this.bloodParticle.node.destroy();
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
