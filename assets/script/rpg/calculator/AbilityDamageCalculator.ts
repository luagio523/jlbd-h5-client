import { BaseAbility } from "../ability/BaseAbility";
import { AttackComponent } from "../component/AttackComponent";
import { AttributeComponent } from "../component/AttributeComponent";
import { AbilityData } from "../data/AbilityData";
import { ECSEntity } from "../ecs/ECSEntity";
import { DamageType } from "../enum/Damage";
import { ModifierFunction } from "../enum/ModifierFunction";
import { ModifierManager } from "../manager/ModifierManager";
import { DamageCalculator } from "./DamageCalculator";


export class AbilityDamageCalculator extends DamageCalculator{

    constructor(modifierManager: ModifierManager) {
        super(modifierManager);
        this.modifierManager = modifierManager;
    }
   

    public calculateFinalAbilityDamage(attacker: ECSEntity, target: ECSEntity, ability: BaseAbility): number {
        let baseDamage = ability.GetAbilityDamage();
        
        const attributeBonus = this.calculateAttributeBonus(attacker, ability);
        baseDamage += attributeBonus;
        
        // 应用技能特定的伤害修正
        baseDamage = this.applyAbilitySpecificModifiers(baseDamage, ability, attacker, target);
        
        let totalDamage = baseDamage;
        let damageType = ability.GetAbilityData().GetAbilityUnitDamageType();

        if (damageType === DamageType.DAMAGE_TYPE_NONE) {
            return 0;
        }

        if (damageType === DamageType.DAMAGE_TYPE_HP_REMOVAL) {
            return Math.floor(baseDamage);
        }
    
         // 应用护甲和魔法抗性
        totalDamage = this.applyDefenses(attacker,target, totalDamage, damageType);
     
        //  // 应用伤害增幅
        // totalDamage *= this.calculateDamageAmplification(attacker, damageType);
        // totalDamage *= (1 - this.calculateDamageReduction(target, damageType));
     
     
        return Math.max(0, Math.floor(totalDamage));
    }
    

    private applyAbilitySpecificModifiers(damage: number, ability: BaseAbility, attacker: ECSEntity, target: ECSEntity): number {
        // 这里可以根据技能的特殊效果来修改伤害
        // 例如，某些技能可能会根据目标的当前生命值来增加伤害
        return damage;
    }


    private calculateAttributeBonus(attacker: ECSEntity, ability: BaseAbility): number {
        
        return 0;
    }
   
   
}


// const modifierManager = ModifierManager.getInstance();
// const damageCalculator = new DamageCalculator(modifierManager);

// const attacker = /* 获取攻击者实体 */;
// const target = /* 获取目标实体 */;
// const baseDamage = 100; // 假设基础伤害为100
// const damageType = DamageType.DAMAGE_TYPE_PHYSICAL;

// const finalDamage = damageCalculator.calculateDamage(attacker, target, baseDamage, damageType);
// console.log(`Final damage: ${finalDamage}`);