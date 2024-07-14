import { Constants } from "../constant/Constants";
import { ECSEntity } from "../ecs/ECSEntity";
import { ModifierFunction } from "../enum/ModifierFunction";
import { ModifierManager } from "../manager/ModifierManager";


export class SpeedCalculator {
    private modifierManager: ModifierManager;

    constructor(modifierManager: ModifierManager) {
        this.modifierManager = modifierManager;
    }

    calculateFinalSpeed(entity: ECSEntity, baseSpeed: number): number {
        const modifierManager = this.modifierManager;
        const getModifierValue = (func: ModifierFunction) => modifierManager.getModifierValue(entity, func);
       
    
        // 应用绝对速度效果
        const absoluteSpeed = getModifierValue(ModifierFunction.MODIFIER_PROPERTY_MOVESPEED_ABSOLUTE);
        if (absoluteSpeed > 0) {
            return this.applySpeedLimits(absoluteSpeed, entity);
        }
    
        // 计算加成总和
        let bonusConstant = getModifierValue(ModifierFunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT);
        let bonusPercentage = getModifierValue(ModifierFunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE);
    
        // // 计算唯一加成
        // const uniqueConstant = Math.max(
        //     getModifierValue(ModifierFunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT_UNIQUE),
        //     getModifierValue(ModifierFunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT_UNIQUE_2)
        // );
        // const uniquePercentage = Math.max(
        //     getModifierValue(ModifierFunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE_UNIQUE),
        //     getModifierValue(ModifierFunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_UNIQUE),
        //     getModifierValue(ModifierFunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_UNIQUE_2)
        // );
    
        // bonusConstant += uniqueConstant;
        // bonusPercentage += uniquePercentage;
    
        // 应用加成效果
        baseSpeed += bonusConstant;
        baseSpeed *= (1 + bonusPercentage / 100);
    
        return this.applySpeedLimits(baseSpeed, entity);
    }
    
    private applySpeedLimits(speed: number, entity: ECSEntity): number {
        const getModifierValue = (func: ModifierFunction) => this.modifierManager.getModifierValue(entity, func);
    
        // // 应用最小和最大速度限制
        // const minSpeed = getModifierValue(ModifierFunction.MODIFIER_PROPERTY_MOVESPEED_ABSOLUTE_MIN);
        // const maxSpeed = getModifierValue(ModifierFunction.MODIFIER_PROPERTY_MOVESPEED_ABSOLUTE_MAX);
        
        // if (minSpeed > 0) speed = Math.max(speed, minSpeed);
        // if (maxSpeed > 0) speed = Math.min(speed, maxSpeed);
    
        // 检查是否忽略移动速度限制
        const ignoreLimit = getModifierValue(ModifierFunction.MODIFIER_PROPERTY_IGNORE_MOVESPEED_LIMIT);
        if (!ignoreLimit) {
            // 应用默认的移动速度限制
            speed = Math.max(Constants.MIN_MOVEMENT_SPEED, Math.min(Constants.MAX_MOVEMENT_SPEED, speed));
        }
    
        // 应用自定义速度限制
        const speedLimit = getModifierValue(ModifierFunction.MODIFIER_PROPERTY_MOVESPEED_LIMIT);
        if (speedLimit > 0) {
            speed = Math.min(speed, speedLimit);
        }
    
        return speed;
    }



    // MODIFIER_PROPERTY_IGNORE_MOVESPEED_LIMIT:
    // 如果这个属性的值为true,则表示忽略所有的移动速度限制,包括默认的最小/最大速度限制和由其他修改器设置的自定义限制。也就是说,英雄的移动速度不受任何限制。
    // MODIFIER_PROPERTY_MOVESPEED_LIMIT:
    // 这个属性设置一个自定义的移动速度上限。英雄的最终移动速度将被限制在这个值以下,但是不会低于默认的最小移动速度。
    
}












