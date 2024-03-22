import { EntityIndex } from "./BaseEntity";
import { DamageType } from "./type/Type";



class DamageFilterEvent {
    entindex_attacker_const: EntityIndex;
    entindex_victim_const: EntityIndex;
    entindex_inflictor_const?: EntityIndex;
    damagetype_const: DamageType;
    damage: number;
}



// declare interface ApplyDamageOptions {
//     victim: CDOTA_BaseNPC;
//     attacker: CDOTA_BaseNPC;
//     damage: number;
//     damage_type: DAMAGE_TYPES;
//     damage_flags?: DOTADamageFlag_t;
//     ability?: CDOTABaseAbility;
// }


class AttackEvent {
    constructor(
        public readonly attacker: Entity,
        public readonly target: Entity,
        public readonly damage: number,
        public readonly attackType: string
    ) {}
}


function performAttack(attacker: Entity, target: Entity) {
    const attackDamage = calculateDamage(attacker, target);
    const attackType = getAttackType(attacker);

    // 创建攻击事件
    const attackEvent = new AttackEvent(attacker, target, attackDamage, attackType);

    // 分发事件
    fireEvent(attackEvent);
}


// class EventQueue {
//     private static queue: AttackEvent[] = [];

//     static enqueue(event: AttackEvent) {
//         this.queue.push(event);
//     }

//     static getEvents(): AttackEvent[] {
//         return this.queue;
//     }

//     static clear() {
//         this.queue = [];
//     }
// }

// function fireEvent(event: AttackEvent) {
//     EventQueue.enqueue(event);
// }

// class DamageSystem {
//     update() {
//         const events = EventQueue.getEvents();

//         for (const event of events) {
//             processAttackEvent(event);
//         }

//         // 清空事件队列
//         EventQueue.clear();
//     }

//     processAttackEvent(event: AttackEvent) {
//         const targetHealth = event.target.getComponent<Health>('Health');
//         if (targetHealth) {
//             targetHealth.value -= event.damage;

//             // 假设实体死亡，会产生实体死亡的事件等等...
//             if (targetHealth.value <= 0) {
//                 fireEvent(new DeathEvent(event.target));
//             }
//         }
//     }
// }


// 直接使用监听触发调用DamageSystem处理是可行的，并且在某些情
// 况下，这种方式比使用队列更直接、更简单。这种事件处理方式通常称为“直接分发”或“直接调用”，
// 其特点是事件发生时立即由对应的系统处理。


// class DamageSystem {
//     // ... 已有代码 ...

//     handleAttackEvent(event: AttackEvent) {
//         // 直接处理攻击事件
//         const targetHealth = event.target.getComponent<Health>('Health');
//         if (targetHealth) {
//             targetHealth.value -= event.damage;
            
//             if (targetHealth.value <= 0) {
//                 // 处理实体死亡逻辑...
//             }
//         }
//     }
// }

// // 在攻击的地方直接调用
// function performAttack(attacker: Entity, target: Entity) {
//     const attackDamage = calculateDamage(attacker, target);
//     const attackType = getAttackType(attacker);

//     // 直接调用DamageSystem处理事件
//     const damageSystem = new DamageSystem();
//     damageSystem.handleAttackEvent(new AttackEvent(attacker, target, attackDamage, attackType));
// }



// 这样的实现简化了事件的处理，并且确保了事件处理的即时性。然而，即使直接调用方法在某些情况下是合适的，队列方式也有其自身的优势，主要包括以下几点：
// 解耦：队列提供了一种解耦事件的产生和消费的方法。事件生产者不需要知道谁会处理这个事件，或者这个事件将如何被处理。
// 顺序控制：通过队列可以控制事件处理的顺序。例如，确保所有攻击事件都先于移动事件处理。
// 并发控制：在多线程环境中，使用队列可以有效管理事件的并发处理，确保事件的处理是线程安全的。
// 性能管理：队列使得可以更容易地平衡和调度事件处理的负载。例如，可以限制每帧处理的事件数量，或者根据当前的游戏状态（如是否处于战斗）调整事件处理的优先级。
// 复杂场景：当游戏逻辑变得更加复杂，涉及多个系统协同处理时，队列提供了一种更灵活的处理方式，可以方便地添加新的事件类型和处理逻辑。
// 选择哪种事件处理方式，直接调用还是队列，取决于游戏的具体需求和设计。对于简单的事件处理，直接调用可能是最快捷的方式，但对于更复杂的游戏，使用事件队列能提供更大的灵活性与控制能力。


