import { AttackComponent } from "../component/AttackComponent";
import { AttributeComponent } from "../component/AttributeComponent";
import { AbilityData } from "../data/AbilityData";
import { ECSEntity } from "../ecs/ECSEntity";
import { DamageType } from "../enum/Damage";
import { ModifierFunction } from "../enum/Modifier";
import { ModifierManager } from "../manager/ModifierManager";
import { ArmorCalculator } from "./ArmorCalculator";
import { CriticalStrikeCalculator } from "./CriticalStrikeCalculator";
import { EvasionAndBlockCalculator } from "./EvasionAndBlockCalculator";
import { MagicResistanceCalculator } from "./MagicResistanceCalculator";

export class DamageCalculator {
    private modifierManager: ModifierManager;
    private armorCalculator: ArmorCalculator;
    private magicResistanceCalculator: MagicResistanceCalculator;
    private criticalStrikeCalculator: CriticalStrikeCalculator;
    private evasionAndBlockCalculator: EvasionAndBlockCalculator;

    constructor(modifierManager: ModifierManager) {
        this.modifierManager = modifierManager;
        this.armorCalculator = new ArmorCalculator(modifierManager);
        this.magicResistanceCalculator = new MagicResistanceCalculator(modifierManager);
        this.criticalStrikeCalculator = new CriticalStrikeCalculator(modifierManager);
        this.evasionAndBlockCalculator = new EvasionAndBlockCalculator(modifierManager);
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
        const critMultiplier = this.criticalStrikeCalculator.calculateFinalCriticalStrike(attacker);
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
            totalDamage = this.evasionAndBlockCalculator.calculateFinalEvasionAndBlock(target, totalDamage);
        }

        // 应用技能特定的伤害修正（如果有）
        if (abilityData) {
            totalDamage = this.applyAbilitySpecificModifiers(totalDamage, abilityData, attacker, target);
        }

        return Math.max(0, Math.floor(totalDamage));
    }

    //计算普通攻击伤害
    private calculateNormalAttackDamage(attacker: ECSEntity，target: ECSEntity): number {
        const baseAttackDamage = this.calculateBaseAttackDamage(attacker);
        return this.calculateDamage(attacker, target, baseAttackDamage, DamageType.DAMAGE_TYPE_PHYSICAL);
    }
       

    private calculateBaseAttackDamage(entity: ECSEntity): number {
        let baseAttackDamage = 0;
        const attackComponent = entity.getComponent(AttackComponent);
        if (attackComponent) {
            baseAttackDamage = attackComponent.getAttackDamage();
        }
        const attributeComponent = entity.getComponent(AttributeComponent);
        if (attributeComponent) {
            baseAttackDamage += attributeComponent.getPrimaryAttributeAsAttackPower();
        }
        return baseAttackDamage;
    }

    private calculatePreAttackBonusDamage(entity: ECSEntity): number {
        return this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE);
    }

    private calculateBaseAttackBonusDamage(entity: ECSEntity): number {
        return this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_BASEATTACK_BONUSDAMAGE);
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
                const armor = this.armorCalculator.calculateFinalArmor(target);
                const armorReduction = 1 - (0.06 * armor) / (1 + 0.06 * Math.abs(armor));
                return damage * armorReduction;
            case DamageType.DAMAGE_TYPE_MAGICAL:
                const magicResistance = this.magicResistanceCalculator.calculateFinalMagicResistance(target);
                return damage * (1 - magicResistance);
            case DamageType.DAMAGE_TYPE_PURE:
            case DamageType.DAMAGE_TYPE_ABILITY_DEFINED:
                return damage; // 纯粹伤害和技能定义的伤害不受防御影响
            default:
                return damage;
        }
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