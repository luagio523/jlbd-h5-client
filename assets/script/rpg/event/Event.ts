export interface IEvent {
    type: string;
    data?: any;
}

class Entity {
    // Entity 类的实现；为了示例，保持简单
}

export class AttackEvent implements IEvent {
    public readonly type = 'AttackEvent';

    constructor(
        public readonly attacker: Entity,
        public readonly target: Entity,
        public readonly damage: number,
        public readonly attackType: string
    ) {}
}