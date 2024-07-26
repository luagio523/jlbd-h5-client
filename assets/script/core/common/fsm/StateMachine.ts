type EGoToStateFunc<State> = (from: State) => State;
type EToState<State> = State | EGoToStateFunc<State>;

interface ITransitionDir<State> {
    from: State | State[] | '*';
    to: EToState<State>;
    onTransition?: (from: State, to: State) => void;
}

export type ITransitions<T, State> = {
    [P in keyof T]: ITransitionDir<State> | ITransitionDir<State>[];
}

type TransitionCall<T, State> = {
    [P in keyof T]: (toState?: State) => void;
};


// interface STOptions<T, State> {
//     init: State;
//     transitions: ITransitions<T, State>;
// }

interface STOptions<T, State> {
    init: State;
    transitions: ITransitions<T, State>;
    onBefore?: (from: State, to: State) => void;
    onAfter?: (from: State, to: State) => void;
    onError?: (code: number, reason: string) => void;
}

export function BuildTransition<State>(from: State | State[] | '*', to: EToState<State>, onTransition?: (from: State, to: State) => void): ITransitionDir<State> {
    return {from, to, onTransition};
}

export class StateMachine<T, State> {
    private _transitions: TransitionCall<T, State>;
    private _curState: State;
    private _originTransitions: ITransitions<T, State>;

    private _isTransiting = false;

    onBefore?: (from: State, to: State) => void;
    onAfter?: (from: State, to: State) => void;
    onError?: (code: number, reason: string) => void;

    constructor(option: STOptions<T, State> = null) {
        if(!option) return 
        this.setOption(option)
    }

    public setOption(option: STOptions<T, State>){
        const {init, transitions,onBefore,onAfter} = option;


        this._curState = init;
        this.onBefore = onBefore
        this.onAfter = onAfter

        this.setupTransitions(transitions);
    }
    
    private setupTransitions(transitions: ITransitions<T, State>) {
        this._originTransitions = transitions;
        this._transitions = {} as any;

        Object.keys(transitions).forEach(k => {
            const key = k as keyof T;

            const value: ITransitionDir<State> | ITransitionDir<State>[] = transitions[key];

            this._transitions[key] = (() => {
                if (!this.can(key)) {
                    this.postError(1000, `You can not '${String(key)}' now. Current state is ${this._curState}`);
                    return;
                }

                if (this._isTransiting) {
                    this.postError(1011, `This is transiting now. You cannot transition more times at one time.current:${this._curState}`)
                    return;
                }

                const curState = this._curState;
                const dir = this._findDir(curState, value);

                if (dir == null) {
                    this.postError(1000, `You can not '${String(key)}' now. Current state is ${this._curState}`);
                    return;
                }

                const {to, onTransition} = dir;
                const toState = ((typeof to === 'function') ? ((to as EGoToStateFunc<State>)(curState)) : to);

                this._isTransiting = true;
                this.onBefore && this.onBefore(curState, toState);
                onTransition && onTransition(curState, toState);
                this._curState = toState;
                this._isTransiting = false;
                this.onAfter && this.onAfter(curState, toState);

                
            });
        });
    }

    private postError(code: number, reason: string) {
        this.logError(reason);
        this.onError && this.onError(code, reason);
    }

    private logError(reason: any) {
        console.error(reason);
    }

    transition() {
        if(!this._transitions){
            this.logError("you should setOption at first")
            return 
        }
        return this._transitions;
    }

    /** get cur state */
    state() {
        return this._curState;
    }

    

    /** current is `state` */
    is(state: State) {
        return this._curState == state;
    }

    /**
     * Can transition `t` now.
     * @param t 
     */
    can(t: keyof T) {
        const value: ITransitionDir<State> | ITransitionDir<State>[] = this._originTransitions[t];
        if (!value) {
            return false;
        }

        const dir = this._findDir(this._curState, value);
        return dir != null;
    }

    private _findDir(from: State, dirs: ITransitionDir<State> | ITransitionDir<State>[]) {
        if (Array.isArray(dirs)) {
            return this._findDirOfArray(from, dirs);
        }

        if (this._isIncludeState(dirs.from, from)) {
            return dirs;
        }

        return null;
    }

    private _findDirOfArray(from: State, dirs: (ITransitionDir<State>)[]) {
        for (const index in dirs) {
            const dir = dirs[index];
            if (this._isIncludeState(dir.from, from)) {
                return dir;
            }
        }

        return null;
    }

    private _isIncludeState(state: State | State[] | '*', targetState: State) {
        if (state === '*') {
            return true;
        }

        if (targetState === state) {
            return true;
        }

        if (Array.isArray(state) && (state.indexOf(targetState) != -1)) {
            return true;
        }

        return false;
    }
}




