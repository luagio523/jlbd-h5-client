import { UnitTargetType } from "../type/Type";
import { ECSComponent } from "../ecs/ECSComponent";
import { ECSEntity } from "../ecs/ECSEntity";
import { MovableComponent } from "./MovableComponent";

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


// 有很多种实现强度增益的方式，但是具体的实现方式取决于你的设计需求。以下是一些常见的方式：
// **直接相加：**强度每次增加一个固定的值。比如初次Buff为10%移动速度，强度为1，下一次Buff叠加后，强度增加固定值1变为2，移动速度变为(1+1) * 10% = 20%。
// **百分比增加：**强度以固定的百分比增加。比如初次Buff为10%移动速度，强度为1，下一次Buff叠加后，强度以固定的百分比增加，比如10%，那么移动速度则变为 1.1*10%=11%。
// **指数增加：**强度以给定值的指数增加。例如，初次Buff为10%移动速度，强度为1，下次Buff叠加后，比如让强度的增长为指数增长，设强度立方（或者其他幂），则移动速度为1^310% = 10%，下一次为2^310% = 80%。


export enum BuffType {
    BUFF = 0,
    DEBUFF = 1
}



export enum StackingStrategy {
    SIMPLE, // 简单叠加
    COMPOUND, // 复合叠加
    // 可能的其他规则...
}


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


// 例如，你可能想要把 value 当做基础的变化值，intensity 用来增强或者削弱这个基础效果。在这个框架里，
// 可以用 value来表示基础速度或者基础伤害，然后 intensity 用来影响这个基础速度或者基础伤害的强度。
// 对应到上述移动速度减缓的例子，可以将value用作基础减速值，
// 然后用intensity来增强这个减速效果。例如，如果value是10，intensity是0.2
// ，那么移动速度减缓为基础速度的10%，然后再额外减缓20%，即最终减缓比例为12%(=10% + 10%*0.2)。

export class BuffEffect {
    public effectType: EffectType
    public value: number
    public intensity: number

    // 新增一个属性保存应用的效果值
    public effectAppliedValue: number = 0;

    public applyEffect(entity: ECSEntity) {
        if (this.effectType == EffectType.moveSpeedBonusPercentage) {
            const movable = entity.getComponent(MovableComponent);
            if (movable) {
                // 先减缓基础速度的百分比，再乘以强度
                this.effectAppliedValue = movable.speed * this.value * (1 + this.intensity);
                movable.speed -= this.effectAppliedValue;
            }
        }

        // TODO: Handle other effect types...
    }

    public expireEffect(entity: ECSEntity) {
        if (this.effectType == EffectType.moveSpeedBonusPercentage) {
            const movable = entity.getComponent(MovableComponent);
            if (movable) {
                // Restore the speed to its original value
                movable.speed += this.effectAppliedValue;
                this.effectAppliedValue = 0;
            }
        }

        // TODO: Handle other effect expiration...
    }
}






export class Buff {
    public id: string
    public stackable: boolean;
    public stackLimit?: number;
    public stackingStrategy?: StackingStrategy;
    public duration: number
    public buffType: BuffType
    public refreshable: boolean;
    public removable: boolean;
    public source: ECSEntity | null;
    public purgable: boolean;

    // 新增一个buff效果数组
    public buffEffects: BuffEffect[];

    public applyModifier(entity: ECSEntity, buff: Buff) {
        // 在这之前的代码保持不变

        // 对于 buffEffects 中的每一个效果，都调用它的 applyEffect 方法
        for (let effect of this.buffEffects) {
            effect.applyEffect(entity);
        }
    };

    public expirationModifier(entity: ECSEntity, buff: Buff) {
        // 在这之前的代码保持不变

        // 对于 buffEffects 中的每一个效果，都调用它的 expireEffect 方法
        for (let effect of this.buffEffects) {
            effect.expireEffect(entity);
        }
    };



      // 新增一个处理光环效果的方法，找出并更新光环所影响的实体
      public updateAuraTargets(auraHolderEntity: ECSEntity, entities: ECSEntity[]) {
        for (let aura of this.auras ?? []) {
            entities.forEach((entity) => {
                const distance = this.calculateDistance(auraHolderEntity, entity);
                if (this.shouldAffect(entity, aura.affects) && distance <= aura.range) {
                    aura.applyAura(entity);
                } else {
                    aura.removeAura(entity);
                }
            });
        }
    }

    private calculateDistance(sourceEntity: ECSEntity, targetEntity: ECSEntity): number {
        // 实现计算两个实体间的距离的方法
        // 这通常需要访问Transform组件或位置信息
    }

