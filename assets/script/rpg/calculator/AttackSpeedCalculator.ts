import { ECSEntity } from "../ecs/ECSEntity";
import { ModifierFunction } from "../enum/ModifierFunction";
import { ModifierManager } from "../manager/ModifierManager";


export class AttackSpeedCalculator {
    private modifierManager: ModifierManager;

    constructor(modifierManager: ModifierManager) {
        this.modifierManager = modifierManager;
    }

    // 计算最终攻击速度
    calculateFinalAttackSpeed(entity: ECSEntity, baseAttackTime: number): number {
        // 计算基础攻击时间 (BAT)
        let finalBAT = this.calculateBAT(entity, baseAttackTime);

        // 计算攻击速度
        let attackSpeed = this.calculateAttackSpeed(entity);

        // 计算攻击时间
        let attackTime = finalBAT / attackSpeed;

        // 应用攻击速度限制
        attackTime = this.applyAttackSpeedLimits(entity, attackTime);

        // 将攻击时间转换为每秒攻击次数
        return 1 / attackTime;
    }

    // 计算基础攻击时间 (BAT)
    private calculateBAT(entity: ECSEntity, baseAttackTime: number): number {
        let bat = baseAttackTime;

        // 应用 BAT 常数修改器
        let batConstant = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_BASE_ATTACK_TIME_CONSTANT);
        if (batConstant > 0) {
            bat = batConstant;
        }

        // 应用 BAT 调整
        let batAdjust = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_BASE_ATTACK_TIME_CONSTANT_ADJUST);
        bat += batAdjust;

        // 应用 BAT 百分比修改器
        let batPercentage = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_BASE_ATTACK_TIME_PERCENTAGE);
        bat *= (1 + batPercentage / 100);

        return bat;
    }

    // 计算攻击速度
    private calculateAttackSpeed(entity: ECSEntity): number {
        let attackSpeed = 100; // 基础攻击速度为 100

        // 检查攻击速度基础覆盖
        let baseOverride = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_ATTACKSPEED_BASE_OVERRIDE);
        if (baseOverride > 0) {
            attackSpeed = baseOverride;
        }

        // 应用常数加成
        attackSpeed += this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT);

        // 检查固定攻击率
        let fixedRate = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_FIXED_ATTACK_RATE);
        if (fixedRate > 0) {
            return 100 / fixedRate; // 将固定攻击率转换为攻击速度
        }

        return attackSpeed;
    }

    // 应用攻击速度限制
    private applyAttackSpeedLimits(entity: ECSEntity, attackTime: number): number {
        const minAttackTime = 0.25; // 最大 4 次每秒攻击
        const maxAttackTime = 2.5;  // 最小 0.4 次每秒攻击

        // 检查是否忽略攻击速度限制
        let ignoreLimit = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_IGNORE_ATTACKSPEED_LIMIT);
        if (!ignoreLimit) {
            attackTime = Math.max(minAttackTime, Math.min(maxAttackTime, attackTime));
        }

        return attackTime;
    }
}