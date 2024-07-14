import { AttributeComponent } from "../component/AttributeComponent";
import { ECSEntity } from "../ecs/ECSEntity";
import { ModifierFunction } from "../enum/ModifierFunction";
import { ModifierManager } from "../manager/ModifierManager";

export class AttributeCalculator {
    private modifierManager: ModifierManager;

    constructor(modifierManager: ModifierManager) {
        this.modifierManager = modifierManager;
    }

    calculateFinalStrength(entity: ECSEntity,baseStrength:number): number {
        const bonusStrength = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_STATS_STRENGTH_BONUS);
        const strengthPercentage = 1 + this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_STATS_STRENGTH_BONUS_PERCENTAGE) / 100;
        return (baseStrength + bonusStrength) * strengthPercentage;
    }

   
    calculateFinalAgility(entity: ECSEntity,baseAgility:number): number {
        const bonusAgility = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_STATS_AGILITY_BONUS);
        const agilityPercentage = 1 + this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_STATS_AGILITY_BONUS_PERCENTAGE) / 100;
        return (baseAgility + bonusAgility) * agilityPercentage;
    }
    

    calculateFinalIntelligence(entity: ECSEntity,baseIntelligence:number): number {
        const bonusIntelligence = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_STATS_INTELLECT_BONUS);
        const intelligencePercentage = 1 + this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_STATS_INTELLECT_BONUS_PERCENTAGE) / 100;
        return (baseIntelligence + bonusIntelligence) * intelligencePercentage;
    }
    
}