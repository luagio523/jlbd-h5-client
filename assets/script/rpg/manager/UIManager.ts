import { Vec2 } from "cc";
import { AbilitySystem } from "../system/AbilitySystem";
import { InputManager } from "./InputManager";
import { AbilityIndicator } from "../indicator/AbilityIndicator";
import { AbilityComponent } from "../component/AbilityComponent";
import { AbilityBehavior } from "../enum/Type";
import { BaseAbility } from "../ability/BaseAbility";
import { InputComponent } from "../component/InputComponent";
import { AbilityIndicatorFactory } from "../factory/AbilityIndicatorFactory";
import { GameEntityManager } from "./GameEntityManager";


export class UIManager {
    private abilitySystem: AbilitySystem;
    private inputManager: InputManager;
    private gameEntityManager: GameEntityManager;
    private abilityIndicator: AbilityIndicator | null = null;

    constructor(abilitySystem: AbilitySystem) {
        this.abilitySystem = abilitySystem;
        this.inputManager = InputManager.getInstance();
        this.gameEntityManager = GameEntityManager.getInstance();
        this.inputManager.addListener('joystick', this.handleJoystickInput);
    }

    public initializeAbilityButtons(document: Document) {
        // 假设我们有4个技能按钮
        for (let i = 0; i < 4; i++) {
            const button = document.getElementById(`ability-button-${i}`);
            if (button) {
                button.addEventListener('click', () => this.onAbilityButtonClicked(i));
            }
        }
    }

    private onAbilityButtonClicked(abilityIndex: number) {
        const currentEntity =  this.gameEntityManager.getPlayerControlledEntity(); // 获取当前选中的实体
        const abilityComponent = currentEntity.getComponent(AbilityComponent);
        if (!abilityComponent) return;

        const ability = abilityComponent.getAbility(abilityIndex);
        if (ability && ability.CanBeExecuted()) {
            if (ability.GetBehavior() & AbilityBehavior.ABILITY_BEHAVIOR_TOGGLE) {
                this.abilitySystem.tryActivateAbility(currentEntity, abilityIndex);
            } else if (ability.GetBehavior() & AbilityBehavior.ABILITY_BEHAVIOR_NO_TARGET) {
                this.abilitySystem.tryActivateAbility(currentEntity, abilityIndex);
            } else {
                this.startAbilityIndicator(ability);
            }
        }
    }

    private startAbilityIndicator(ability: BaseAbility): void {
        if (this.abilityIndicator) {
            this.inputManager.removeMouseListeners(this.abilityIndicator.handleInput);
        }
        
        this.abilityIndicator = AbilityIndicatorFactory.createIndicator(ability)
        this.inputManager.addTouchListeners(this.abilityIndicator.handleInput); // 监听触摸输入
       
        this.abilityIndicator.onCancel = () => {
            this.inputManager.removeMouseListeners(this.abilityIndicator.handleInput);
        }
        this.abilityIndicator.onConfirm = () => {
            this.inputManager.removeMouseListeners(this.abilityIndicator.handleInput);
            const ability = this.abilityIndicator.getAbility();
            const currentEntity = this.gameEntityManager.getPlayerControlledEntity();
            const abilityComponent = currentEntity.getComponent(AbilityComponent);
            if (abilityComponent) {
                const abilityIndex = abilityComponent.getAbilityIndex(ability);
                if (abilityIndex !== -1) {
                    this.abilitySystem.tryActivateAbility(currentEntity, abilityIndex);
                }
            }
        }
    }

    private handleJoystickInput = (eventType: string, event: any) => {
        const currentEntity = this.gameEntityManager.getPlayerControlledEntity();
        const inputComponent = currentEntity.getComponent(InputComponent);
        if (inputComponent) {
            inputComponent.setJoystickInput(event.x, event.y);
        }
    }

   
}