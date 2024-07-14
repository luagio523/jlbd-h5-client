import { ECSEntity } from "../ecs/ECSEntity";
import { ModifierFunction } from "../enum/ModifierFunction";
import { ModifierManager } from "../manager/ModifierManager";

export class ManaCalculator {
    private modifierManager: ModifierManager;
  
    constructor() {
        this.modifierManager = ModifierManager.getInstance();
    }
  
    calculateFinalMaxMana(entity: ECSEntity,baseMana: number): number {
        const manaBonus = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_HEALTH_BONUS);
        return manaBonus + baseMana;
    }
  
    calculateFinalManaRegeneration(entity: ECSEntity,baseRegen: number): number {
        const constantRegen = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_HEALTH_REGEN_CONSTANT);
        const percentageRegen = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_HEALTH_REGEN_PERCENTAGE);
        let totalRegen = baseRegen + constantRegen;
        totalRegen *= (1 + percentageRegen / 100);
        return totalRegen;
    }
  
    calculateManaIncrease(entity: ECSEntity, amount: number): number {
        const extraManaBonus = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_EXTRA_HEALTH_BONUS);
        const extraManaPercentage = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_EXTRA_HEALTH_PERCENTAGE);
    
        let totalIncrease = amount + extraManaBonus;
        totalIncrease *= (1 + extraManaPercentage / 100);
    
        return Math.floor(totalIncrease);
    }
}