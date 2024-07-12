import { Vec2 } from "cc";
import { AttackComponent } from "../component/AttackComponent";
import { TransformComponent } from "../component/TransformComponent";
import { ECSEntity } from "../ecs/ECSEntity";
import { BaseSystem } from "./BaseSystem";
import { AnimationEvent, ApplyDamageEvent, DelayedEvent, ProjectileEvent,  } from "../event/Event";
import { DamageType } from "../enum/Damage";
import { AttackCapability } from "../enum/Type";

// CPU缓存的设计利用了两种主要的局部性原理：
// 时间局部性（Temporal Locality）：如果一个数据项被访问，那么它很可能在不久的将来再次被访问。
// 空间局部性（Spatial Locality）：如果一个数据项被访问，那么存储在附近的数据项也很可能被很快地访问。

// 伤害 =
// { [主要攻击力 × (1 + Σ 百分比加成) + 固定值加成]
// × 致命一击倍数 - 被格挡伤害 }
// × 护甲倍数
// × 一般伤害倍数


// 修饰符MODIFIER_PROPERTY_PREATTACK_CRITICALSTRIKE与“致命一击倍数”相关，它使得单位有可能在进行攻击之前触发一次致命一击。
// 这种修饰符通常由某些技能或者物品的效果赋予，如幻影刺客的技能“混沌打击”或者道具“水晶剑”。
// 至于“一般伤害倍数”，《Dota 2》中没有直接用来影响“一般伤害倍数”的修饰符。影响“一般伤害倍数”的修饰符通常要根据具体的伤害类型和来源。
// 比如MODIFIER_PROPERTY_INCOMING_DAMAGE_PERCENTAGE可以用来影响单位受到的所有伤害，
// 而MODIFIER_PROPERTY_INCOMING_PHYSICAL_DAMAGE_PERCENTAGE则专门用来影响物理伤害。

export class AttackSystem extends BaseSystem {
    update(deltaTime: number) {
        const attackComponents = this.getComponents(AttackComponent);
        for (const attackComponent of attackComponents) {
            if (attackComponent.canAttack(deltaTime)) {
                const attacker = this.getEntity(attackComponent.entityId);
                const target = attackComponent.getTarget();
                if (target && this.shouldAttack(attacker, target)) {
                    this.initiateAttack(attacker, target, attackComponent);
                }
            }
        }
    }

    private shouldAttack(attacker: ECSEntity, target: ECSEntity): boolean {
        const attackComponent = attacker.getComponent(AttackComponent);
        const attackerTransform = attacker.getComponent(TransformComponent);
        const targetTransform = target.getComponent(TransformComponent);

        if (!attackComponent || !attackerTransform || !targetTransform) {
            return false;
        }

        const distance = Vec2.distance(attackerTransform.position, targetTransform.position);
        return distance <= attackComponent.getAttackRange();
    }

    private initiateAttack(attacker: ECSEntity, target: ECSEntity, attackComponent: AttackComponent) {
        // 触发攻击开始事件
        // this.enqueueEvent(new AttackEvent(attacker, target));

        // 触发动画事件
        this.enqueueEvent(new AnimationEvent(attacker));

        // 根据攻击类型决定是立即造成伤害还是延迟造成伤害
        if (attackComponent.attackCapability === AttackCapability.UNIT_CAP_MELEE_ATTACK) {
            this.enqueueEvent(new DelayedEvent(
                () => this.performAttack(attacker, target, attackComponent),
                attackComponent.getAttackAnimationPoint()
            ));
        } else if (attackComponent.attackCapability === AttackCapability.UNIT_CAP_RANGED_ATTACK) {
            // 触发投射物事件
            this.enqueueEvent(new ProjectileEvent(attacker, target));
        }

        // 重置攻击冷却
        attackComponent.performAttack();
    }

    private performAttack(attacker: ECSEntity, target: ECSEntity, attackComponent: AttackComponent) {
        const damage = attackComponent.getBaseAttackDamage();
        const damageType = DamageType.DAMAGE_TYPE_PHYSICAL; // 假设所有普通攻击都是物理伤害

        this.enqueueEvent(new ApplyDamageEvent(attacker, target, damage, damageType));

        attackComponent.performAttack();
    }
}




