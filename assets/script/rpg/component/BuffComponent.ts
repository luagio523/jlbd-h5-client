import { ECSComponent } from "../ecs/ECSComponent";




export class BuffEffect {
    public critChanceIncrease:number  //暴击概率增加多少
    public critMultiplierIncrease:number //暴击倍数增加多少
}

export class Buff {
    constructor(
        public id: string,
        public type: string,
        public intensity: number,
        public duration: number,
        public effect:BuffEffect,
        // 其他buff属性
    ) {}
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