    private shouldAffect(targetEntity: ECSEntity, targetFilter: UnitTargetType): boolean {
        // 实现根据UnitTargetType确定目标是否应被光环影响的方法
        // 这可能涉及到检查实体的类型，所属队伍，是否存活等等
    }

    public auras?: {
        range: number;
        affects: UnitTargetType;
    };
}

// BuffComponent：用于存储附加到实体上的所有buff信息的组件。此组件可以存储buff列表，每个buff包括其持续时间、剩余时间、效果和可能的状态改变量等信息。

export class BuffComponent extends ECSComponent {
    public buffs: Buff[] = [];
}



// class Buff {
//     constructor(
//         public type: string,
//         public duration: number,
//         public effect: any, // 这个可以更具体，根据需要定义（例如增加的暴击率）
//     ) {}
// }






export class Buff {
    // ...其他属性和方法保持不变
 
    // 新增属性用于控制think的进行
    public thinking: boolean = true;
 
    // ...构造函数等不变
 
    // 更新方法，决定何时执行think
    public update(deltaTime: number, currentTime: number): void {
        if (this.thinking && currentTime >= this.nextThinkTime) {
            this.think();
            this.nextThinkTime = currentTime + this.thinkInterval;
        }
    }
 
    // 修改后的think方法
    public think() {
        // 在这里实现每个think周期需要执行的逻辑
    }
 
    // 新增方法用于开始思考逻辑
    public startThink() {
        this.thinking = true;
    }
 
    // 新增方法用于停止思考逻辑
    public stopThink() {
        this.thinking = false;
    }
 }






// 定义Aura类
export class Aura {
    public range: number;
    public affects: UnitTargetType;
    public auraEffects: AuraEffect[];

    constructor(range: number, affects: UnitTargetType, auraEffects: AuraEffect[]) {
        this.range = range;
        this.affects = affects;
        this.auraEffects = auraEffects;
    }

    // 应用光环效果方法
    public applyAura(targetEntity: ECSEntity): void {
        for (let effect of this.auraEffects) {
            effect.applyEffect(targetEntity);
        }
    }

    // 移除光环效果方法
    public removeAura(targetEntity: ECSEntity): void {
        for (let effect of this.auraEffects) {
            effect.removeEffect(targetEntity);
        }
    }
}

// 改造后的AuraComponent仅存储Aura实例
export class AuraComponent extends ECSComponent {
    public auras: Aura[] = [];
}

// AuraSystem：一个负责更新和处理光环效果的系统
export class AuraSystem {
    // 与BuffSystem类似，但专注于处理AuraComponent
    public update(deltaTime: number): void {
        // 更新逻辑，每帧执行或按需执行
        const entities = this.getAllEntitiesWithAura();

        for (const auraEntity of entities) {
            // …在这里实现光环更新逻辑
        }
    }
    
    private getAllEntitiesWithAura(): ECSEntity[] {
        // 获取所有拥有AuraComponent的实体
        return [];
    }

    // 其余助手方法，例如计算距离、判断目标是否应受影响等
}

// 更新BuffSystem，让其不再处理光环逻辑
export class BuffSystem {
    public update(deltaTime: number): void {
        // 更新逻辑，每帧执行或按需执行
        // 处理除了光环之外的buff/debuff效果
    }

    // 其余助手方法和逻辑
}









export class Modifier {
    // ...其他属性和方法保持不变
 
    public elapsed: number = 0; // 累积时间
    public thinkInterval: number; // 执行间隔
 
    constructor(thinkInterval: number) {
        this.thinkInterval = thinkInterval;
    }
 
    // 更新方法，决定何时执行think
    // 只使用deltaTime参数
    public update(deltaTime: number): void {
        this.elapsed += deltaTime; // 累积经过的时间
        if (this.elapsed >= this.thinkInterval) {
            this.think();
            this.elapsed -= this.thinkInterval; // 重置累积时间
        }
    }
 
    public think() {
        // 在这里实现每个think周期需要执行的逻辑
    }
 
    // startThink和stopThink方法依然可以按照之前的逻辑实现。
 }



 // Aura类继承自Modifier
export class Aura extends Modifier {
    public range: number;
    public affects: UnitTargetType;

    constructor(range: number, affects: UnitTargetType, thinkInterval: number) {
        super(thinkInterval);
        this.range = range;
        this.affects = affects;
    }
    
    public think() {
        // 实现Aura特有的周期性逻辑
        // 比如应用或更新范围内单位的Modifier
    }
    
    // 功能可能还包括对进入和离开光环范围单位的检测
    // ...

    // 其他Aura特有的属性或方法
}