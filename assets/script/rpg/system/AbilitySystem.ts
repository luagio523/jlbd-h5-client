import { BaseAbility } from "../ability/BaseAbility";
import { AbilityComponent } from "../component/AbilityComponent";
import { AbilityEndEvent, AbilityPhaseInterruptedEvent, AbilityPhaseStartEvent, AbilityStartEvent,  DelayedEvent, RPGEvent } from "../event/Event";
import { BaseSystem } from "./BaseSystem";


export class AbilitySystem extends BaseSystem {

    public constructor() {
        super();
        this.listenEvent(RPGEvent.TriggerAbilityEvent,this.triggerAbility.bind(this))
    }


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

    


}



// 这里的工作流程如下：
// 当玩家选择一个技能时，tryActivateAbility 方法被调用。
// 如果技能可以执行，系统会创建一个适当的 AbilityInputHandler。
// 这个 AbilityInputHandler 被设置为当前活动的输入处理器。
// 当玩家进行触摸操作时，PointTargetAbilityInputHandler 的 handleInput 方法会被调用。
// 在触摸结束时，handleInput 方法会调用 ability.Cast(position)。
// Cast 方法会处理施法逻辑，包括开始施法、执行技能效果、开始冷却和消耗魔法等。
// 这样，AbilitySystem 就可以协调技能的选择、输入处理和施法过程。每个具体的技能只需要实现自己的 OnSpellCast 方法来定义特定的技能效果。















// class Game {
//     private inputManager: InputManager;
//     private abilitySystem: AbilitySystem;

//     constructor() {
//         this.inputManager = new InputManager();
//         this.abilitySystem = new AbilitySystem();

//         // 设置输入处理
//         this.inputManager.addListener('touchstart', this.handleInput.bind(this));
//         this.inputManager.addListener('touchmove', this.handleInput.bind(this));
//         this.inputManager.addListener('touchend', this.handleInput.bind(this));
//     }

//     private handleInput(event: TouchEvent) {
//         const currentAbility = this.abilitySystem.getCurrentAbility();
//         if (currentAbility) {
//             currentAbility.handleInput(event.type, event);
//         }
//     }

//     public update(deltaTime: number) {
//         this.abilitySystem.update(deltaTime);
//     }

//     public onAbilitySelected(abilityIndex: number) {
//         const entity = this.getCurrentEntity(); // 获取当前选中的实体
//         this.abilitySystem.tryActivateAbility(entity, abilityIndex);
//     }
// }

// // 在游戏循环中
// game.update(deltaTime);

// // 当玩家选择技能时
// game.onAbilitySelected(abilityIndex);