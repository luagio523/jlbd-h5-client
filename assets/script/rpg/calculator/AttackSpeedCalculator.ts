import { Constants } from "../constant/Constants";
import { ECSEntity } from "../ecs/ECSEntity";
import { ModifierFunction } from "../enum/ModifierFunction";
import { ModifierManager } from "../manager/ModifierManager";
// 定义：AttackRate 是单位在没有任何攻击速度加成的情况下，完成一次攻击所需的基础时间（以秒为单位）。
//攻击速度Multiplier = Math.pow(2, 攻击速度加成 / 100)
// 计算公式：实际攻击间隔 = AttackRate / 攻击速度Multiplier
// 其中，攻击速度加成是以百分比表示的，例如 100 表示 100% 的加成。
// 默认值：大多数英雄的基础 AttackRate 为 1.7 秒，但也有例外。有些英雄可能更快或更慢。



// 假设一个英雄的BAT是1.7，没有任何攻击速度加成：

// 0攻击速度 = 基础攻击间隔
// 100攻击速度 = 基础攻击间隔减半   
// -100攻击速度 = 基础攻击间隔翻倍   

export class AttackSpeedCalculator {
    private modifierManager: ModifierManager;

    constructor(modifierManager: ModifierManager) {
        this.modifierManager = modifierManager;
    }

    // 计算最终攻击速度
    calculateFinalAttackRate(entity: ECSEntity, baseAttackTime: number): number {
        // 计算基础攻击时间 (BAT)
        let finalBAT = this.calculateBAT(entity, baseAttackTime);

        // 计算攻击速度
        let attackSpeedBonus = this.calculateAttackSpeedBonus(entity);

        let multiplier = this.calculateAttackIntervalMultiplier(attackSpeedBonus);
        // 计算攻击时间
        let attackTime = finalBAT / multiplier;
        // 应用攻击速度限制
        attackTime = this.applyAttackSpeedLimits(entity, attackTime);
        // 将攻击时间转换为每秒攻击次数
        return attackTime;
    }

    calculateAttackIntervalMultiplier(attackSpeedBonus: number): number {
        return Math.pow(2, attackSpeedBonus / 100);
    }

    // 计算基础攻击时间 (BAT)
    private calculateBAT(entity: ECSEntity, baseAttackTime: number): number {
        let bat = baseAttackTime;

        // // 应用 BAT 常数修改器
        // let batConstant = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_BASE_ATTACK_TIME_CONSTANT);
        // if (batConstant > 0) {
        //     bat = batConstant;
        // }

        // // 应用 BAT 调整
        // let batAdjust = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_BASE_ATTACK_TIME_CONSTANT_ADJUST);
        // bat += batAdjust;

        // // 应用 BAT 百分比修改器
        // let batPercentage = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_BASE_ATTACK_TIME_PERCENTAGE);
        // bat *= (1 + batPercentage / 100);

        return bat;
    }

    // 计算攻击速度
    private calculateAttackSpeedBonus(entity: ECSEntity): number {
        let attackSpeed = 0; // 基础攻击速度为 100
        // 应用常数加成
        attackSpeed += this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT);

        return attackSpeed;
    }

    // 应用攻击速度限制
    private applyAttackSpeedLimits(entity: ECSEntity, attackTime: number): number {

        // 检查是否忽略攻击速度限制
        let ignoreLimit = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_IGNORE_ATTACKSPEED_LIMIT);
        if (!ignoreLimit) {
            attackTime = Math.max(Constants.MIN_ATTACK_TIME, Math.min(Constants.MAX_ATTACK_TIME, attackTime));
        }

        return attackTime;
    }
}