import { Vec2 } from "cc";
import { BaseAbility } from "../ability/BaseAbility";
import { ECSEntity } from "../ecs/ECSEntity";
import { ActType } from "../enum/Act";
import { DamageFlag, DamageType } from "../enum/Damage";

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



export class ApplyDamageEvent implements IEvent {
    public readonly type = RPGEvent.ApplyDamage
    constructor(
        public readonly attacker: ECSEntity,
        public readonly victim: ECSEntity,
        public readonly damage: number,
        public readonly damageType: DamageType,
        public readonly ability?: BaseAbility,
        public readonly damageFlag?: DamageFlag,
    ) { }
}


export class AttackEvent implements IEvent {
    public readonly type = RPGEvent.ApplyDamage
    constructor(
        public readonly attacker: ECSEntity,
        public readonly victim: ECSEntity,
    ) { }
}


// 假设的 DelayedEvent 类，用于延迟执行事件
export class DelayedEvent implements IEvent {
    public readonly type = RPGEvent.Delayed
    constructor(
        public readonly callback: () => void,
        public readonly delay: number
    ) { }
}

export class AnimationEvent implements IEvent {
    public readonly type = RPGEvent.Animation
    constructor(
        public readonly attacker: ECSEntity,
        public readonly act: ActType,
    ) { }
}


export class ProjectileEvent implements IEvent {
    public readonly type = RPGEvent.Projectile
    constructor(
        public readonly attacker: ECSEntity,
        public readonly target: ECSEntity,
    ) { }
}



export class CastAbilityEvent implements IEvent {
    public readonly type = RPGEvent.AbilityStart
    constructor(
        public readonly caster: ECSEntity,
        public readonly ability: BaseAbility,
    ) { }
}



export class AbilityPhaseStartEvent implements IEvent {
    public readonly type = RPGEvent.AbilityPhaseStart
    constructor(
        public readonly caster: ECSEntity,
        public readonly ability: BaseAbility,
    ) { }
}

export class AbilityPhaseInterruptedEvent implements IEvent {
    public readonly type = RPGEvent.AbilityPhaseInterrupted
    constructor(
        public readonly caster: ECSEntity,
        public readonly ability: BaseAbility,
    ) { }
}



export class AbilityStartEvent implements IEvent {
    public readonly type = RPGEvent.AbilityStart
    constructor(
        public readonly caster: ECSEntity,
        public readonly ability: BaseAbility,
    ) { }
}

export class AbilityEndEvent implements IEvent {
    public readonly type = RPGEvent.AbilityEnd
    constructor(
        public readonly caster: ECSEntity,
        public readonly ability: BaseAbility,
    ) { }
}


export class InitedMapEvent implements IEvent {
    public readonly type = RPGEvent.InitedMapEvent
    constructor(

    ) { }
}


export class EnterMapEvent implements IEvent {
    public readonly type = RPGEvent.EnterMap
    constructor(
        public readonly mapId: string,
        public readonly lookAt: Vec2,
    ) { }
}



export class InitRoleEvent implements IEvent {
    public readonly type = RPGEvent.InitRoleEvent
    constructor(
        public readonly id: number,
        public readonly name: string,
    ) { }
}


export enum RPGEvent {
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
    InitedMapEvent = "InitedMapEvent",
    EnterMap = "EnterMap",

    InitRoleEvent ="InitRoleEvent",
}