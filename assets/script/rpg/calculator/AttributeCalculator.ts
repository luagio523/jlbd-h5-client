import { AttributeComponent } from "../component/AttributeComponent";
import { ECSEntity } from "../ecs/ECSEntity";
import { ModifierFunction } from "../enum/ModifierFunction";
import { ModifierManager } from "../manager/ModifierManager";

export class AttributeCalculator {
    private modifierManager: ModifierManager;

    constructor(modifierManager: ModifierManager) {
        this.modifierManager = modifierManager;
    }

    calculateFinalStrength(entity: ECSEntity): number {
        const strength = entity.getComponent(AttributeComponent).getStrength();
        const bonusStrength = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_STATS_STRENGTH_BONUS);
        const strengthPercentage = 1 + this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_STATS_STRENGTH_BONUS_PERCENTAGE) / 100;
        return (strength + bonusStrength) * strengthPercentage;
    }

   
    calculateFinalAgility(entity: ECSEntity): number {
        const agility = entity.getComponent(AttributeComponent).getAgility();
        const bonusAgility = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_STATS_AGILITY_BONUS);
        const agilityPercentage = 1 + this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_STATS_AGILITY_BONUS_PERCENTAGE) / 100;
        return (agility + bonusAgility) * agilityPercentage;
    }
    

    calculateFinalIntelligence(entity: ECSEntity): number {
        const intelligence = entity.getComponent(AttributeComponent).getIntelligence();
        const bonusIntelligence = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_STATS_INTELLECT_BONUS);
        const intelligencePercentage = 1 + this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_STATS_INTELLECT_BONUS_PERCENTAGE) / 100;
        return (intelligence + bonusIntelligence) * intelligencePercentage;
    }
    
}