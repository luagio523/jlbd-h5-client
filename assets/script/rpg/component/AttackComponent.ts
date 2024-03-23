import { ECSComponent } from "../ecs/ECSComponent";
import { Attribute } from "../enum/Attribute";

export class AttackComponent extends ECSComponent{
    public attackCapability: string; //攻击类型 远程近战
    public baseAttackDamageMin: number;
    public baseAttackDamageMax: number;
    public attackRate: number; //攻击频率
    public attackRange: number; //攻击范围
    public target: any; // 这是攻击目标，可以根据需要的对象类型进行相应的修改
    public attacksMade: number; // 这是进行的攻击次数
    

   

  
    public bonusDamage: number = 0;//攻击加成
    calculateAttackDamage() {
        // 攻击伤害在最小伤害和最大伤害之间的一个随机值
        let baseDamage = this.baseAttackDamageMin + Math.random() * (this.baseAttackDamageMax - this.baseAttackDamageMin);
        // 返回总伤害
        return baseDamage;
    }

    // ...其他方法省略...
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