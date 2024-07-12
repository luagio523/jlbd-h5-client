import { BuildTransition, StateMachine } from "../../core/common/fsm/StateMachine";

interface JsonState {
    name: string,
    initialState: string,
    states: Record<string, { loop: boolean, animation: string[] }>,
    transitions: JsonTransition[]
}

interface JsonTransition {
    from: string[],
    to: string,
    conditions: { type: string, name?: string, condition: any }[]
}

type State = string;
type T = { [name: string]: string };

enum EZState {
    Idle, // 空闲
    Running, // 移动
    Attacking, // 攻击
    Skill_Q, // 技能Q
    Skill_W, // 技能W
    Skill_E, // 技能E
    Skill_R, // 技能R
    Hit, // 被攻击
    Dead, // 死亡
    Recalling, //回城 
    Shopping //购物
};

enum EZTransition {
    Move,  //移动
    NormalAttack,  // 攻击
    Use_Skill_Q, // 使用技能Q
    Use_Skill_W, // 使用技能W
    Use_Skill_E, // 使用技能E
    Use_Skill_R, // 使用技能R
    TakeDamage,  // 受伤
    Die,  // 死亡
    Recall, // 回城
    Shop,  // 购物
};

// 英雄联盟的EZ是一个远程攻击型英雄，他的状态可以比较复杂。这里，我将尝试总结他的主要状态：
// 空闲状态（Idle）：EZ在没有进行任何操作时的状态，此时他会播放空闲动画。
// 移动状态（Running）：当玩家控制EZ移动时，他会进入移动状态，并播放移动动画。
// 普通攻击状态（Attacking）：当EZ进行普通攻击时，他会进入攻击状态，并播放攻击动画。
// 技能释放状态（Casting）：EZ有四个技能（Q，W，E，R），每个技能在释放时都对应一个技能释放状态和相应的动画。
// 受击状态（Hit）：当EZ被其他英雄的普通攻击或技能击中时，他会进入受击状态，可能会有短暂的受击动画。
// 死亡状态（Dead）：当EZ的生命值降为0时，他会进入死亡状态，并播放死亡动画。
// 回城状态（Recalling）：当玩家控制EZ进行回城（B键）操作时，EZ会进入回城状态，并播放回城动画。
// 购物状态（Shopping）：当EZ进入商店范围，玩家进行购物操作时，可以看作是EZ处于购物状态，此时不会有特定动画。


export class EStateMachine extends StateMachine<T, State> {
    constructor(private json: JsonState) {

        const option = {
            init: json.initialState,
            transitions: {
                search: BuildTransition("*", AI_STATE.SEARCH),
                follow: BuildTransition(AI_STATE.SEARCH, AI_STATE.MOVE),
                atk: BuildTransition(AI_STATE.MOVE, AI_STATE.ATK),
                break: BuildTransition("*", AI_STATE.IDLE)
            },
            
            onAfter: (from: AI_STATE, to: AI_STATE) => {
                if(from == AI_STATE.SEARCH){
                    monsterAI.stopSearch()
                }else if(from == AI_STATE.ATK){
                    monsterAI.stopAtk()
                }else if(from == AI_STATE.MOVE){
                    monsterAI.stopFollow()
                }


                if(to == AI_STATE.SEARCH){
                    monsterAI.toSearch()
                }else if(to == AI_STATE.ATK){
                    monsterAI.toAtk()
                }else if(to == AI_STATE.MOVE){

                    // cc.log(monsterAI.fsm.state(),"=======dddd====")

                    monsterAI.toFollow()
                }else if(to == AI_STATE.IDLE){
                    monsterAI.toIdle()
                }
            }
        };


        super({init: json.initialState, transitions: {}});

        this.setupFromJson(json);
    }

   

}