import { AttributeComponent } from "../component/AttributeComponent";
import { ECSEntity } from "../ecs/ECSEntity";
import { ModifierFunction } from "../enum/ModifierFunction";
import { ModifierManager } from "../manager/ModifierManager";
import { AttributeCalculator } from "./AttributeCalculator";
const ARMOR_CONSTANT = 0.06;
const ARMOR_CONSTANT_PLUS_ONE = 1 + ARMOR_CONSTANT;
// ArmorCalculator.ts
export class ArmorCalculator {
    private modifierManager: ModifierManager;
    private attributeCalculator: AttributeCalculator;
    constructor(modifierManager: ModifierManager) {
        this.modifierManager = modifierManager;
        this.attributeCalculator = new AttributeCalculator(this.modifierManager);
    }

    // 计算实体的最终护甲值
    calculateFinalArmor(entity: ECSEntity,baseArmor: number): number {
        const agility = entity.getComponent(AttributeComponent).getAgility();
        const attributeArmor = this.attributeCalculator.calculateFinalAgility(entity,agility)*0.6 // 每点敏捷可以增加6%的护甲
        baseArmor += attributeArmor;

        const baseArmorPercentage = 1 + this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BASE_PERCENTAGE) / 100;
        baseArmor *= baseArmorPercentage;
        const bonusArmor = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS);
        // 计算总物理护甲
        let totalArmor = baseArmor + bonusArmor;

        const armorPercentage = 1 + this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_TOTAL_PERCENTAGE) / 100;
        return totalArmor * armorPercentage;
    }

    calculateFinalArmorReduction(entity: ECSEntity,baseArmor: number): number {
        let armor = this.calculateFinalArmor(entity,baseArmor);
        return ARMOR_CONSTANT_PLUS_ONE / (ARMOR_CONSTANT_PLUS_ONE + ARMOR_CONSTANT * armor);
    }







}