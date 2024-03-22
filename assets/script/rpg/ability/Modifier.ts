import { Timer } from "../../core/common/time/Timer";
import { ECSEntity } from "../ecs/ECSEntity";
import { ModifierAttribute } from "../type/Modifier";


// 例如，你可能想要把 value 当做基础的变化值，intensity 用来增强或者削弱这个基础效果。在这个框架里，
// 可以用 value来表示基础速度或者基础伤害，然后 intensity 用来影响这个基础速度或者基础伤害的强度。
// 对应到上述移动速度减缓的例子，可以将value用作基础减速值，
// 然后用intensity来增强这个减速效果。例如，如果value是10，intensity是0.2
// ，那么移动速度减缓为基础速度的10%，然后再额外减缓20%，即最终减缓比例为12%(=10% + 10%*0.2)。

// import { ECSEntity } from "../ecs/ECSEntity";
// import { Modifier } from "./Modifier";

// export class BuffEffect {
//     public effectType: EffectType
//     public value: number
//     public intensity: number

//     // 新增一个属性保存应用的效果值
//     public effectAppliedValue: number = 0;

//     public applyEffect(entity: ECSEntity) {
//         if (this.effectType == EffectType.moveSpeedBonusPercentage) {
//             const movable = entity.getComponent(MovableComponent);
//             if (movable) {
//                 // 先减缓基础速度的百分比，再乘以强度
//                 this.effectAppliedValue = movable.speed * this.value * (1 + this.intensity);
//                 movable.speed -= this.effectAppliedValue;
//             }
//         }

//         // TODO: Handle other effect types...
//     }

//     public expireEffect(entity: ECSEntity) {
//         if (this.effectType == EffectType.moveSpeedBonusPercentage) {
//             const movable = entity.getComponent(MovableComponent);
//             if (movable) {
//                 // Restore the speed to its original value
//                 movable.speed += this.effectAppliedValue;
//                 this.effectAppliedValue = 0;
//             }
//         }

//         // TODO: Handle other effect expiration...
//     }
// }


// export enum BuffType {
//     BUFF = 0,
//     DEBUFF = 1
// }

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

// export enum EffectType {
//     moveSpeedBonusPercentage = 1,
//     critChanceIncrease = 2,
//     critMultiplierIncrease = 3,
//     //...
// }


export interface IModifierEffect {
    applyEffect(entity: ECSEntity): void 
    removeEffect(entity: ECSEntity): void 
}

export class Modifier {

    public id: string
    public duration: number
    public isHidden:boolean;//在状态界面中显示
    public isDebuff:boolean; //是否是减益效果
    public purgable: boolean; //可以被净化  被驱散
    
    public attribute :ModifierAttribute //可定义叠加类型
    protected timer:Timer

    effects:Array<IModifierEffect>; //效果列表
 
    constructor(duration:number) {
     this.duration = duration
    }
 
    // 更新方法，决定何时执行think
    // 只使用deltaTime参数
    public update(deltaTime: number): void {
        if(this.timer){
            this.timer.update(deltaTime)
        }
    }

    public StartIntervalThink(thinkInterval: number){
        if(!this.timer){
            this.timer = new Timer(thinkInterval)
            this.timer.callback = this.OnIntervalThink.bind(this)
        }
        this.timer.interval = thinkInterval
    }
 
    public OnIntervalThink(){

    }


    public applyModifier(entity: ECSEntity) {
        for (let effect of this.effects) {
            effect.applyEffect(entity);
        }
    }

    public removeModifier(entity: ECSEntity) {
        for (let effect of this.effects) {
            effect.removeEffect(entity);
        }
    }
 
 }