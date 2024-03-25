import { Cooldown } from "../base/CoolDown";
import { ECSComponent } from "../ecs/ECSComponent";
import { ECSEntity } from "../ecs/ECSEntity";
import { AttackCapability, AttackType } from "../enum/Type";


// 在Dota2中，一个单位的实际攻击间隔由几个因素决定，包括基础攻击时间 (BAT)，附加的攻击速度，以及游戏的内部机制。下面是一般的计算公式：
// plaintext
// 实际攻击间隔 = 基础攻击时间 / (1 + 攻击速度加成)
// 基础攻击时间（BAT）是单位进行两次攻击之间的基础时间间隔。例如，大多数单位的BAT为1.7秒。不同的英雄有不同的BAT。这个值固定，无法通过任何方式修改。
// 攻击速度加成是通过物品，技能，属性等获得的额外攻击速度，除以100。例如，如果一个单位有150额外攻击速度，那么攻击速度加成就是1.5。
// 这公式表示: 英雄的攻击间隔 = 英雄的基础攻击时间 ÷ [1 + (单位的主属性-1) × 0.01]。所以，如果你要提高英雄的攻击速度（降低攻击间隔），你需要增加他的攻击速度加成。



//普通攻击组件
export class AttackComponent extends ECSComponent{
    public attackCapability: AttackCapability; //攻击类型 远程近战
    public baseAttackDamageMin: number;
    public baseAttackDamageMax: number;
    
    public attackRange: number; //攻击范围
    public target: ECSEntity; // 这是攻击目标，可以根据需要的对象类型进行相应的修改

    public attackRate: number; //基础攻击间隔               // 实际攻击间隔 = 基础攻击间隔 / (攻击速度 / 100)
    public attacksMade: number; // 这是进行的攻击次数

    public attackAnimationPoint:number; //动画的时间点
    public attackAcquisitionRange:number;
    

    public attackType:AttackType   //攻击类型


    constructor(attackRate:number) { 
        super()
        this.attackCooldown = new Cooldown(attackRate);
    }



    /** 攻击冷却 */
    private attackCooldown: Cooldown;;
    
    /**
     * @param deltaTime
     * @returns boolean 是否可以攻击
     */
    canAttack(deltaTime: number): boolean {
        return this.attackCooldown.check(deltaTime);
    }

    updateAttackRate(attackRate:number):void{
        this.attackCooldown.resetCooldownRate(attackRate)
    }

}


//基础攻击力 + 属性攻击力  + 装备 + 技能buff



// 装备通常提供两种类型的攻击力增益：
// 基础攻击力的增加：这种类型的增加极其罕见，目前在游戏中并没有装备直接增加基础攻击力。
// 额外攻击力的增加（通常显示为绿色数字）：这是装备最常见的攻击力增益类型。它被添加到英雄从主属性和其他来源获得的基础攻击力之上。额外攻击力的增益不会由于主属性的提升而改变。



// class AttackSystem {
//     calculateAttackDamage(attacker: AttackComponent, defender: BaseStatsComponent, equipmentBonus: number, attributeBonus: number, skillBonus: number) {
//         let baseDamage = attacker.baseAttackDamageMin + Math.random() * (attacker.baseAttackDamageMax - attacker.baseAttackDamageMin);
//         let totalUnmitigatedDamage = baseDamage + attacker.bonusDamage + equipmentBonus + attributeBonus + skillBonus;

//         // 用DOTA2的护甲计算公式计算伤害减免系数
//         let damageMultiplier = 1 - 0.06 * defender.armorPhysical / (1 + 0.06 * Math.abs(defender.armorPhysical));

//         // 返回实际伤害
//         return totalUnmitigatedDamage * damageMultiplier;
//     }
// }





// struct DefenseComponent {
//     int armor;
//     // 可能还有其他防御属性，如魔法抗性等
// };

// // 这个函数用于根据护甲值计算最终的物理伤害减免
// float calculatePhysicalDamageReduction(int armor) {
//     // 一个简化的减伤公式：物理减伤百分比 = 护甲 / (护甲 + 100)
//     // 真实的游戏可能使用更复杂的减伤计算方式
//     return armor / (float)(armor + 100);
// }



// struct AttackComponent {
//     int physicalDamage;
//     int magicalDamage;
//     int pureDamage;
// };

// int calculateTotalDamage(ECSEntity attacker, ECSEntity target) {
//     AttackComponent attackComp = attacker.getComponent(AttackComponent);
//     int totalPhysicalDamage = attackComp.physicalDamage;
//     int totalMagicalDamage = attackComp.magicalDamage;
//     int totalPureDamage = attackComp.pureDamage;

//     // 处理Buff和Debuff效果
//     // 这里省略了处理护甲和魔法抗性的细节
//     for (BuffEffect effect : attacker.getComponent(BuffComponent).buffEffects) {
//         switch (effect.effectType) {
//             case EffectType.AdditionalPhysicalDamage:
//                 totalPhysicalDamage += effect.value; // 额外的物理伤害
//                 break;
//             case EffectType.AdditionalMagicalDamage:
//                 totalMagicalDamage += effect.value; // 额外的魔法伤害
//                 break;
//             // 添加其他Buff效果的处理...
//         }
//     }

//     // 应用Debuff
//     for (BuffEffect effect : attacker.getComponent(BuffComponent).debuffEffects) {
//         switch (effect.effectType) {
//             case EffectType.FixedPureDamage:
//                 // 固定纯粹伤害可能覆盖其他所有伤害
//                 return effect.value; // 直接返回这个固定的伤害值
//             // 添加其他Debuff效果的处理...
//         }
//     }

//     // 最终伤害是所有类型的伤害加总，每种伤害都需要考虑目标的抗性因素
//     // 这里假设目标无抗性，直接加总所有伤害
//     int finalDamage = totalPhysicalDamage + totalMagicalDamage + totalPureDamage;

//     return finalDamage;
// }


// int calculateFinalPhysicalDamage(int rawPhysicalDamage, int targetArmor) {
//     float damageReduction = calculatePhysicalDamageReduction(targetArmor);
//     int finalPhysicalDamage = (int)(rawPhysicalDamage * (1 - damageReduction));
//     return finalPhysicalDamage;
// }

// int calculateTotalDamage(ECSEntity attacker, ECSEntity target) {
//     AttackComponent attackComp = attacker.getComponent(AttackComponent);
//     int totalPhysicalDamage = attackComp.physicalDamage;
//     int totalMagicalDamage = attackComp.magicalDamage;
//     int totalPureDamage = attackComp.pureDamage;

//     DefenseComponent defenseComp = target.getComponent(DefenseComponent);
//     int targetArmor = defenseComp.armor;

//     // 处理Buff和Debuff效果
//     for (BuffEffect effect : attacker.getComponent(BuffComponent).buffEffects) {
//         // ...之前的代码处理魔法和纯粹伤害的Buff
//     }

//     // 应用Debuff
//     for (BuffEffect effect : attacker.getComponent(BuffComponent).debuffEffects) {
//         // ...之前的代码处理固定纯粹伤害Debuff
//     }

//     // 对物理伤害应用护甲减伤
//     totalPhysicalDamage = calculateFinalPhysicalDamage(totalPhysicalDamage, targetArmor);

//     // ...之前的代码计算总伤害
//     int finalDamage = totalPhysicalDamage + totalMagicalDamage + totalPureDamage;

//     return finalDamage;
// }