import { BaseAbility } from "../ability/BaseAbility";
import { ECSEntity } from "../ecs/ECSEntity";
import { ActType } from "../enum/Act";
import { DamageFlag, DamageType } from "../enum/Damage";
import { AttackType } from "../enum/Type";

export interface IEvent {
    type: string;
}



/**
 * ecsclass() 装饰器为 class 添加有效的 name 属性
 *
 * @param name
 */
export function ecsclass(name: string) {
    return (ctor: Function) => {
        Object.defineProperty(ctor, "name", {
            value: name,
            writable: false,
        });
    };
}



// export class AttackEvent implements IEvent {
//     static readonly NAME = 'AttackEvent';
//     public readonly type = AttackEvent.NAME
//     constructor(
//         public readonly attacker: ECSEntity,
//         public readonly target: ECSEntity,
//         public readonly damage: number,
//         public readonly attackType: string
//     ) {}
// }



export class ApplyDamageEvent implements IEvent{
    public readonly type = Event.ApplyDamage
    constructor(
        public readonly attacker: ECSEntity,
        public readonly victim: ECSEntity,
        public readonly damage: number,
        public readonly damageType: DamageType,
        public readonly ability?:BaseAbility,
        public readonly damageFlag?:DamageFlag,
    ) {}
}


export class AttackEvent implements IEvent{
    public readonly type = Event.ApplyDamage
    constructor(
        public readonly attacker: ECSEntity,
        public readonly victim: ECSEntity,
    ) {}
}


// 假设的 DelayedEvent 类，用于延迟执行事件
export class DelayedEvent implements IEvent {
    public readonly type = Event.Delayed
    constructor(
        public readonly  callback: () => void,
        public readonly  delay: number
    ) {}
}

export class AnimationEvent implements IEvent {
    public readonly type = Event.Animation
    constructor(
        public readonly  attacker: ECSEntity,
        public readonly  act: ActType,
    ) {}
}


export class ProjectileEvent implements IEvent {
    public readonly type = Event.Projectile
    constructor(
        public readonly  attacker: ECSEntity,
        public readonly  target: ECSEntity,
    ) {}
}



export class CastAbilityEvent implements IEvent {
    public readonly type = Event.AbilityStart
    constructor(
        public readonly  caster: ECSEntity,
        public readonly  ability: BaseAbility,
    ) {}
}



export class AbilityPhaseStartEvent implements IEvent {
    public readonly type = Event.AbilityPhaseStart
    constructor(
        public readonly  caster: ECSEntity,
        public readonly  ability: BaseAbility,
    ) {}
}

export class AbilityPhaseInterruptedEvent implements IEvent {
    public readonly type = Event.AbilityPhaseInterrupted
    constructor(
        public readonly  caster: ECSEntity,
        public readonly  ability: BaseAbility,
    ) {}
}



export class AbilityStartEvent implements IEvent {
    public readonly type = Event.AbilityStart
    constructor(
        public readonly  caster: ECSEntity,
        public readonly  ability: BaseAbility,
    ) {}
}

export class AbilityEndEvent implements IEvent {
    public readonly type = Event.AbilityEnd
    constructor(
        public readonly  caster: ECSEntity,
        public readonly  ability: BaseAbility,
    ) {}
}





export class EnterMapEvent implements IEvent {
    public readonly type = Event.EnterMap
    constructor(
    ) {}
}




export  enum  Event {
    ApplyAttack = "ApplyAttack",
    ApplyDamage = "ApplyDamage",
    Delayed = "Delayed",
    Animation = "Animation",
    Projectile = "Projectile",

    AbilityPhaseStart = "AbilityPhaseStart",
    AbilityPhaseInterrupted = "AbilityPhaseInterrupted",
    CastAbility = "CastAbility",
    AbilityStart = "AbilityStart",
    AbilityEnd = "AbilityEnd",

    EnterMap = "EnterMap",
}