// class BuffSystem {
//     update() {
//         // 遍历所有具有BuffComponent的实体
//         const entitiesWithBuffs = this.getEntitiesWithBuffs();

//         for (const entity of entitiesWithBuffs) {
//             // 遍历实体上的所有buff
//             for (const buff of entity.getComponent<BuffComponent>('BuffComponent').buffs) {
//                 // 应用buff效果
//                 this.applyBuffEffect(entity, buff);
                
//                 // 更新buff持续时间
//                 buff.duration -= deltaTime;

//                 // 如果buff到期了，将其移除
//                 if (buff.duration <= 0) {
//                     this.removeBuff(entity, buff);
//                 }
//             }
//         }
//     }

//     // ... applyBuffEffect， removeBuff等方法 ...
// }


// function performAttack(attacker: Entity, target: Entity) {
//     const attackComponent = attacker.getComponent<AttackComponent>('AttackComponent');
//     const targetHealth = target.getComponent<HealthComponent>('HealthComponent');
//     let finalDamage = attackComponent.damage;
//     let critChance = attackComponent.critChance;
//     // 假设buff可能会增加暴击率
//     let critMultiplier = attackComponent.critMultiplier;

//     // 应用buff效果
//     const buffs = attacker.getComponent<BuffComponent>('BuffComponent').buffs;
//     for (const buff of buffs) {
//         switch(buff.type) {
//             case 'increaseCritChance':
//                 critChance += buff.effect.critChanceIncrease;
//                 break;
//             case 'increaseCritMultiplier':
//                 critMultiplier += buff.effect.critMultiplierIncrease;
//                 break;
//             // 处理其他类型的buff效果
//         }
//     }

//     // 暴击判定
//     if (Math.random() < critChance) {
//         finalDamage *= critMultiplier;
//         console.log("暴击发生!");
//     }

//     // 应用伤害
//     if (targetHealth) {
//         targetHealth.value -= finalDamage;
//         // ... 剩下的伤害逻辑 ...
//     }
// }



// class Buff {
//     constructor(
//         public id: string,
//         public type: string,
//         public intensity: number,
//         public duration: number,
//         // 其他buff属性
//     ) {}
// }

// class BuffComponent {
//     public buffs: Buff[] = [];
// }

// class BuffSystem {
//     update(deltaTime: number) {
//         const entities = this.getEntitiesWithComponent<BuffComponent>(BuffComponent);
        
//         for (const entity of entities) {
//             const buffComponent = entity.getComponent<BuffComponent>();

//             for (let i = buffComponent.buffs.length - 1; i >= 0; i--) {
//                 const buff = buffComponent.buffs[i];

//                 // 应用buff效果
//                 this.applyBuff(entity, buff);

//                 // 更新buff持续时间
//                 buff.duration -= deltaTime;

//                 // 如果buff到期了，将其移除
//                 if (buff.duration <= 0) {
//                     buffComponent.buffs.splice(i, 1);
//                 }
//             }
//         }
//     }

//     applyBuff(entity, buff) {
//         switch(buff.type) {
//             case 'IncreaseHealth':
//                 this.increaseHealth(entity, buff.intensity);
//                 break;
//             case 'DamageOverTime':
//                 this.applyDamageOverTime(entity, buff.intensity);
//                 break;
//             case 'SpeedBoost':
//                 this.increaseSpeed(entity, buff.intensity);
//                 break;
//             // 其他buff类型
//         }
//         // ... 其他buff应用逻辑 ...
//     }

//     // 增加实体的生命值
//     increaseHealth(entity, intensity) {
//         // 相应地增加生命值
//     }

//     // 对实体应用持续伤害
//     applyDamageOverTime(entity, intensity) {
//         // 每次更新，减少一点生命值
//     }

//     // 增加实体的移动速度
//     increaseSpeed(entity, intensity) {
//         // 修改移动速度属性
//     }

//     // ... 其他buff影响的函数 ...

//     getEntitiesWithComponent(componentType) {
//         // 实现方法以获取包含指定组件的所有实体
//     }
// }




