import { ActType } from "../enum/Act";
import { ActAnimationState, ActionOptions } from "./ActAnimationState";

export enum AnimationStateType {
    Idle,
    Attack,
    Move,
    Cast,
    Hurt,
    Death,
    Jump,
    Use
}

interface StateTransition {
    nextState: AnimationStateType | null;
    autoTransition: boolean;
}


export class CharacterAnimator {
    private animationState: ActAnimationState;
    private currentActionOption: ActionOptions;
    private baseAction: ActType = ActType.ACT_IDLE;
    private queuedActions: ActionOptions[] = [];
    private isAnimationPlaying: boolean = false;
    private currentOptions: ActionOptions;

    constructor(animationState: ActAnimationState) {
        this.animationState = animationState;
        this.setupAnimationEvents();
    }

    private setupAnimationEvents() {
        this.animationState.onComplete(() => {
            this.isAnimationPlaying = false;
            this.onAnimationComplete();
        });
    }

    private onAnimationComplete() {
        if (this.queuedActions.length > 0) {
            const nextAction = this.queuedActions.shift()!;
            this.playAction(nextAction);
        } else {
            this.returnToBaseAction();
        }
    }

    public transitionToState(options: ActionOptions) {
        this.currentOptions = { ...options };  // 保存完整的 options
        if (this.isLoopingAction(options)) {
            this.baseAction = options.action;
        }
        
        if (this.isInterruptibleAction(this.currentActionOption) || !this.isAnimationPlaying) {
            this.playAction(options);
        } else {
            this.queuedActions.push(options);
        }
    }

    private playAction(options: ActionOptions) {
        this.animationState.changeAct(options).then(() => {
            this.currentActionOption = options;
            this.isAnimationPlaying = true;
            this.animationState.play(options.times||0);
        });
    }

    private returnToBaseAction() {
        const baseOptions: ActionOptions = {
            ...this.currentOptions,
            action: this.baseAction
        };
        this.playAction(baseOptions);
    }

    private isLoopingAction(option: ActionOptions): boolean {
        if(!option){
            return false
        }
        if( option.times == 0 ){
            return true 
        }
        let action = option.action
        return action === ActType.ACT_IDLE || action === ActType.ACT_WALK || action === ActType.ACT_RUN;
    }

    private isInterruptibleAction(action: ActionOptions): boolean {
        return this.isLoopingAction(action);
    }

    public update(dt: number) {
        this.animationState.update(dt);
    }

    public getCurrentAction(): ActionOptions {
        return this.currentActionOption;
    }

    public clearQueue() {
        this.queuedActions = [];
    }
}
