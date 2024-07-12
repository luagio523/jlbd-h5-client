import { AbilityData } from "../ability/AbilityData";
import { AttributeComponent } from "../component/AttributeComponent";
import { ECSEntity } from "../ecs/ECSEntity";
import { DamageType } from "../enum/Damage";
import { ModifierFunction } from "../enum/Modifier";
import { ModifierManager } from "../manager/ModifierManager";

export class DamageCalculator {
    private modifierManager: ModifierManager;

    constructor(modifierManager: ModifierManager) {
        this.modifierManager = modifierManager;
    }

    calculateDamage(attacker: ECSEntity, target: ECSEntity, baseDamage: number, damageType: DamageType, abilityData?: AbilityData): number {
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

        // 暴击检查
        const critMultiplier = this.checkCriticalStrike(attacker);
        totalDamage *= critMultiplier;

        // 暴击后额外伤害
        totalDamage += this.calculatePostCritBonusDamage(attacker);

        // 伤害类型转换
        damageType = this.checkDamageTypeConversion(attacker, damageType);

        // 伤害百分比修改
        totalDamage *= this.calculateDamagePercentageModifier(attacker);

        // 应用护甲和魔法抗性
        totalDamage = this.applyDefenses(target, totalDamage, damageType);

        // 应用闪避和格挡（只对物理伤害有效）
        if (damageType === DamageType.DAMAGE_TYPE_PHYSICAL) {
            totalDamage = this.applyEvasionAndBlock(target, totalDamage);
        }

        // 应用技能特定的伤害修正（如果有）
        if (abilityData) {
            totalDamage = this.applyAbilitySpecificModifiers(totalDamage, abilityData, attacker, target);
        }

        return Math.max(0, Math.floor(totalDamage));
    }

    private calculatePreAttackBonusDamage(entity: ECSEntity): number {
        return this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE);
    }

    private calculateBaseAttackBonusDamage(entity: ECSEntity): number {
        return this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_BASEATTACK_BONUSDAMAGE);
    }

    private checkCriticalStrike(entity: ECSEntity): number {
        const critChance = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_PREATTACK_CRITICALSTRIKE) / 100;
        return Math.random() < critChance ? 2 : 1; // 假设暴击伤害是200%
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

    private applyDefenses(target: ECSEntity, damage: number, damageType: DamageType): number {
        switch (damageType) {
            case DamageType.DAMAGE_TYPE_PHYSICAL:
                const armor = this.calculateTotalArmor(target);
                const armorReduction = 1 - (0.06 * armor) / (1 + 0.06 * Math.abs(armor));
                return damage * armorReduction;
            case DamageType.DAMAGE_TYPE_MAGICAL:
                const magicResistance = this.calculateMagicResistance(target);
                return damage * (1 - magicResistance);
            case DamageType.DAMAGE_TYPE_PURE:
            case DamageType.DAMAGE_TYPE_ABILITY_DEFINED:
                return damage; // 纯粹伤害和技能定义的伤害不受防御影响
            default:
                return damage;
        }
    }

    private calculateTotalArmor(entity: ECSEntity): number {
        const baseArmor = entity.getComponent(AttributeComponent).getBaseArmor();
        const bonusArmor = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS);
        const armorPercentage = 1 + this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_TOTAL_PERCENTAGE) / 100;
        return (baseArmor + bonusArmor) * armorPercentage;
    }

    private calculateMagicResistance(entity: ECSEntity): number {
        const baseMagicResistance = entity.getComponent(AttributeComponent).getBaseMagicResistance();
        const bonusMagicResistance = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS) / 100;
        return Math.min(1, baseMagicResistance + bonusMagicResistance);
    }

    private applyEvasionAndBlock(target: ECSEntity, damage: number): number {
        const evasion = this.modifierManager.getModifierValue(target, ModifierFunction.MODIFIER_PROPERTY_EVASION_CONSTANT) / 100;
        if (Math.random() < evasion) {
            return 0; // 闪避成功
        }

        const block = this.modifierManager.getModifierValue(target, ModifierFunction.MODIFIER_PROPERTY_TOTAL_CONSTANT_BLOCK);
        return Math.max(0, damage - block);
    }

    private applyAbilitySpecificModifiers(damage: number, abilityData: AbilityData, attacker: ECSEntity, target: ECSEntity): number {
        // 这里可以根据技能的特殊效果来修改伤害
        // 例如，某些技能可能会根据目标的当前生命值来增加伤害
        // 或者根据技能等级来调整伤害
        // 具体实现取决于游戏设计
        return damage;
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