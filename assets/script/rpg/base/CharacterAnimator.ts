import { ActType } from "../enum/Act";
import { ActAnimationState, ActionOptions } from "./ActAnimationState";
export enum AnimationStateType{
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
    private currentState: AnimationStateType = AnimationStateType.Idle;
    private queuedStates: { state: AnimationStateType; options: ActionOptions }[] = [];
    private stateTransitions: Map<AnimationStateType, StateTransition>;

    constructor(animationState: ActAnimationState) {
        this.animationState = animationState;
        this.setupAnimationEvents();
        this.initializeStateTransitions();
    }

    private setupAnimationEvents() {
        this.animationState.onComplete(() => {
            this.onAnimationComplete();
        });
    }

    private initializeStateTransitions() {
        this.stateTransitions = new Map([
            [AnimationStateType.Idle, { nextState: null, autoTransition: false }],
            [AnimationStateType.Attack, { nextState: AnimationStateType.Idle, autoTransition: true }],
            [AnimationStateType.Move, { nextState: null, autoTransition: false }],
            [AnimationStateType.Cast, { nextState: AnimationStateType.Idle, autoTransition: true }],
            [AnimationStateType.Hurt, { nextState: AnimationStateType.Idle, autoTransition: true }],
            [AnimationStateType.Death, { nextState: null, autoTransition: false }],
            [AnimationStateType.Jump, { nextState: AnimationStateType.Idle, autoTransition: true }],
            [AnimationStateType.Use, { nextState: AnimationStateType.Idle, autoTransition: true }],
        ]);
    }

    private onAnimationComplete() {
        const transition = this.stateTransitions.get(this.currentState);
        if (transition && transition.autoTransition) {
            if (this.queuedStates.length > 0) {
                const nextStateInfo = this.queuedStates.shift()!;
                this.transitionToState(nextStateInfo.state, nextStateInfo.options);
            } else if (transition.nextState !== null) {
                this.transitionToState(transition.nextState, { modelName: 'character', action: ActType.ACT_IDLE });
            }
        } else if (this.queuedStates.length > 0) {
            const nextStateInfo = this.queuedStates.shift()!;
            this.transitionToState(nextStateInfo.state, nextStateInfo.options);
        }
    }

    public transitionToState(newState: AnimationStateType, options: ActionOptions) {
        if (newState === this.currentState) return;

        let actionOptions: ActionOptions = { ...options };

        if (!actionOptions.action) {
            switch (newState) {
                case AnimationStateType.Idle:
                    actionOptions.action = ActType.ACT_IDLE;
                    break;
                case AnimationStateType.Attack:
                    actionOptions.action = ActType.ACT_ATTACK;
                    break;
                case AnimationStateType.Move:
                    actionOptions.action = ActType.ACT_WALK;
                    break;
                case AnimationStateType.Cast:
                    actionOptions.action = ActType.ACT_CAST;
                    break;
                case AnimationStateType.Hurt:
                    actionOptions.action = ActType.ACT_HURT;
                    break;
                case AnimationStateType.Death:
                    actionOptions.action = ActType.ACT_DEATH;
                    break;
                case AnimationStateType.Jump:
                    actionOptions.action = ActType.ACT_JUMP;
                    break;
                case AnimationStateType.Use:
                    actionOptions.action = ActType.ACT_USE;
                    break;
                default:
                    throw new Error(`Unsupported animation state: ${newState}`);
            }
        }

        this.animationState.changeAct(actionOptions).then(() => {
            this.currentState = newState;
            this.animationState.play();
        });
    }

    public mapActionToAnimationStateType(action: ActType): AnimationStateType {
        switch (action) {
            case ActType.ACT_IDLE:
                return AnimationStateType.Idle;
            case ActType.ACT_ATTACK:
            case ActType.ACT_ATTACK2:
            case ActType.ACT_ATTACK3:
            case ActType.ACT_ATTACK4:
            case ActType.ACT_ATTACK5:
                return AnimationStateType.Attack;
            case ActType.ACT_WALK:
            case ActType.ACT_RUN:
                return AnimationStateType.Move;
            case ActType.ACT_CAST:
                return AnimationStateType.Cast;
            case ActType.ACT_HURT:
                return AnimationStateType.Hurt;
            case ActType.ACT_DEATH:
                return AnimationStateType.Death;
            case ActType.ACT_JUMP:
                return AnimationStateType.Jump;
            case ActType.ACT_USE:
                return AnimationStateType.Use;
            default:
                return AnimationStateType.Idle;
        }
    }

    public queueState(state: AnimationStateType, options: ActionOptions) {
        if (this.currentState === AnimationStateType.Idle || this.currentState === AnimationStateType.Move) {
            this.transitionToState(state, options);
        } else {
            this.queuedStates.push({ state, options });
        }
    }

    public update(dt: number) {
        this.animationState.update(dt);
    }

    public getCurrentState(): AnimationStateType {
        return this.currentState;
    }

    public clearQueue() {
        this.queuedStates = [];
    }

    public setStateTransition(state: AnimationStateType, nextState: AnimationStateType | null, autoTransition: boolean) {
        this.stateTransitions.set(state, { nextState, autoTransition });
    }
}