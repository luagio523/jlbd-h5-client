import { BaseAbility } from "../ability/BaseAbility";
import { AbilityComponent } from "../component/AbilityComponent";
import { ECSEntity } from "../ecs/ECSEntity";
import { AbilityBehavior } from "../enum/Type";
import { AbilityInputHandler } from "../input/AbilityInputHandler";
import { AbilityInputHandlerFactory } from "../input/AbilityInputHandlerFactory";
import { AbilitySystem } from "../system/AbilitySystem";
import { InputManager } from "./InputManager";

export class UIManager {
    private abilitySystem: AbilitySystem;
    private inputManager: InputManager;
    private activeInputHandler: AbilityInputHandler | null = null;

    constructor(abilitySystem: AbilitySystem) {
        this.abilitySystem = abilitySystem;
        this.inputManager = InputManager.getInstance();
        this.initializeAbilityButtons();
    }

    private initializeAbilityButtons() {
        // 假设我们有4个技能按钮
        for (let i = 0; i < 4; i++) {
            const button = document.getElementById(`ability-button-${i}`);
            if (button) {
                button.addEventListener('click', () => this.onAbilityButtonClicked(i));
            }
        }
    }

    private onAbilityButtonClicked(abilityIndex: number) {
        const currentEntity = this.getCurrentEntity(); // 获取当前选中的实体
        const abilityComponent = currentEntity.getComponent(AbilityComponent);
        if (!abilityComponent) return;

        const ability = abilityComponent.getAbility(abilityIndex);
        if (ability && ability.CanBeExecuted()) {
            if (ability.GetBehavior() & AbilityBehavior.ABILITY_BEHAVIOR_TOGGLE) {
                this.abilitySystem.tryActivateAbility(currentEntity, abilityIndex);
            } else if (ability.GetBehavior() & AbilityBehavior.ABILITY_BEHAVIOR_NO_TARGET) {
                this.abilitySystem.tryActivateAbility(currentEntity, abilityIndex);
            } else {
                this.setActiveInputHandler(ability);
            }
        }
    }

    private setActiveInputHandler(ability: BaseAbility): void {
        if (this.activeInputHandler) {
            this.inputManager.removeListener(this.handleInput);
        }

        this.activeInputHandler = AbilityInputHandlerFactory.createHandler(ability);
        this.inputManager.addListener(this.handleInput);
    }

    private handleInput = (eventType: string, event: any) => {
        if (this.activeInputHandler) {
            const shouldTrigger = this.activeInputHandler.handleInput(eventType, event);
            if (shouldTrigger) {
                const ability = this.activeInputHandler.getAbility();
                const currentEntity = this.getCurrentEntity();
                const abilityComponent = currentEntity.getComponent(AbilityComponent);
                if (abilityComponent) {
                    const abilityIndex = abilityComponent.getAbilityIndex(ability);
                    if (abilityIndex !== -1) {
                        this.abilitySystem.tryActivateAbility(currentEntity, abilityIndex);
                    }
                }
                this.clearActiveInputHandler();
            }
        }
    }

    private clearActiveInputHandler(): void {
        if (this.activeInputHandler) {
            this.inputManager.removeListener(this.handleInput);
            this.activeInputHandler = null;
        }
    }

    private getCurrentEntity(): ECSEntity {
        // 这里应该返回当前选中的实体
        // 在实际游戏中,这可能是玩家控制的英雄
        return /* 当前选中的实体 */;
    }
}