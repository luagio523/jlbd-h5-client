import { ECSEntity } from "../ecs/ECSEntity";
import { ModifierFunction } from "../enum/ModifierFunction";
import { ModifierManager } from "../manager/ModifierManager";


export class SpeedCalculator {
    private modifierManager: ModifierManager;

    constructor(modifierManager: ModifierManager) {
        this.modifierManager = modifierManager;
    }

    calculateFinalSpeed(entity: ECSEntity, baseSpeed: number): number {
        let finalSpeed = baseSpeed;

        // 检查是否有基础速度覆盖
        const baseOverride = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_MOVESPEED_BASE_OVERRIDE);
        if (baseOverride > 0) {
            finalSpeed = baseOverride;
        }

        // 应用固定加成
        finalSpeed += this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT);

        // 应用独特的固定加成（取最大值）
        const uniqueConstant = Math.max(
            this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT_UNIQUE),
            this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT_UNIQUE_2)
        );
        finalSpeed += uniqueConstant;

        // 应用百分比加成
        const percentageBonus = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE);
        finalSpeed *= (1 + percentageBonus / 100);

        // 应用独特的百分比加成（取最大值）
        const uniquePercentage = Math.max(
            this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE_UNIQUE),
            this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_UNIQUE),
            this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_UNIQUE_2)
        );
        finalSpeed *= (1 + uniquePercentage / 100);

        // 应用绝对速度设定
        const absoluteSpeed = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_MOVESPEED_ABSOLUTE);
        if (absoluteSpeed > 0) {
            finalSpeed = absoluteSpeed;
        }

        // 应用最小和最大速度限制
        const minSpeed = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_MOVESPEED_ABSOLUTE_MIN);
        const maxSpeed = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_MOVESPEED_ABSOLUTE_MAX);
        
        if (minSpeed > 0) {
            finalSpeed = Math.max(finalSpeed, minSpeed);
        }
        if (maxSpeed > 0) {
            finalSpeed = Math.min(finalSpeed, maxSpeed);
        }

        // 检查是否忽略移动速度限制
        const ignoreLimit = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_IGNORE_MOVESPEED_LIMIT);
        if (!ignoreLimit) {
            // 应用默认的移动速度限制（假设为 350-550）
            finalSpeed = Math.max(350, Math.min(550, finalSpeed));
        }

        // 应用自定义速度限制
        const speedLimit = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_MOVESPEED_LIMIT);
        if (speedLimit > 0) {
            finalSpeed = Math.min(finalSpeed, speedLimit);
        }

        return finalSpeed;
    }

    
}












