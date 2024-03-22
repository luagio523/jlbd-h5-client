// 有很多种实现强度增益的方式，但是具体的实现方式取决于你的设计需求。以下是一些常见的方式：
// **直接相加：**强度每次增加一个固定的值。比如初次Buff为10%移动速度，强度为1，下一次Buff叠加后，强度增加固定值1变为2，移动速度变为(1+1) * 10% = 20%。
// **百分比增加：**强度以固定的百分比增加。比如初次Buff为10%移动速度，强度为1，下一次Buff叠加后，强度以固定的百分比增加，比如10%，那么移动速度则变为 1.1*10%=11%。
// **指数增加：**强度以给定值的指数增加。例如，初次Buff为10%移动速度，强度为1，下次Buff叠加后，比如让强度的增长为指数增长，设强度立方（或者其他幂），则移动速度为1^310% = 10%，下一次为2^310% = 80%。



// EffectWithIntensity：这个名字表达了这个结构体包含了一个效果和一个强度。
// BuffProperty：这个名字用了更通用的“属性”字样，可以代表各种不同的属性，比如移动速度奖励、暴击几率增加等。
// BuffParameter：表示构成 Buff 的重要参数。
// public healthRegenIncrease?: number;     // 增加的生命回复速度
//     public manaRegenIncrease?: number;       // 增加的法力回复速度
//     public damageIncrease?: number;          // 增加的伤害值
//     public armorIncrease?: number;           // 增加的护甲值
//     public magicResistanceIncrease?: number; // 增加的魔法抗性

export enum EffectType {
    moveSpeedBonusPercentage = 1,
    critChanceIncrease = 2,
    critMultiplierIncrease = 3,
    //...
}



interface AuraEffect {
    range: number;
    affects: UnitTargetType;
  
    applyAura(entity: ECSEntity): void;
    removeAura(entity: ECSEntity): void;
  }

  export class ArmorReducingAuraEffect implements AuraEffect {
    range: number;
    affects: "EnemyUnits" | "AllUnits"; // 根据游戏中的单位类型可能需要更改

    constructor(range: number, affects: UnitTargetType) {
        this.range = range;
        this.affects = affects;
    }

    applyAura(entity: ECSEntity): void {
        // 实现应用护甲降低效果的逻辑
        // 通常需要获取并改变护甲相关的组件或属性
    }

    removeAura(entity: ECSEntity): void {
        // 实现移除护甲降低效果的逻辑
        // 恢复实体的正常护甲值
    }
}

export enum StackingStrategy {
    SIMPLE, // 简单叠加
    COMPOUND, // 复合叠加
    // 可能的其他规则...
}