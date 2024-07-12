import { ECSEntity } from "../ecs/ECSEntity";
import { ModifierAttribute } from "../enum/Modifier";
import { UnitTargetFlag, UnitTargetTeam, UnitTargetType } from "../enum/Unit";
import { Modifier } from "./Modifier";
 // Aura类继承自Modifier
 export abstract class AuraModifier extends Modifier {
    constructor(
        id: string,
        duration: number = Infinity,
        isHidden: boolean = false,
        isDebuff: boolean = false,
        purgable: boolean = false,
        priority: number = 0,
        attribute: ModifierAttribute = ModifierAttribute.MODIFIER_ATTRIBUTE_NONE,
        public auraRadius: number = 900
    ) {
        super(id, duration, isHidden, isDebuff, purgable, priority, attribute);
    }

    public isAura(): boolean { return true; }
    public abstract createAuraEffect(target: ECSEntity): Modifier | null;
    public getAuraRadius(): number { return this.auraRadius; }
    public abstract shouldApplyToTarget(target: ECSEntity): boolean;

    // 新增：获取光环效果的唯一标识符
    public abstract getAuraEffectId(): string;

    // 新增：应用光环效果的抽象方法
    public abstract applyAuraEffect(): void;

    // 新增：移除光环效果的抽象方法
    public abstract removeAuraEffect(): void;
}




// -- 让光环自身也有视觉效果（比如光环发光或有某种特定标志）
// function modifier_custom_aura:GetEffectAttachType()
//     return PATTACH_ABSORIGIN_FOLLOW
// end


// function modifier_alchemist_acid_spray_lua:GetEffectName()
// 	return "particles/units/heroes/hero_alchemist/alchemist_acid_spray_debuff.vpcf"
// end

// function modifier_alchemist_acid_spray_lua:GetEffectAttachType()
// 	return PATTACH_ABSORIGIN_FOLLOW
// end