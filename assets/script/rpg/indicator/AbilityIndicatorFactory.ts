import { BaseAbility } from "../ability/BaseAbility";
import { AbilityBehavior } from "../enum/Type";
import { AbilityIndicator, DefaultAbilityIndicator, NoTargetAbilityIndicator, PassiveAbilityIndicator, ToggleAbilityIndicator, UnitTargetAbilityIndicator } from "./AbilityIndicator";
import { PointTargetAbilityIndicator } from "./TargetPointAbilityIndicator";

export class AbilityIndicatorFactory {
    static createIndicator(ability: BaseAbility): AbilityIndicator {
        const behavior = ability.GetBehavior();
        
        if (behavior & AbilityBehavior.ABILITY_BEHAVIOR_POINT) {
            return new PointTargetAbilityIndicator(ability);
        } else if (behavior & AbilityBehavior.ABILITY_BEHAVIOR_UNIT_TARGET) {
            return new UnitTargetAbilityIndicator(ability);
        } else if (behavior & AbilityBehavior.ABILITY_BEHAVIOR_NO_TARGET) {
            return new NoTargetAbilityIndicator(ability);
        } else if (behavior & AbilityBehavior.ABILITY_BEHAVIOR_TOGGLE) {
            return new ToggleAbilityIndicator(ability);
        } else if (behavior & AbilityBehavior.ABILITY_BEHAVIOR_PASSIVE) {
            return new PassiveAbilityIndicator(ability);
        } else {
            return new DefaultAbilityIndicator(ability);
        }
    }
}