import { AttributeComponent } from "../component/AttributeComponent";
import { ECSEntity } from "../ecs/ECSEntity";
import { ModifierFunction } from "../enum/Modifier";
import { ModifierManager } from "../manager/ModifierManager";

// ArmorCalculator.ts
export class ArmorCalculator {
    private modifierManager: ModifierManager;

    constructor(modifierManager: ModifierManager) {
        this.modifierManager = modifierManager;
    }

    // 计算实体的最终护甲值
    calculateFinalArmor(entity: ECSEntity): number {
        const baseArmor = entity.getComponent(AttributeComponent).getBaseArmor();
        const bonusArmor = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS);
        const armorPercentage = 1 + this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_TOTAL_PERCENTAGE) / 100;
        return (baseArmor + bonusArmor) * armorPercentage;
    }
}