import { AttributeComponent } from "../component/AttributeComponent";
import { ECSEntity } from "../ecs/ECSEntity";
import { ModifierFunction } from "../enum/ModifierFunction";
import { ModifierManager } from "../manager/ModifierManager";
import { AttributeCalculator } from "./AttributeCalculator";

export class ManaCalculator {
    private modifierManager: ModifierManager;
    private attributeCalculator: AttributeCalculator;
    constructor() {
        this.modifierManager = ModifierManager.getInstance();
        this.attributeCalculator = new AttributeCalculator(this.modifierManager);
    }
  
    calculateFinalMaxMana(entity: ECSEntity,baseMana: number): number {
        const intelligence = entity.getComponent(AttributeComponent).getIntelligence();
        const attributeIntelligence = this.attributeCalculator.calculateFinalIntelligence(entity,intelligence)*12 // 假设每点智力提供12点魔法值
        baseMana += attributeIntelligence;
        const manaBonus = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_HEALTH_BONUS);
        return  baseMana + manaBonus;
    }
  
    calculateFinalManaRegeneration(entity: ECSEntity,baseRegen: number): number {
        const intelligence = entity.getComponent(AttributeComponent).getIntelligence();
        const attributeIntelligenceRegen= this.attributeCalculator.calculateFinalIntelligence(entity,intelligence) * 0.05; // 假设每点智力提供0.05点/秒的魔法恢复
        baseRegen += attributeIntelligenceRegen;
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