import { BaseSystem } from "./BaseSystem";

class EventQueue {
    private static queue: AttackEvent[] = [];

    static enqueue(event: AttackEvent) {
        this.queue.push(event);
    }

    static getEvents(): AttackEvent[] {
        return this.queue;
    }

    static clear() {
        this.queue = [];
    }
}

function fireEvent(event: AttackEvent) {
    EventQueue.enqueue(event);
}


// const allNPCs = this.getAllEntitiesWithComponent<NPCComponent>(NPCComponent);
// for (const npc of allNPCs) {
//     this.stopLevitation(npc);
// }


class DamageSystem extends BaseSystem{
    update() {
        const events = EventQueue.getEvents();

        for (const event of events) {
            processAttackEvent(event);
        }

        // 清空事件队列
        EventQueue.clear();
    }

    processAttackEvent(event: AttackEvent) {
        const targetHealth = event.target.getComponent<Health>('Health');
        if (targetHealth) {
            targetHealth.value -= event.damage;

            // 假设实体死亡，会产生实体死亡的事件等等...
            if (targetHealth.value <= 0) {
                fireEvent(new DeathEvent(event.target));
            }
        }
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


    function performAttack(attacker: Entity, target: Entity) {
        const attackComponent = attacker.getComponent<AttackComponent>('AttackComponent');
        const targetHealth = target.getComponent<HealthComponent>('HealthComponent');
        let finalDamage = attackComponent.damage;
        let critChance = attackComponent.critChance;
        // 假设buff可能会增加暴击率
        let critMultiplier = attackComponent.critMultiplier;
    
        // 应用buff效果
        const buffs = attacker.getComponent<BuffComponent>('BuffComponent').buffs;
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