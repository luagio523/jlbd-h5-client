// DamageNumberEffect.ts
import { Node, Label, Vec3, tween, Color } from 'cc';
import { BaseEffect } from './Effect';
import { Effect } from './__private';
@Effect('DamageNumberEffect')
export class DamageNumberEffect extends BaseEffect {
    private damageNumber: DamageNumber;

    constructor() {
        super();
        this.damageNumber = null;
    }

    async apply(target: Node, damage: number, duration: number = 1): Promise<void> {
        this.damageNumber = await DamageNumber.create(40);
        this.damageNumber.setText(damage);
        this.damageNumber.setColor(Color.RED);
        this.damageNumber.setPosition(0, 50); // 初始位置（略微偏上）
        target.addChild(this.damageNumber.getNode());

        const damageNode = this.damageNumber.getNode();
        const label = this.damageNumber.getLabel();

        // 创建上浮和淡出的动画
        tween(damageNode)
            .by(duration, { position: new Vec3(0, 100, 0) })
            .call(() => {
                this.damageNumber.reset();
                this.complete();
            })
            .start();

        // 淡出动画
        tween(label)
            .to(duration, { color: new Color(255, 0, 0, 0) })
            .start();
    }

    reset(): void {
        if (this.damageNumber) {
            this.damageNumber.reset();
            this.damageNumber = null;
        }
    }
}