// 临时获取Buff（Approach A）：
// 在计算伤害、攻击、或者进行任何其他相关的操作之前，临时查询实体的Buff，这种方法允许系统在需要时进行即时调整。
// 这种方法适合那些影响一次性事件的Buff，例如一个增加下一次攻击暴击概率的Buff。
// 这种即时查询方式能够确保Buff效果始终为最新。
// 在BuffSystem中应用Buff（Approach B）：
// BuffSystem负责定期更新实体的Buff状态，并将Buff效果应用到实体的属性上，这种方法将实体的最新状态持续维护更新。
// 这种方法适合持续性效果的Buff，例如一段时间内提升移动速度或持续治疗。
// 由于Buff的效果被直接应用到实体的属性上，其他系统无需在执行时考虑这些Buff，可以简化查询逻辑。
// 关于重复应用的问题，确实，BuffSystem在每帧都会处理Buff，但这不一定意味着每帧都在重复应用同一Buff。具体的处理逻辑取决于Buff的效果和设计：
// 对于一次性效果的Buff（如：立即恢复某个量），你可能会在应用时立刻从实体中移除它。
// 对于持续性效果的Buff（如：每秒恢复生命），你将在每个更新周期中应用一次这种Buff的效果，并逐渐减少Buff持续时间直至移除。
// 对于属性修改效果的Buff（如：增加暴击率），你会在Buff添加时修改属性，并在Buff结束时撤销修改。这种情况下，确保不会重复应用效果的关键是管理好Buff生命周期的开始和结束。
// 下面展示Approach B在BuffSystem中正确应用Buff，避免重复应用效果的代码逻辑：
// typescript
// update(deltaTime: number) {
//     const entities = this.getEntitiesWithComponent<BuffComponent>(BuffComponent);
    
//     for (const entity of entities) {
//         const buffComponent = entity.getComponent<BuffComponent>();

//         for (let i = buffComponent.buffs.length - 1; i >= 0; i--) {
//             const buff = buffComponent.buffs[i];

//             if (buff.applied === false) {
//                 this.applyBuff(entity, buff);
//                 buff.applied = true; // 标记效果已经应用
//             }

//             buff.duration -= deltaTime;

//             if (buff.duration <= 0) {
//                 this.removeBuff(entity, buff);
//                 // 重置改变过的属性
//                 this.undoBuffEffect(entity, buff);
//                 buffComponent.buffs.splice(i, 1);
//             }
//         }
//     }
// }

// applyBuff(entity, buff) {
//     // 假设这里修改了实体的属性，比如增加暴击概率
// }

// undoBuffEffect(entity, buff) {
//     // 撤销Buff效果，将属性重置回Buff之前的状态
// }
// 在这个逻辑中，每个buff都有一个applied状态，用于标记是否已经将buff效果应用到实体上。这样，你可以确保在buff的有效期内只应用一次效果，并且在buff到期时撤销效果。这种方法适用于那些在Buff到期时需要回滚的效果。
// 结论：选择哪种方式应当基于你的游戏设计和buff效果。如果你的游戏需要将buff效果实时地应用于一次性或即时的动作上，那么Approach A可能更好。如果你的游戏中buff效果是修改实体长期属性的，Approach B或许更加合适，因为它可以在buff到期时更容易地管理属性的恢复。记得为每种buff效果正确地管理应用和移除逻辑，以保持游戏状态的正确性。




// function performAttack(attacker: Entity, target: Entity) {
//     const attackComponent = attacker.getComponent<AttackComponent>('AttackComponent');
//     const targetHealth = target.getComponent<HealthComponent>('HealthComponent');
//     let finalDamage = attackComponent.damage;
//     let critChance = attackComponent.critChance;
//     // 假设buff可能会增加暴击率
//     let critMultiplier = attackComponent.critMultiplier;

//     // 应用buff效果
//     const buffs = attacker.getComponent<BuffComponent>('BuffComponent').buffs;
//     for (const buff of buffs) {
//         switch(buff.type) {
//             case 'increaseCritChance':
//                 critChance += buff.effect.critChanceIncrease;
//                 break;
//             case 'increaseCritMultiplier':
//                 critMultiplier += buff.effect.critMultiplierIncrease;
//                 break;
//             // 处理其他类型的buff效果
//         }
//     }

//     // 暴击判定
//     if (Math.random() < critChance) {
//         finalDamage *= critMultiplier;
//         console.log("暴击发生!");
//     }

//     // 应用伤害
//     if (targetHealth) {
//         targetHealth.value -= finalDamage;
//         // ... 剩下的伤害逻辑 ...
//     }
// }