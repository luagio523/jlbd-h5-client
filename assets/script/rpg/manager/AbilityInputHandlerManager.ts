import { BaseAbility } from "../ability/BaseAbility";
import { AbilityInputHandler } from "../input/AbilityInputHandler";
import { AbilityInputHandlerFactory } from "../input/AbilityInputHandlerFactory";
import { InputManager } from "./InputManager";

export class AbilityInputHandlerManager {
    private static instance: AbilityInputHandlerManager;
    private inputManager: InputManager;
    private activeInputHandler: AbilityInputHandler | null = null;
    private triggerAbilityCallback: ((ability: BaseAbility) => void) | null = null;

    private constructor() {
        this.inputManager = InputManager.getInstance();
    }

    public static getInstance(): AbilityInputHandlerManager {
        if (!AbilityInputHandlerManager.instance) {
            AbilityInputHandlerManager.instance = new AbilityInputHandlerManager();
        }
        return AbilityInputHandlerManager.instance;
    }

    public setActiveInputHandler(ability: BaseAbility): void {
        if (this.activeInputHandler) {
            this.inputManager.removeListener(this.handleInput);
        }

        this.activeInputHandler = AbilityInputHandlerFactory.createHandler(ability);
        this.inputManager.addListener(this.handleInput);
    }

    public clearActiveInputHandler(): void {
        if (this.activeInputHandler) {
            this.inputManager.removeListener(this.handleInput);
            this.activeInputHandler = null;
        }
    }

    public setTriggerAbilityCallback(callback: (ability: BaseAbility) => void): void {
        this.triggerAbilityCallback = callback;
    }

    private handleInput = (eventType: string, event: any) => {
        if (this.activeInputHandler) {
            const shouldTrigger = this.activeInputHandler.handleInput(eventType, event);
            if (shouldTrigger && this.triggerAbilityCallback) {
                const ability = this.activeInputHandler.getAbility();
                this.triggerAbilityCallback(ability);
                this.clearActiveInputHandler();
            }
        }
    }
}