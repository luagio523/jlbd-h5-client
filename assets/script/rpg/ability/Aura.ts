import { UnitTargetFlag, UnitTargetTeam, UnitTargetType } from "../enum/Unit";
import { Modifier } from "./Modifier";
 // Aura类继承自Modifier
export class Aura extends Modifier {
    public radius: number;
    public searchTargetType:UnitTargetType;
    public searchTargetTeam:UnitTargetTeam;
    public searchTargetFlag:UnitTargetFlag;

    public auraModifier:Modifier

   
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