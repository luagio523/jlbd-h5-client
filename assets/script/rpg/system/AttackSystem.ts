import { AttackComponent } from "../component/AttackComponent";
import { AttributeComponent } from "../component/AttributeComponent";
import { BuffComponent } from "../component/BuffComponent";
import { DefenseComponent } from "../component/DefenseComponent";
import { EquipmentComponent } from "../component/EquipmentComponent";
import { ECSEntity } from "../ecs/ECSEntity";
import { Attribute } from "../enum/Attribute";
import { ModifierFunction } from "../enum/Modifier";
import { BaseSystem } from "./BaseSystem";

export class AttackSystem extends BaseSystem {

    attack(target: ECSEntity, damage: number): void {
        // // 模拟攻击动画
        // const animationState = target.getComponent<AnimationState>('animationState');
        // animationState.current = "attack";

        // // 执行掉血
        // const health = target.getComponent<Health>('health');
        // health.value -= damage;

        // console.log(`Attacked entity ${target.id}, new health is ${health.value}`);
    }

    update(): void {
        // // 更新所有实体的动画状态
        // this.entities.forEach(entity => {
        //     const animationState = entity.getComponent<AnimationState>('animationState');
        //     // 重置动画状态为默认值，例如 'idle'
        //     animationState.current = "idle";
        // });
    }


    //主要攻击力 = 基础攻击力 + 总主属性点 + 技能加成
    calculateAttackDamage(attackComponent: AttackComponent, attributeComponent: AttributeComponent, equipmentComponent: EquipmentComponent, buffComponent: BuffComponent): number {
        let baseAttackDamage = this.calculateBaseAttackDamage(attackComponent, equipmentComponent, buffComponent)
        let attributeAttackDamage = this.calculateAttributeAttackDamage(attributeComponent, equipmentComponent, buffComponent)
        let bonusAttackDamage = this.calculateBonusAttackDamage(equipmentComponent, buffComponent)

        let mainAttackDamage = baseAttackDamage + attributeAttackDamage + bonusAttackDamage //主要攻击伤害

        let mainAttackPercent = equipmentComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_DAMAGEOUTGOING_PERCENTAGE) +
            buffComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_DAMAGEOUTGOING_PERCENTAGE)
        mainAttackDamage = mainAttackDamage * (1 + mainAttackPercent)

        return mainAttackDamage
    }


    //计算基础攻击伤害 (白字攻击力)
    calculateBaseAttackDamage(attackComponent: AttackComponent, equipmentComponent: EquipmentComponent, buffComponent: BuffComponent): number {
        // 攻击伤害在最小伤害和最大伤害之间的一个随机值
        let baseAttack = attackComponent.baseAttackDamageMin + Math.random() * (attackComponent.baseAttackDamageMax - attackComponent.baseAttackDamageMin);
        baseAttack += equipmentComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_BASEATTACK_BONUSDAMAGE)
        baseAttack += buffComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_BASEATTACK_BONUSDAMAGE)


        let baseAttackPercent = equipmentComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_BASEDAMAGEOUTGOING_PERCENTAGE) +
            buffComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_BASEDAMAGEOUTGOING_PERCENTAGE)

        // 返回总伤害
        return baseAttack * (1 + baseAttackPercent);
    }

    //计算属性攻击力伤害
    calculateAttributeAttackDamage(attributeComponent: AttributeComponent, equipmentComponent: EquipmentComponent, buffComponent: BuffComponent): number {
        let damage = 0
        switch (attributeComponent.attributePrimary) {
            case Attribute.ATTRIBUTE_STRENGTH:
                damage = attributeComponent.baseStrength +
                    equipmentComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_STATS_STRENGTH_BONUS) +
                    buffComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_STATS_STRENGTH_BONUS);
            case Attribute.ATTRIBUTE_AGILITY:
                damage = attributeComponent.baseAgility +
                    equipmentComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_STATS_AGILITY_BONUS) +
                    buffComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_STATS_AGILITY_BONUS);
            case Attribute.ATTRIBUTE_INTELLECT:
                damage = attributeComponent.baseIntelligence +
                    equipmentComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_STATS_INTELLECT_BONUS) +
                    buffComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_STATS_INTELLECT_BONUS);
            default:
                damage = 0; // 如果主属性未定义，返回0
        }
        return damage
    }

    //计算攻击力加成伤害(绿字攻击力)
    calculateBonusAttackDamage(equipmentComponent: EquipmentComponent, buffComponent: BuffComponent): number {
        let bonusAttack = equipmentComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE)
        bonusAttack += buffComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE)

        let bonusAttackPercent = equipmentComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_BONUSDAMAGEOUTGOING_PERCENTAGE) +
            buffComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_BONUSDAMAGEOUTGOING_PERCENTAGE)

        return bonusAttack * (1 + bonusAttackPercent)
    }


    //计算主要护甲 主要护甲 = 基础护甲 + 敏捷属性护甲 + 技能加成
    calculateArmor(defenseComponent: DefenseComponent, attributeComponent: AttributeComponent, equipmentComponent: EquipmentComponent, buffComponent: BuffComponent): number {
        let baseArmor = this.calculateBaseArmor(defenseComponent, equipmentComponent, buffComponent)
        let attributeArmor = this.calculateAttributeArmor(attributeComponent, equipmentComponent, buffComponent)
        let bonusArmor = this.calculateBonusArmor(equipmentComponent, buffComponent)

        let mainArmor = baseArmor + attributeArmor + bonusArmor

        let mainArmorPercent = equipmentComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_TOTAL_PERCENTAGE) +
        buffComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_TOTAL_PERCENTAGE)

        return mainArmor *(1+mainArmorPercent)
    }

    //计算基础护甲
    calculateBaseArmor(defenseComponent: DefenseComponent, equipmentComponent: EquipmentComponent, buffComponent: BuffComponent): number {
        let baseArmor = defenseComponent.armorPhysical
        let baseArmorPercent = equipmentComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BASE_PERCENTAGE) +
            buffComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BASE_PERCENTAGE)
        return baseArmor * (1 + baseArmorPercent)
    }

    //敏捷护甲
    calculateAttributeArmor(attributeComponent: AttributeComponent, equipmentComponent: EquipmentComponent, buffComponent: BuffComponent): number {
        let baseAgility = attributeComponent.baseAgility +
            equipmentComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_STATS_AGILITY_BONUS) +
            buffComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_STATS_AGILITY_BONUS);
        return baseAgility / 6
    }

    //计算额外护甲
    calculateBonusArmor(equipmentComponent: EquipmentComponent, buffComponent: BuffComponent): number {
        let bonusArmor = equipmentComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS)
        bonusArmor += buffComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS)
        return bonusArmor
    }


    //         // 用DOTA2的护甲计算公式计算伤害减免系数
    //         let damageMultiplier = 1 - 0.06 * defender.armorPhysical / (1 + 0.06 * Math.abs(defender.armorPhysical));

    // 攻击力 * (1 - ((0.06 * 护甲) / (1 + 0.06 * 护甲)))
}


