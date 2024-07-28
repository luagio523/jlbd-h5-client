// DamageNumberEffect.ts
import { Node, Label, Vec3, tween, Color } from 'cc';
import { BaseEffect } from './Effect';
import { Effect } from './__private';
@Effect('DamageNumberEffect')
export class DamageNumberEffect extends BaseEffect {
    apply(target: Node, damage: number, duration: number = 1): void {

        // 创建一个新的节点来显示伤害数字
        const damageNode = new Node('DamageNumber');
        const label = damageNode.addComponent(Label);
        label.string = damage.toString();
        label.color = new Color(255, 0, 0, 255); // 红色
        label.fontSize = 40;

        // 将伤害数字节点添加到目标节点上
        target.addChild(damageNode);

        // 设置初始位置（略微偏上）
        damageNode.setPosition(new Vec3(0, 50, 0));

        // 创建上浮和淡出的动画
        tween(damageNode)
            .by(duration, { position: new Vec3(0, 100, 0) })
            .call(() => {
                damageNode.removeFromParent();
                damageNode.destroy();
                this.complete();
            })
            .start();

        // 淡出动画
        tween(label)
            .to(duration, { color: new Color(255, 0, 0, 0) })
            .start();
    }

    reset(): void {
        
    }
}
