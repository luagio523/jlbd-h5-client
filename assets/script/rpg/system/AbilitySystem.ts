import { BaseAbility } from "../ability/BaseAbility";
import { AbilityComponent } from "../component/AbilityComponent";
import { ECSEntity } from "../ecs/ECSEntity";
import { AbilityBehavior } from "../enum/Type";
import { AbilityEndEvent, AbilityPhaseInterruptedEvent, AbilityPhaseStartEvent, AbilityStartEvent, CastAbilityEvent, DelayedEvent } from "../event/Event";
import { BaseSystem } from "./BaseSystem";


export class AbilitySystem extends BaseSystem {
    update(deltaTime: number) {
        const abilityComponents = this.getComponents(AbilityComponent);
        for (const abilityComponent of abilityComponents) {
            this.updateAbilities(abilityComponent, deltaTime);
        }
    }

    private updateAbilities(abilityComponent: AbilityComponent, deltaTime: number) {
        const abilities = abilityComponent.getAbilities();
        for (const ability of abilities) {
            this.updateAbilityCooldown(ability, deltaTime);
            this.checkAbilityTriggers(ability);
            if (ability.IsToggled()) {
                ability.OnToggleThink(deltaTime);
            }
        }
    }

    private updateAbilityCooldown(ability: BaseAbility, deltaTime: number) {
        ability.UpdateCooldown(deltaTime);
    }

    private checkAbilityTriggers(ability: BaseAbility) {
        if (ability.ShouldTriggerAutoCast() && ability.CanBeExecuted()) {
            this.triggerAbility(ability);
        }
    }

    private triggerAbility(ability: BaseAbility) {
        const caster = ability.GetCaster();
        if (!caster || !ability.CanBeExecuted()) return;

        this.enqueueEvent(new CastAbilityEvent(caster, ability));

        if (ability.OnAbilityPhaseStart()) {
            this.enqueueEvent(new AbilityPhaseStartEvent(caster, ability));
            
            const castPoint = ability.GetCastPoint();
            if (castPoint > 0) {
                this.enqueueEvent(new DelayedEvent(
                    () => this.startAbility(ability),
                    castPoint
                ));
            } else {
                this.startAbility(ability);
            }
        } else {
            ability.OnAbilityPhaseInterrupted();
            this.enqueueEvent(new AbilityPhaseInterruptedEvent(caster, ability));
        }
    }

    private startAbility(ability: BaseAbility) {
        const caster = ability.GetCaster();
        if (!caster) return;

        this.enqueueEvent(new AbilityStartEvent(caster, ability));
        ability.OnSpellStart();

        const channelTime = ability.GetChannelTime();
        if (channelTime > 0) {
            this.startChanneling(ability);
        } else {
            this.endAbility(ability);
        }
    }

    private startChanneling(ability: BaseAbility) {
        const channelInterval = 0.1; // 假设每0.1秒进行一次channelThink
        let elapsedTime = 0;
        const channelTime = ability.GetChannelTime();

        const channelThinkInterval = setInterval(() => {
            elapsedTime += channelInterval;
            ability.OnChannelThink(channelInterval);

            if (elapsedTime >= channelTime) {
                clearInterval(channelThinkInterval);
                this.endAbility(ability, false);
            }
        }, channelInterval * 1000);

        ability.SetChannelThinkInterval(channelThinkInterval);
    }

    private endAbility(ability: BaseAbility, interrupted: boolean = false) {
        const caster = ability.GetCaster();
        if (!caster) return;

        if (ability.GetChannelTime() > 0) {
            ability.OnChannelFinish(interrupted);
            clearInterval(ability.GetChannelThinkInterval());
        }

        ability.OnSpellFinish();
        this.enqueueEvent(new AbilityEndEvent(caster, ability));
    }

    public tryActivateAbility(entity: ECSEntity, abilityIndex: number) {
        const abilityComponent = entity.getComponent(AbilityComponent);
        if (!abilityComponent) return;

        const ability = abilityComponent.getAbility(abilityIndex);
        if (ability && ability.CanBeExecuted()) {
            if (ability.GetBehavior() & AbilityBehavior.ABILITY_BEHAVIOR_TOGGLE) {
                ability.OnToggle();
            } else {
                this.triggerAbility(ability);
            }
        }
    }
}