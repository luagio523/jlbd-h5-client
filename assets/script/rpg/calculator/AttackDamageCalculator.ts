import { AttackComponent } from "../component/AttackComponent";
import { AttributeComponent } from "../component/AttributeComponent";
import { AbilityData } from "../data/AbilityData";
import { ECSEntity } from "../ecs/ECSEntity";
import { DamageType } from "../enum/Damage";
import { ModifierFunction } from "../enum/ModifierFunction";
import { ModifierManager } from "../manager/ModifierManager";
import { CriticalStrikeCalculator } from "./CriticalStrikeCalculator";
import { DamageCalculator } from "./DamageCalculator";
import { EvasionAndBlockCalculator } from "./EvasionAndBlockCalculator";

export class AttackDamageCalculator extends DamageCalculator{
  
    private criticalStrikeCalculator: CriticalStrikeCalculator;
    private evasionAndBlockCalculator: EvasionAndBlockCalculator;

    constructor(modifierManager: ModifierManager) {
        super(modifierManager)
       
        
        this.criticalStrikeCalculator = new CriticalStrikeCalculator(modifierManager);
        this.evasionAndBlockCalculator = new EvasionAndBlockCalculator(modifierManager);
    }

    

    private calculateBaseAttackDamage(entity: ECSEntity): number {
        let baseAttackDamage = 0;
        const attackComponent = entity.getComponent(AttackComponent);
        if (attackComponent) {
            baseAttackDamage = attackComponent.getBaseAttackDamage();
        }
        const attributeComponent = entity.getComponent(AttributeComponent);
        if (attributeComponent) {
            baseAttackDamage += attributeComponent.getPrimaryAttributeAsAttackPower();
        }
        return baseAttackDamage;
    }

    public calculateFinalAttackDamage(attacker: ECSEntity, target: ECSEntity): number {
        const baseAttackDamage = this.calculateBaseAttackDamage(attacker);
        const bonusAttackDamage = this.calculateBonusAttackDamage(attacker);
        const totalAttackDamage = baseAttackDamage + bonusAttackDamage;
        return this.calculateDamage(attacker, target, totalAttackDamage, DamageType.DAMAGE_TYPE_PHYSICAL);
    }
   

    calculateDamage(attacker: ECSEntity, target: ECSEntity, baseDamage: number, damageType: DamageType): number {
        if (damageType === DamageType.DAMAGE_TYPE_NONE) {
            return 0;
        }

        if (damageType === DamageType.DAMAGE_TYPE_HP_REMOVAL) {
            return Math.floor(baseDamage);
        }

        let totalDamage = baseDamage;

        // 预处理阶段
        totalDamage += this.calculatePreAttackBonusDamage(attacker);

        // 基础攻击加成
        totalDamage += this.calculateBaseAttackBonusDamage(attacker);

        // 特殊攻击加成（如技能触发的额外伤害）
        totalDamage += this.calculateProcAttackBonusDamage(attacker, damageType);

        // 暴击检查
        const critMultiplier = this.criticalStrikeCalculator.calculateFinalCriticalStrike(attacker);
        totalDamage *= critMultiplier;

        // 暴击后额外伤害
        totalDamage += this.calculatePostCritBonusDamage(attacker);

        // 伤害类型转换
        damageType = this.checkDamageTypeConversion(attacker, damageType);

        // 伤害百分比修改
        totalDamage *= this.calculateDamagePercentageModifier(attacker);

        // 应用护甲和魔法抗性
        totalDamage = this.applyDefenses(attacker,target, totalDamage, damageType);

        // 应用闪避和格挡（只对物理伤害有效）
        if (damageType === DamageType.DAMAGE_TYPE_PHYSICAL) {
            totalDamage = this.evasionAndBlockCalculator.calculateFinalEvasionAndBlock(target, totalDamage);
        }
        // // 应用伤害增幅
        // totalDamage *= this.calculateDamageAmplification(attacker, damageType);
        // // 应用伤害减免
        // totalDamage *= (1 - this.calculateDamageReduction(target, damageType));

        return Math.max(0, Math.floor(totalDamage));
    }

    

    private calculateBonusAttackDamage(entity: ECSEntity): number {
        let bonusAttackDamage = 0;
        bonusAttackDamage += this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE);
        bonusAttackDamage += this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_BASEATTACK_BONUSDAMAGE);
        return bonusAttackDamage;
    }

    private calculatePreAttackBonusDamage(entity: ECSEntity): number {
        return this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE);
    }

    private calculateBaseAttackBonusDamage(entity: ECSEntity): number {
        return this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_BASEATTACK_BONUSDAMAGE);
    }

    private calculateProcAttackBonusDamage(entity: ECSEntity, damageType: DamageType): number {
        let bonusDamage = 0;
        switch (damageType) {
            case DamageType.DAMAGE_TYPE_PHYSICAL:
                bonusDamage += this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_PHYSICAL);
                break;
            case DamageType.DAMAGE_TYPE_MAGICAL:
                bonusDamage += this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_MAGICAL);
                break;
            case DamageType.DAMAGE_TYPE_PURE:
                bonusDamage += this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_PURE);
                break;
        }
        return bonusDamage;
    }

    private calculatePostCritBonusDamage(entity: ECSEntity): number {
        return this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_POST_CRIT);
    }

    private checkDamageTypeConversion(entity: ECSEntity, originalType: DamageType): DamageType {
        if (originalType === DamageType.DAMAGE_TYPE_PHYSICAL &&
            this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_PROCATTACK_CONVERT_PHYSICAL_TO_MAGICAL) > 0) {
            return DamageType.DAMAGE_TYPE_MAGICAL;
        }
        return originalType;
    }

    private calculateDamagePercentageModifier(entity: ECSEntity): number {
        const bonusDamage = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_DAMAGEOUTGOING_PERCENTAGE) / 100;
        const totalDamage = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_TOTALDAMAGEOUTGOING_PERCENTAGE) / 100;
        return 1 + bonusDamage + totalDamage;
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