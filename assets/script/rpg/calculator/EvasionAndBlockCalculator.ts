import { ECSEntity } from "../ecs/ECSEntity";
import { DamageType } from "../enum/Damage";
import { ModifierFunction } from "../enum/ModifierFunction";
import { ModifierManager } from "../manager/ModifierManager";

export class EvasionAndBlockCalculator {
    private modifierManager: ModifierManager;

    constructor(modifierManager: ModifierManager) {
        this.modifierManager = modifierManager;
    }

    // 计算实体的最终闪避
    calculateFinalEvasion(target: ECSEntity): number {
        return  this.modifierManager.getModifierValue(target, ModifierFunction.MODIFIER_PROPERTY_EVASION_CONSTANT)
    }


    //计算格挡后的伤害
    calculateFinalBlockDamage(entity: ECSEntity, baseDamage: number, damageType: DamageType): number {
        let finalDamage = baseDamage;
        // 应用不可避免的护甲前格挡
        const unavoidablePreArmorBlock = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_TOTAL_CONSTANT_BLOCK_UNAVOIDABLE_PRE_ARMOR);
        finalDamage = Math.max(0, finalDamage - unavoidablePreArmorBlock);
    
        // 根据伤害类型应用相应的格挡
        if (damageType === DamageType.DAMAGE_TYPE_PHYSICAL) {
            const physicalBlock = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_PHYSICAL_CONSTANT_BLOCK);
            finalDamage = Math.max(0, finalDamage - physicalBlock );
        } else if (damageType === DamageType.DAMAGE_TYPE_MAGICAL) {
            const magicalBlock = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_MAGICAL_CONSTANT_BLOCK);
            finalDamage = Math.max(0, finalDamage - magicalBlock);
        }
        // 应用总伤害格挡
        const totalBlock = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_TOTAL_CONSTANT_BLOCK);
        finalDamage = Math.max(0, finalDamage - totalBlock);
    
        return finalDamage;
    }
}