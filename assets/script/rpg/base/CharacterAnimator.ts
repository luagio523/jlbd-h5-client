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
    private currentState: AnimationStateType = AnimationStateType.Idle;
    private queuedStates: AnimationStateType[] = [];

    constructor(animationState: ActAnimationState) {
        this.animationState = animationState;
        this.setupAnimationEvents();
    }

    private setupAnimationEvents() {
        this.animationState.onComplete(() => {
            this.onAnimationComplete();
        });
    }

    private onAnimationComplete() {
        if (this.queuedStates.length > 0) {
            this.transitionToState(this.queuedStates.shift()!);
        } else if (this.currentState !== AnimationStateType.Idle && 
                   this.currentState !== AnimationStateType.Move && 
                   this.currentState !== AnimationStateType.Death) {
            this.transitionToState(AnimationStateType.Idle);
        }
    }

    public transitionToState(newState: AnimationStateType, actType?: ActType) {
        if (newState === this.currentState) return;

        let options: ActionOptions = { modelName: 'character', action: ActType.ACT_IDLE };

        switch (newState) {
            case AnimationStateType.Idle:
                options.action = ActType.ACT_IDLE;
                break;
            case AnimationStateType.Attack:
                options.action = actType || ActType.ACT_ATTACK;
                break;
            case AnimationStateType.Move:
                options.action = actType || ActType.ACT_WALK;
                break;
            case AnimationStateType.Cast:
                options.action = ActType.ACT_CAST;
                break;
            case AnimationStateType.Hurt:
                options.action = ActType.ACT_HURT;
                break;
            case AnimationStateType.Death:
                options.action = ActType.ACT_DEATH;
                break;
            case AnimationStateType.Jump:
                options.action = ActType.ACT_JUMP;
                break;
            case AnimationStateType.Use:
                options.action = ActType.ACT_USE;
                break;
            default:
                throw new Error(`Unsupported animation state: ${newState}`);
        }

        this.animationState.changeAct(options).then(() => {
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

    public queueState(state: AnimationStateType, actType?: ActType) {
        if (this.currentState === AnimationStateType.Idle || this.currentState === AnimationStateType.Move) {
            this.transitionToState(state, actType);
        } else {
            this.queuedStates.push(state);
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
}