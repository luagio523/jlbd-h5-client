import { ECSEntity } from "../ecs/ECSEntity";
import { ModifierFunction } from "../enum/ModifierFunction";
import { ModifierManager } from "../manager/ModifierManager";

export class EvasionAndBlockCalculator {
    private modifierManager: ModifierManager;

    constructor(modifierManager: ModifierManager) {
        this.modifierManager = modifierManager;
    }

    // 计算实体的最终闪避和格挡效果
    calculateFinalEvasionAndBlock(target: ECSEntity, damage: number): number {
        const evasion = this.modifierManager.getModifierValue(target, ModifierFunction.MODIFIER_PROPERTY_EVASION_CONSTANT) / 100;
        if (Math.random() < evasion) {
            return 0; // 闪避成功
        }

        const block = this.modifierManager.getModifierValue(target, ModifierFunction.MODIFIER_PROPERTY_TOTAL_CONSTANT_BLOCK);
        return Math.max(0, damage - block);
    }
}