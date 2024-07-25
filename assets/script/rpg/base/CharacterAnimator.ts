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
    private isAnimationPlaying: boolean = false;
    constructor(animationState: ActAnimationState) {
        this.animationState = animationState;
        this.setupAnimationEvents();
        this.initializeStateTransitions();
    }

    private setupAnimationEvents() {
        this.animationState.onComplete(() => {
            this.isAnimationPlaying = false;
            this.onAnimationComplete();
        });
    }

    private initializeStateTransitions() {
        this.stateTransitions = new Map([
            [AnimationStateType.Attack, { nextState: AnimationStateType.Idle, autoTransition: true }],
            [AnimationStateType.Cast, { nextState: AnimationStateType.Idle, autoTransition: true }],
            [AnimationStateType.Hurt, { nextState: AnimationStateType.Idle, autoTransition: true }],
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
        let shouldPlayAnimation = true;

        if (newState === this.currentState) {
            // 如果是相同状态，检查是否应该重新播放动画
            switch (newState) {
                case AnimationStateType.Attack:
                case AnimationStateType.Cast:
                    // 对于攻击和施法，我们允许打断当前动画并重新开始
                    break;
                case AnimationStateType.Move:
                    // 对于移动，我们可能只想更新方向而不重新开始动画
                    shouldPlayAnimation = false;
                    break;
                default:
                    // 对于其他状态，如果动画正在播放，我们不重新开始
                    if (this.isAnimationPlaying) {
                        shouldPlayAnimation = false;
                    }
            }
        }

        if (shouldPlayAnimation) {

            if (!options.action) {
                options.action = this.getDefaultActionForState(newState);
            }

            this.animationState.playAct(options).then(() => {
                this.currentState = newState;
                this.isAnimationPlaying = true;
                this.animationState.play();
            });
        } else {
            // 如果不播放新动画，可能需要更新一些状态或参数
            this.updateStateWithoutPlayingAnimation(newState, options);
        }
    }

    private getDefaultActionForState(state: AnimationStateType): ActType {
        switch (state) {
            case AnimationStateType.Idle: return ActType.ACT_IDLE;
            case AnimationStateType.Attack: return ActType.ACT_ATTACK;
            case AnimationStateType.Move: return ActType.ACT_WALK;
            case AnimationStateType.Cast: return ActType.ACT_CAST;
            case AnimationStateType.Hurt: return ActType.ACT_HURT;
            case AnimationStateType.Death: return ActType.ACT_DEATH;
            case AnimationStateType.Jump: return ActType.ACT_JUMP;
            case AnimationStateType.Use: return ActType.ACT_USE;
            default: throw new Error(`Unsupported animation state: ${state}`);
        }
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

    private updateStateWithoutPlayingAnimation(state: AnimationStateType, options: ActionOptions) {
        // 根据需要更新状态或参数，但不播放新的动画
        // 例如，更新移动方向、攻击目标等
        console.log(`Updating state to ${state} without playing new animation`);
    }

    public queueState(state: AnimationStateType, options: ActionOptions) {
        if (this.currentState === AnimationStateType.Idle || 
            this.currentState === AnimationStateType.Move || 
            !this.isAnimationPlaying) {
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