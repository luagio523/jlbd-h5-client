import { ECSEntity } from "../ecs/ECSEntity";
import { ModifierFunction } from "../enum/ModifierFunction";
import { ModifierManager } from "../manager/ModifierManager";

export class EvasionAndBlockCalculator {
    private modifierManager: ModifierManager;

    constructor(modifierManager: ModifierManager) {
        this.modifierManager = modifierManager;
    }

    // 计算实体的最终闪避和格挡效果
    calculateFinalEvasion(target: ECSEntity): number {
        const evasion = this.modifierManager.getModifierValue(target, ModifierFunction.MODIFIER_PROPERTY_EVASION_CONSTANT) / 100;
        if (evasion <= 0) {
            return 1; // 无闪避
        }
        if (Math.random() < evasion) {
            return 0; // 闪避成功
        }
        return 1; // 闪避失败
    }


    calculateFinalBlock(target: ECSEntity, damage: number): number {
        const block = this.modifierManager.getModifierValue(target, ModifierFunction.MODIFIER_PROPERTY_TOTAL_CONSTANT_BLOCK);
        if (block <= 0) {
            return damage; // 无格挡
        }
        return Math.max(0, damage - block);
    }
}