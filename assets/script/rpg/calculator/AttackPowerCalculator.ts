import { AttackComponent } from "../component/AttackComponent";
import { AttributeComponent } from "../component/AttributeComponent";
import { ECSEntity } from "../ecs/ECSEntity";
import { ModifierFunction } from "../enum/ModifierFunction";
import { Attributes } from "../enum/Type";
import { ModifierManager } from "../manager/ModifierManager";
import { AttributeCalculator } from "./AttributeCalculator";

export class AttackPowerCalculator {
    private modifierManager: ModifierManager;
    private attributeCalculator: AttributeCalculator;
    constructor(modifierManager: ModifierManager) {
        this.modifierManager = modifierManager;
        this.attributeCalculator = new AttributeCalculator(modifierManager);
    }

     // 计算白字攻击力
     //白字攻击力 = 初始攻击力 + (力量值 × 1) + 等级成长攻击力 + MODIFIER_PROPERTY_BASEATTACK_BONUSDAMAGE
    public calculateFinalBaseAttackPower(entity: ECSEntity): number {
        // 获取基础攻击力
        let baseAttackPower = this.calculateBaseAttackPower(entity);
    
        // 加上属性带来的攻击力
        baseAttackPower += this.calculateAttributeAttackPower(entity);
    
        // 加上基础攻击力加成
        baseAttackPower += this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_BASEATTACK_BONUSDAMAGE);
    
        // // 应用基础攻击力百分比加成
        // const baseAttackPercentage = 1 + this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_BASEDAMAGEOUTGOING_PERCENTAGE) / 100;
        // baseAttackPower *= baseAttackPercentage;
    
        // 向下取整并返回最终结果
        return Math.floor(baseAttackPower);
    }


    // 计算绿字攻击力 额外加成
    public calculateFinalBonusAttackPower(entity: ECSEntity): number {
        let bonusAttackPower = 0;
        bonusAttackPower += this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE);
        // 可能还有其他来源的绿字攻击力，根据需要添加
        return Math.floor(bonusAttackPower);
    }


    private calculateBaseAttackPower(entity: ECSEntity): number {
        let baseAttackDamage = 0;
        const attackComponent = entity.getComponent(AttackComponent);
        if (attackComponent) {
            baseAttackDamage = attackComponent.getBaseAttackDamage();
        }
        return baseAttackDamage;
    }

    //属性攻击力
    private calculateAttributeAttackPower(entity: ECSEntity): number {
        const attributeComponent = entity.getComponent(AttributeComponent);
        const primaryAttribute = attributeComponent.getPrimaryAttribute();

        switch (primaryAttribute) {
            case Attributes.ATTRIBUTE_STRENGTH:
                return this.attributeCalculator.calculateFinalStrength(entity);
            case Attributes.ATTRIBUTE_AGILITY:
                return this.attributeCalculator.calculateFinalAgility(entity);
            case Attributes.ATTRIBUTE_INTELLECT:
                return this.attributeCalculator.calculateFinalIntelligence(entity);
            default:
                return 0;
        }
        
    }
   
}