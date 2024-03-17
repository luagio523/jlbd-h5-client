import { AttackComponent } from "../component/AttackComponent";
import { BuffComponent } from "../component/BuffComponent";
import { HealthComponent } from "../component/HealthComponent";
import { ECSEntity } from "../ecs/ECSEntity";
import { AttackEvent } from "../event/Event";
import { BaseSystem } from "./BaseSystem";

class DamageSystem extends BaseSystem{
    update() {
        const events = this.getEvents(AttackEvent.NAME)

        for (const event of events) {
            this.processAttackEvent(event as AttackEvent);
        }
        // 清空事件队列
        this.removeEvents("AttackEvent")
    }

    processAttackEvent(event: AttackEvent) {
        
    }
   


    // function performAttack(attacker: Entity, target: Entity) {
    //     const attackComponent = attacker.getComponent<AttackComponent>('AttackComponent');
    //     const targetHealth = target.getComponent<HealthComponent>('HealthComponent');
    
    //     if (attackComponent && targetHealth) {
    //         // 计算基础伤害
    //         let finalDamage = attackComponent.damage;
    
    //         // 暴击判定
    //         if (Math.random() < attackComponent.critChance) {
    //             finalDamage *= attackComponent.critMultiplier;
    //             console.log("暴击发生!");
    //         }
    
    //         // 应用伤害到目标生命值
    //         targetHealth.value -= finalDamage;
    //     }
    // }


    performAttack(attacker: ECSEntity, target: ECSEntity) {
        const attackComponent = attacker.getComponent(AttackComponent);
        const targetHealth = target.getComponent(HealthComponent);
        let finalDamage = attackComponent.damage;
        let critChance = attackComponent.critChance;
        // 假设buff可能会增加暴击率
        let critMultiplier = attackComponent.critMultiplier;
    
        // 应用buff效果
        const buffs = attacker.getComponent(BuffComponent).buffs;
        for (const buff of buffs) {
            switch(buff.type) {
                case 'increaseCritChance':
                    critChance += buff.effect.critChanceIncrease;
                    break;
                case 'increaseCritMultiplier':
                    critMultiplier += buff.effect.critMultiplierIncrease;
                    break;
                // 处理其他类型的buff效果
            }
        }
    
        // 暴击判定
        if (Math.random() < critChance) {
            finalDamage *= critMultiplier;
            console.log("暴击发生!");
        }
    
        // 应用伤害
        if (targetHealth) {
            targetHealth.value -= finalDamage;
            // ... 剩下的伤害逻辑 ...
        }
    }

}