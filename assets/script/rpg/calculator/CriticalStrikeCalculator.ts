import { ECSEntity } from "../ecs/ECSEntity";
import { ModifierFunction } from "../enum/ModifierFunction";
import { ModifierManager } from "../manager/ModifierManager";

// CriticalStrikeCalculator.ts
export class CriticalStrikeCalculator {
    private modifierManager: ModifierManager;

    constructor(modifierManager: ModifierManager) {
        this.modifierManager = modifierManager;
    }

    // 计算实体的最终暴击伤害倍数
    calculateFinalCriticalStrike(entity: ECSEntity): number {
        const critChance = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_PREATTACK_CRITICALSTRIKE) / 100;
        return Math.random() < critChance ? 2 : 1; // 假设暴击伤害是200%
    }
}