// {
//     "name": "AnimationStateMachine",
//     "initialState": "Idle",
//     "states": ["Idle", "Running", "Jumping", "Attacking", "Dead"],
//     "events": ["START_RUNNING", "STOP_RUNNING", "START_JUMPING", "LAND_JUMP", "START_ATTACK", "COMPLETE_ATTACK", "CHARACTER_DIES"],
//     "transitions": [
//         { "from": ["Idle", "Running", "Jumping", "Attacking"], "event": "START_RUNNING", "to": "Running"},
//         { "from": ["Idle", "Attacking"], "event": "START_ATTACK", "to": "Attacking"},
//         { "from": ["Idle", "Running", "Jumping", "Attacking"], "event": "CHARACTER_DIES", "to": "Dead"},
//         { "from": ["Running"], "event": "STOP_RUNNING", "to": "Idle"},
//         { "from": ["Running"], "event": "START_JUMPING", "to": "Jumping"},
//         { "from": ["Jumping"], "event": "LAND_JUMP", "to": "Idle"},
//         { "from": ["Attacking"], "event": "COMPLETE_ATTACK", "to": "Idle"}
//     ]
// }


// {
//     "name": "AnimationStateMachine",
//     "initialState": "Idle",
//     "states": {
//         "Idle": {"loop": true, "animation": ["idleAnimation1", "idleAnimation2"]},
//         "Running": {"loop": true, "animation": ["runningAnimation"]},
//         "Jumping": {"loop": false, "animation": ["jumpingAnimation"]},
//         "Attacking": {"loop": false, "animation": ["attackAnimation1", "attackAnimation2"]},
//         "Dead": {"loop": false, "animation": ["deathAnimation"]}
//     },
//     "events": ["START_RUNNING", "STOP_RUNNING", "START_JUMPING", "LAND_JUMP", "START_ATTACK", "COMPLETE_ATTACK", "CHARACTER_DIES"],
//     "transitions": [
//         { "from": ["Idle", "Running", "Jumping", "Attacking"], "event": "START_RUNNING", "to": "Running"},
//         { "from": ["Idle", "Attacking"], "event": "START_ATTACK", "to": "Attacking"},
//         { "from": ["Idle", "Running", "Jumping", "Attacking"], "event": "CHARACTER_DIES", "to": "Dead"},
//         { "from": ["Running"], "event": "STOP_RUNNING", "to": "Idle"},
//         { "from": ["Running"], "event": "START_JUMPING", "to": "Jumping"},
//         { "from": ["Jumping"], "event": "LAND_JUMP", "to": "Idle"},
//         { "from": ["Attacking"], "event": "COMPLETE_ATTACK", "to": "Idle"}
//     ]
// }


// {
//     "name": "AnimationStateMachine",
//     "initialState": "Idle",
//     "states": {
//         "Idle": {"loop": true, "animation": ["idleAnimation1", "idleAnimation2"]},
//         "Running": {"loop": true, "animation": ["runningAnimation"]},
//         "Jumping": {"loop": false, "animation": ["jumpingAnimation"]},
//         "Attacking": {"loop": false, "animation": ["attackAnimation1", "attackAnimation2"]},
//         "Dead": {"loop": false, "animation": ["deathAnimation"]}
//     },
//     "transitions": [
//         { 
//             "from": ["Idle"], 
//             "to": "Dead",
//             "event": "GODEAD",
//             "auto_update": {
//                 "delta": 5,
//                 "condition": {"isInLava": true}
//             }
//         },
//         { 
//             "from": ["Running"], 
//             "to": "Dead",
//             "event": "CHARACTER_DIES_FROM_RUNNING",
//             "auto_update": {
//                 "delta": 5,
//                 "condition": {"isInLava": true}
//             }
//         }
//         // 后续过渡...
//     ]
// }




// function createAnimationStateMachine(json) {
//     // 将JSON数据转换为你的状态机格式
//     const states = json.states;

//     const transitions = {};
//     for (const state of states) {
//         transitions[state.name] = state.transitions.map(t => {
//             return {
//                 from: state.name,
//                 to: t.to,
//                 onTransition: (from, to) => {
//                     console.log(`Transition from ${from} to ${to}`);
//                 },
//             };
//         });
//     }

//     // 创建一个状态机实例
//     const stateMachine = new StateMachine({
//         init: states[0].name,
//         transitions: transitions,
//         onBefore: (from, to) => console.log(`Prepare to transition from ${from} to ${to}`),
//         onAfter: (from, to) => console.log(`Transitioned from ${from} to ${to}`),
//         onError: (code, reason) => console.log(`Error: ${code}, ${reason}`),
//     });
    
//     return stateMachine;
// }

// // 使用JSON描述的动画状态机数据创建一个新的状态机实例
// let animationStateMachine = createAnimationStateMachine(animationStateMachineJSON);