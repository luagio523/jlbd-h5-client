import { AttributeComponent } from "../component/AttributeComponent";
import { ECSEntity } from "../ecs/ECSEntity";
import { ModifierFunction } from "../enum/ModifierFunction";
import { ModifierManager } from "../manager/ModifierManager";
import { AttributeCalculator } from "./AttributeCalculator";

export class HealthCalculator {
    private modifierManager: ModifierManager;

    private attributeCalculator: AttributeCalculator;
  
    constructor() {
        this.modifierManager = ModifierManager.getInstance();
        this.attributeCalculator = new AttributeCalculator(this.modifierManager);
    }
  
    calculateFinalMaxHealth(entity: ECSEntity,baseHealth: number): number {
        const strength = entity.getComponent(AttributeComponent).getStrength();
        const attributeHealth = this.attributeCalculator.calculateFinalStrength(entity,strength)*20
        baseHealth += attributeHealth;
        const healthBonus = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_HEALTH_BONUS);
        return  baseHealth + healthBonus ;
    }
  
    calculateFinalHealthRegeneration(entity: ECSEntity,baseRegen: number): number {
        const strength = entity.getComponent(AttributeComponent).getStrength();
        const attributeHealthRegen = this.attributeCalculator.calculateFinalStrength(entity,strength)*0.1 //每点力量带来 0.1的生命加成
        baseRegen += attributeHealthRegen;
        const constantRegen = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_HEALTH_REGEN_CONSTANT);
        const percentageRegen = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_HEALTH_REGEN_PERCENTAGE);
        let totalRegen = baseRegen + constantRegen;
        totalRegen *= (1 + percentageRegen / 100);
        return totalRegen;
    }
  
    calculateHealthIncrease(entity: ECSEntity, amount: number): number {
        const extraHealthBonus = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_EXTRA_HEALTH_BONUS);
        const extraHealthPercentage = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_EXTRA_HEALTH_PERCENTAGE);
    
        let totalIncrease = amount + extraHealthBonus;
        totalIncrease *= (1 + extraHealthPercentage / 100);
    
        return Math.floor(totalIncrease);
    }
}