import { AttributeComponent } from "../component/AttributeComponent";
import { ECSEntity } from "../ecs/ECSEntity";
import { ModifierFunction } from "../enum/ModifierFunction";
import { ModifierManager } from "../manager/ModifierManager";
import { AttributeCalculator } from "./AttributeCalculator";

export class MagicResistanceCalculator {
    private modifierManager: ModifierManager;
    private attributeCalculator: AttributeCalculator;
    constructor(modifierManager: ModifierManager) {
        this.modifierManager = modifierManager;
        this.attributeCalculator = new AttributeCalculator(this.modifierManager);
    }

    // 计算实体的最终魔法抗性 （带属性加成）
    calculateFinalMagicResistance(entity: ECSEntity,baseMagicalResistance: number,isIllusion?: boolean): number {

        const intelligence = entity.getComponent(AttributeComponent).getIntelligence();
        const attributeMagicalResistance = this.attributeCalculator.calculateFinalIntelligence(entity,intelligence)*0.001 // 假设每点智力提供0.1%的魔法抗性加成
        baseMagicalResistance += attributeMagicalResistance;

        // 应用基础魔法抗性降低
        const baseReduction = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BASE_REDUCTION);
        baseMagicalResistance += baseReduction;

        // 应用额外的魔法抗性加成
        let bonusResistance = this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS);

        // 如果是幻象，应用幻象特殊的魔法抗性加成
        if (isIllusion) {
            bonusResistance += this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS_ILLUSIONS);
        }

        // 计算最终魔法抗性
        let finalMagicalResistance = baseMagicalResistance + bonusResistance;

        // 确保魔法抗性在合理范围内（通常在-100%到100%之间）
        finalMagicalResistance = Math.max(-100, Math.min(100, finalMagicalResistance));

        return finalMagicalResistance;
    }



    // 计算实体的最终魔法抗性减免（带属性加成）
    calculateFinalMagicResistanceReduction(entity: ECSEntity,baseMagicalResistance: number,isIllusion?: boolean): number {
        // 计算基础魔法抗性
        let finalMagicalResistance = this.calculateFinalMagicResistance(entity,baseMagicalResistance,isIllusion);
        return  (1 - finalMagicalResistance/100);
    }
    
}