// 物理伤害 是由攻击伤害决定的，会受到目标单位 护甲 的影响。护甲越多，物理伤害越少。护甲的种类和值可以从目标单位的装备、技能或其他修饰符中获取。
// 魔法伤害 是由单位的技能决定的，会受到目标单位 魔法抗性 的影响。魔法抗性越高，受到的魔法伤害就越少。单位的魔法抗性可以从目标单位的天赋、技能或其他修饰符中获取。
// 纯粹伤害 既不受护甲影响也不受魔法抗性影响。直接对目标单位造成伤害。






// 实体（Entity）是组件（Component）的容器，相当于一个标识或者ID，它本身没有实际的功能或者数据。
// 组件（Component）则包含数据，但不包含逻辑。例如位置、速度、健康值等。
// 系统（System）管理逻辑和行为，它会遍历拥有特定组件的实体来执行游戏逻辑。

// // 创建主角实体并添加组件
// const hero = new Entity();
// hero.id = 'hero';
// hero.addComponent('position', new Position());
// hero.addComponent('health', new Health());
// hero.addComponent('animationState', new AnimationState());

// // 定义系统，并添加到游戏系统列表中
// const entities = [hero]; // 此处仅以单个英雄为例
// const attackSystem = new AttackSystem(entities);

// // 假设这是响应一个点击事件的函数
// function onClickAttack(target: Entity): void {
//     attackSystem.attack(target, 10); // 假设每次攻击扣除10点血
// }

// // 游戏的主循环
// function gameLoop(): void {
//     // 在这里我们会调用所有系统的更新方法
//     attackSystem.update();

//     // 更多的游戏逻辑...

//     requestAnimationFrame(gameLoop);
// }

// // 开始游戏循环
// gameLoop();

// // 当玩家点击攻击按钮时调用
// onClickAttack(hero);