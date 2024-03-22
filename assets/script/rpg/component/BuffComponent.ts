import { ECSComponent } from "../ecs/ECSComponent";
import { Buff } from "../ability/Buff";





// BuffComponent：用于存储附加到实体上的所有buff信息的组件。此组件可以存储buff列表，每个buff包括其持续时间、剩余时间、效果和可能的状态改变量等信息。

export class BuffComponent extends ECSComponent {
    public buffs: Buff[] = [];
}









