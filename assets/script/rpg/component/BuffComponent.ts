import { UnitTargetType } from "../type/Type";
import { ECSComponent } from "../ecs/ECSComponent";
import { ECSEntity } from "../ecs/ECSEntity";
import { MovableComponent } from "./MovableComponent";
import { Buff } from "../ability/Buff";



// 有很多种实现强度增益的方式，但是具体的实现方式取决于你的设计需求。以下是一些常见的方式：
// **直接相加：**强度每次增加一个固定的值。比如初次Buff为10%移动速度，强度为1，下一次Buff叠加后，强度增加固定值1变为2，移动速度变为(1+1) * 10% = 20%。
// **百分比增加：**强度以固定的百分比增加。比如初次Buff为10%移动速度，强度为1，下一次Buff叠加后，强度以固定的百分比增加，比如10%，那么移动速度则变为 1.1*10%=11%。
// **指数增加：**强度以给定值的指数增加。例如，初次Buff为10%移动速度，强度为1，下次Buff叠加后，比如让强度的增长为指数增长，设强度立方（或者其他幂），则移动速度为1^310% = 10%，下一次为2^310% = 80%。












// BuffComponent：用于存储附加到实体上的所有buff信息的组件。此组件可以存储buff列表，每个buff包括其持续时间、剩余时间、效果和可能的状态改变量等信息。

export class BuffComponent extends ECSComponent {
    public buffs: Buff[] = [];
}









