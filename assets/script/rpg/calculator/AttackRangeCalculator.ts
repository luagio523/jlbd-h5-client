import { ECSEntity } from "../ecs/ECSEntity";
import { ModifierFunction } from "../enum/ModifierFunction";
import { ModifierManager } from "../manager/ModifierManager";

export class AttackRangeCalculator {
    private modifierManager: ModifierManager;

    constructor(modifierManager: ModifierManager) {
        this.modifierManager = modifierManager;
    }

    // 计算实体的最终护甲值
    calculateFinalAttackRange(entity: ECSEntity,baseAttackRange: number): number {
        let attackRange = baseAttackRange;
    
        // 检查是否有基础攻击范围覆盖
        const baseOverride = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_ATTACK_RANGE_BASE_OVERRIDE);
        if (baseOverride > 0) {
          attackRange = baseOverride;
        }
        // 应用固定加成
        attackRange += this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS);
    
        // 应用百分比加成
        const percentageBonus = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS_PERCENTAGE);
        attackRange *= (1 + percentageBonus / 100);
    
        // 检查是否有最大攻击范围限制
        const maxAttackRange = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_MAX_ATTACK_RANGE);
        if (maxAttackRange > 0) {
           attackRange = Math.min(attackRange, maxAttackRange);
        }
        return Math.max(attackRange, 0); // 确保攻击范围不为负
    }
}