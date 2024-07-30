import { InputManager } from "./InputManager";
import { AbilityIndicator } from "../indicator/AbilityIndicator";
import { AbilityComponent } from "../component/AbilityComponent";
import { AbilityBehavior } from "../enum/Type";
import { BaseAbility } from "../ability/BaseAbility";
import { InputComponent } from "../component/InputComponent";
import { AbilityIndicatorFactory } from "../factory/AbilityIndicatorFactory";
import { EntityManager } from "./EntityManager";
import { ECSEntity } from "../ecs/ECSEntity";
import { EventManager } from "../event/EventManager";
import { TriggerAbilityEvent } from "../event/Event";
import { Direction } from "../base/Direction";
import { Vec2 } from "cc";


export class UIManager {
    private inputManager: InputManager;
    private entityManager: EntityManager;
    private abilityIndicator: AbilityIndicator | null = null;
    private eventManger:EventManager;
    constructor() {
        this.inputManager = InputManager.getInstance();
        this.entityManager = EntityManager.getInstance();
        this.eventManger = EventManager.getInstance();
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
        const currentEntity =  this.entityManager.getPlayerControlledEntity(); // 获取当前选中的实体
        const abilityComponent = currentEntity.getComponent(AbilityComponent);
        if (!abilityComponent) return;

        const ability = abilityComponent.getAbility(abilityIndex);
        if (ability && ability.CanBeExecuted()) {
            if (ability.GetBehavior() & AbilityBehavior.ABILITY_BEHAVIOR_TOGGLE) {
                ability.OnToggle();
            } else if (ability.GetBehavior() & AbilityBehavior.ABILITY_BEHAVIOR_NO_TARGET) {
                this.triggerAbility(currentEntity, ability);
            } else {
                this.startAbilityIndicator(ability);
            }
        }
    }


    private  triggerAbility(entity: ECSEntity, ability: BaseAbility) {
        ability.SetCaster(entity)
        this.eventManger.dispatchEvent(new TriggerAbilityEvent(ability)) // 丢给abilitySystem处理
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
            const currentEntity = this.entityManager.getPlayerControlledEntity();
            this.triggerAbility(currentEntity, ability);
        }
    }

    private handleJoystickInput = (eventType: string, angle: number) => {
        const currentEntity = this.entityManager.getPlayerControlledEntity();
        const inputComponent = currentEntity.getComponent(InputComponent);
        if (inputComponent) {
            inputComponent.setJoystickInput(angle);
        }
    }

   
}