import { ECSComponent } from "../ecs/ECSComponent";

export class AttackComponent extends ECSComponent {
    public damage :number;

    public totalTime: number = 0; // 攻击的持续时间, 是由我们的攻击属性决定 90001, ---> 获取
    public calcTime: number = 0; // 计算伤害的时间
    public attackId: number = 0; // 当前攻击的Id,用于伤害计算
    public attackTarget: any = null!; // 玩家，怪物 
    public effectNode: Node = null!;
    public baseAttack: number = 10; // 根据等级从配置表里面计算的；基础+招数*加权



    public critMultiplier:number = 0 //（暴击倍数/暴击伤害）：当你的角色在游戏中进行暴击时，这就是决定暴击伤害的因素。是基础伤害的倍数值。例如，如果基础伤害是10，暴击倍数是2，则暴击伤害为20。

    public critChance:number = 0 //暴击概率 （暴击概率/暴击率）：这是你的角色在攻击时实现暴击的概率。举例来说，如果暴击概率是25%，那么平均说来，每四次攻击就有一次能够造成暴击。
}