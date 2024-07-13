import { AttributeComponent } from "../component/AttributeComponent";
import { ECSEntity } from "../ecs/ECSEntity";
import { ModifierFunction } from "../enum/ModifierFunction";
import { ModifierManager } from "../manager/ModifierManager";

export class MagicResistanceCalculator {
    private modifierManager: ModifierManager;

    constructor(modifierManager: ModifierManager) {
        this.modifierManager = modifierManager;
    }

    // 计算实体的最终魔法抗性
    calculateFinalMagicResistance(entity: ECSEntity): number {
        const baseMagicResistance = entity.getComponent(AttributeComponent).getBaseMagicResistance();
        const bonusMagicResistance = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS) / 100;
        return Math.min(1, baseMagicResistance + bonusMagicResistance);
    }
}
