import { Node, Label, Vec3, tween, Color } from 'cc';
import { BaseEffect } from './Effect';
import { Effect } from './__private';
import { DamageNumber } from '../render/effect/DamageNumber';
import { RenderableManager } from '../manager/RenderableManager';

@Effect('DamageNumberEffect')
export class DamageNumberEffect extends BaseEffect {
    private damageNumber: DamageNumber | null = null;
    private renderableManager: RenderableManager;

    constructor() {
        super();
        this.renderableManager = RenderableManager.getInstance();
    }

    async apply(target: Node, damage: number, duration: number = 1): Promise<void> {
        this.damageNumber = await this.renderableManager.createDamageNumber(40);
        this.damageNumber.setText(damage);
        this.damageNumber.setColor(Color.RED);
        this.damageNumber.setPosition(0, 50); // 初始位置（略微偏上）
        target.addChild(this.damageNumber.getNode());

        const damageNode = this.damageNumber.getNode();
        const label = damageNode.getComponent(Label);

        // 创建上浮和淡出的动画
        tween(damageNode)
            .by(duration, { position: new Vec3(0, 100, 0) })
            .call(() => {
                this.complete();
            })
            .start();

        // 淡出动画
        tween(label)
            .to(duration, { color: new Color(255, 0, 0, 0) })
            .start();
    }

    /**
     * 效果回收时会自动调用
     */
    reset(): void {
        this.recycleDamageNumber();
    }

    private recycleDamageNumber(): void {
        if (this.damageNumber) {
            this.renderableManager.recycleDamageNumber(this.damageNumber);
            this.damageNumber = null;
        }
    }
}
