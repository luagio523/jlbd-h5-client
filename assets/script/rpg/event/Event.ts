import { BaseAbility } from "../ability/BaseAbility";
import { ECSEntity } from "../ecs/ECSEntity";
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





export  enum  Event {
    ApplyDamage = "ApplyDamage",
}