// if(attackComponent.damageType == DamageType.DAMAGE_TYPE_PHYSICAL){ //如果是物理伤害
//     let armorMultiplier = this.calculateArmorMultiplier(defenseComponent,attributeComponent,equipmentComponent,buffComponent)
//     mainAttackDamage = mainAttackDamage * armorMultiplier //× 护甲倍数  
// }else if (attackComponent.damageType == DamageType.DAMAGE_TYPE_MAGICAL){ //魔法伤害
//     let magicResistance  = this.calculateBaseMagicalResistance(defenseComponent,equipmentComponent,buffComponent)
//     mainAttackDamage = mainAttackDamage*(1-magicResistance)
// }


// let mainAttackTotalPercent = equipmentComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_TOTALDAMAGEOUTGOING_PERCENTAGE) +
// buffComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_TOTALDAMAGEOUTGOING_PERCENTAGE)
// mainAttackDamage = mainAttackDamage*(1+mainAttackTotalPercent) // *一般倍数

// if(attackComponent.damageType == DamageType.DAMAGE_TYPE_PHYSICAL){
//     mainAttackDamage -= this.calculatePhysicalBlock(equipmentComponent,buffComponent) //+ 固定值加成
// }else if (attackComponent.damageType == DamageType.DAMAGE_TYPE_MAGICAL){
//     mainAttackDamage -= this.calculateMagicalBlock(equipmentComponent,buffComponent)+
//     this.calculateTargetMagicalAttackBonusDamage(equipmentComponent,buffComponent) //魔法伤害
// }
// mainAttackDamage -=this.calculateTotalBlock(equipmentComponent,buffComponent)
// return mainAttackDamage


 /**
     * 方法名称：`GetModifierPreAttack_CriticalStrike`
     * 此方法返回预设的攻击暴击率。
     */

    //         // 用DOTA2的护甲计算公式计算伤害减免系数
    //         let damageMultiplier = 1 - 0.06 * defender.armorPhysical / (1 + 0.06 * Math.abs(defender.armorPhysical));

    // 攻击力 * (1 - ((0.06 * 护甲) / (1 + 0.06 * 护甲)))
// 物理伤害 是由攻击伤害决定的，会受到目标单位 护甲 的影响。护甲越多，物理伤害越少。护甲的种类和值可以从目标单位的装备、技能或其他修饰符中获取。
// 魔法伤害 是由单位的技能决定的，会受到目标单位 魔法抗性 的影响。魔法抗性越高，受到的魔法伤害就越少。单位的魔法抗性可以从目标单位的天赋、技能或其他修饰符中获取。
// 纯粹伤害 既不受护甲影响也不受魔法抗性影响。直接对目标单位造成伤害。






// 实体（Entity）是组件（Component）的容器，相当于一个标识或者ID，它本身没有实际的功能或者数据。
// 组件（Component）则包含数据，但不包含逻辑。例如位置、速度、健康值等。
// 系统（System）管理逻辑和行为，它会遍历拥有特定组件的实体来执行游戏逻辑。

// // 创建主角实体并添加组件
// const hero = new Entity();
// hero.id = 'hero';
// hero.addComponent('position', new Position());
// hero.addComponent('health', new Health());
// hero.addComponent('animationState', new AnimationState());

// // 定义系统，并添加到游戏系统列表中
// const entities = [hero]; // 此处仅以单个英雄为例
// const attackSystem = new AttackSystem(entities);

// // 假设这是响应一个点击事件的函数
// function onClickAttack(target: Entity): void {
//     attackSystem.attack(target, 10); // 假设每次攻击扣除10点血
// }

// // 游戏的主循环
// function gameLoop(): void {
//     // 在这里我们会调用所有系统的更新方法
//     attackSystem.update();

//     // 更多的游戏逻辑...

//     requestAnimationFrame(gameLoop);
// }

// // 开始游戏循环
// gameLoop();

// // 当玩家点击攻击按钮时调用
// onClickAttack(hero);