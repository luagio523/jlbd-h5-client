
import { ECSEntity } from "../ecs/ECSEntity";
import { DamageType } from "../enum/Damage";
import { ModifierFunction } from "../enum/ModifierFunction";
import { ModifierManager } from "../manager/ModifierManager";
import { ArmorCalculator } from "./ArmorCalculator";
import { AttributeCalculator } from "./AttributeCalculator";
import { MagicResistanceCalculator } from "./MagicResistanceCalculator";


export class DamageCalculator {
    protected modifierManager: ModifierManager;
    private armorCalculator: ArmorCalculator;
    private magicResistanceCalculator: MagicResistanceCalculator;
    protected attributeCalculator: AttributeCalculator;

    constructor(modifierManager: ModifierManager) {
        this.modifierManager = modifierManager;
        this.armorCalculator = new ArmorCalculator(modifierManager);
        this.magicResistanceCalculator = new MagicResistanceCalculator(modifierManager);
        this.attributeCalculator = new AttributeCalculator(modifierManager);
    }

    /**
     * 计算伤害增幅
     * @param entity 
     * @param damageType 
     * @returns 
     */
    protected calculateDamageAmplification(entity: ECSEntity, damageType: DamageType): number {
        let amplification = 1;
        return amplification
    }

    /**
     * 计算伤害减免
     * @param entity 
     * @param damageType 
     * @returns 
     */
    protected calculateDamageReduction(entity: ECSEntity, damageType: DamageType): number {
        let reduction = 0;
        return Math.min(reduction, 1); // 确保减免不超过100%
    }


    protected applyDefenses(attacker: ECSEntity, target: ECSEntity, damage: number, damageType: DamageType): number {
        switch (damageType) {
            case DamageType.DAMAGE_TYPE_PHYSICAL:
                if (this.modifierManager.getModifierValue(attacker,  ModifierFunction.MODIFIER_PROPERTY_IGNORE_PHYSICAL_ARMOR) == 1) {   // 忽略物理防御;
                    return damage;
                }
                const armor = this.armorCalculator.calculateFinalArmor(target);
                const armorReduction = 1 - (0.06 * armor) / (1 + 0.06 * Math.abs(armor));
                return damage * armorReduction;
            case DamageType.DAMAGE_TYPE_MAGICAL:
                const magicResistance = this.magicResistanceCalculator.calculateFinalMagicResistance(target);
                return damage * (1 - magicResistance/100);
            case DamageType.DAMAGE_TYPE_PURE:
            case DamageType.DAMAGE_TYPE_ABILITY_DEFINED:
                return damage;
            default:
                return damage;
        }
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