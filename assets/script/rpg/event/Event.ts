import { ECSEntity } from "../ecs/ECSEntity";

export interface IEvent {
    type: string;
    data?: any;
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



export class AttackEvent implements IEvent {
    static readonly NAME = 'AttackEvent';
    public readonly type = AttackEvent.NAME
    constructor(
        public readonly attacker: ECSEntity,
        public readonly target: ECSEntity,
        public readonly damage: number,
        public readonly attackType: string
    ) {}
}

