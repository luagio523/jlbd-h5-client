import { BaseAbility } from "../ability/BaseAbility";

import { DamageCalculator } from "../calculator/DamageCalculator";
import { AbilityComponent } from "../component/AbilityComponent";
import { HealthComponent } from "../component/HealthComponent";
import { ECSEntity } from "../ecs/ECSEntity";
import { DamageType } from "../enum/Damage";
import { ModifierState } from "../enum/ModifierState";
import { ModifierManager } from "./ModifierManager";

interface DamageInfo {
    attacker: ECSEntity;
    victim: ECSEntity;
    damage: number;
    damageType: DamageType;
    ability?: BaseAbility;
}

export class DamageManager {
    private static instance: DamageManager;
    private damageCalculator: DamageCalculator;
    private modiferManager: ModifierManager;

    private constructor(modifierManager: ModifierManager) {
        this.modiferManager = modifierManager;
       this.damageCalculator  = new DamageCalculator(modifierManager);
       
    }

    public static getInstance(modifierManager?: ModifierManager): DamageManager {
        if (!DamageManager.instance) {
            if (!modifierManager) {
                throw new Error("ModifierManager must be provided when creating DamageManager instance");
            }
            DamageManager.instance = new DamageManager(modifierManager);
        }
        return DamageManager.instance;
    }

    //普通攻击计算还未防御时的伤害
    public calculatePreDefenseAttackDamage(attacker: ECSEntity, victim: ECSEntity, damageType: DamageType): number {
        let damage = this.damageCalculator.calculatePreDefenseAttackDamage(attacker, victim,  damageType);
        return damage ;
    }
   
   
    // 检查无敌状态：
    // 如果目标处于无敌状态，直接返回，不造成伤害。
    // 应用伤害增益修饰器：
    // 如MODIFIER_PROPERTY_TOTALDAMAGEOUTGOING_PERCENTAGE。
    // 应用伤害减免修饰器：
    // 如护甲、魔法抗性等。
    // 计算最终伤害：
    // 根据伤害类型和减免后的值计算实际伤害。
    // 应用特殊效果：
    // 如吸血、反伤等。
    // 更新目标生命值：
    // 从目标当前生命值中扣除最终伤害值。
    // 触发相关事件：
    // 如OnDamaged、OnKilled等。
    // 更新界面显示：
    // 显示伤害数字、更新生命条等。
    // 返回实际造成的伤害值。
    public ApplyDamage(damageInfo: DamageInfo): number {
        if (this.modiferManager.isInState(damageInfo.victim, ModifierState.MODIFIER_STATE_INVULNERABLE)) { // 目标处于无敌状态
            return 0;   
        }
        if (damageInfo.damage <= 0) {
            return 0;
        }
        let finalDamage = this.damageCalculator.calculateApplyDamage(damageInfo.attacker, damageInfo.victim, damageInfo.damage, damageInfo.damageType);
        this.applyDamageToVictim(damageInfo.victim, finalDamage);
        this.notifyDamageDealt(damageInfo, finalDamage);
        return finalDamage;
    }

   

    private applyDamageToVictim(victim: ECSEntity, damage: number): void {
        const healthComponent = victim.getComponent(HealthComponent);
        if (healthComponent) {
            healthComponent.takeDamage(damage);
        }
    }

   

    private notifyDamageDealt(damageInfo: DamageInfo, finalDamage: number): void {
        const attackerAbilityComponent = damageInfo.attacker.getComponent(AbilityComponent)  ;
        const victimAbilityComponent = damageInfo.victim.getComponent(AbilityComponent)  ;

        if (attackerAbilityComponent) {
            attackerAbilityComponent.onOwnerDealDamage(damageInfo.victim, finalDamage, damageInfo.damageType);
        }

        if (victimAbilityComponent) {
            victimAbilityComponent.onOwnerTakeDamage(damageInfo.attacker, finalDamage, damageInfo.damageType);
        }

        if (damageInfo.ability) {
            damageInfo.ability.OnAbilityDealDamage(damageInfo.victim, finalDamage, damageInfo.damageType);
        }
    }

    
}