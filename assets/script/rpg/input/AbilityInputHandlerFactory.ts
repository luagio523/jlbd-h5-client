import { BaseAbility } from "../ability/BaseAbility";
import { AbilityBehavior } from "../enum/Type";
import { AbilityInputHandler, DefaultAbilityInputHandler, NoTargetAbilityInputHandler, PassiveAbilityInputHandler, ToggleAbilityInputHandler, UnitTargetAbilityInputHandler } from "./AbilityInputHandler";
import { PointTargetAbilityInputHandler } from "./TargetPointAbilityInputHandler";

export class AbilityInputHandlerFactory {
    static createHandler(ability: BaseAbility): AbilityInputHandler {
        const behavior = ability.GetBehavior();
        
        if (behavior & AbilityBehavior.ABILITY_BEHAVIOR_POINT) {
            return new PointTargetAbilityInputHandler(ability);
        } else if (behavior & AbilityBehavior.ABILITY_BEHAVIOR_UNIT_TARGET) {
            return new UnitTargetAbilityInputHandler(ability);
        } else if (behavior & AbilityBehavior.ABILITY_BEHAVIOR_NO_TARGET) {
            return new NoTargetAbilityInputHandler(ability);
        } else if (behavior & AbilityBehavior.ABILITY_BEHAVIOR_TOGGLE) {
            return new ToggleAbilityInputHandler(ability);
        } else if (behavior & AbilityBehavior.ABILITY_BEHAVIOR_PASSIVE) {
            return new PassiveAbilityInputHandler(ability);
        } else {
            return new DefaultAbilityInputHandler(ability);
        }
    }
}