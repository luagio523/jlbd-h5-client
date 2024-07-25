import { Component, Node, Sprite, dragonBones, resources, sp } from "cc";
import { DragonPlayer } from "../../core/common/animation/DragonPlayer";
import { MCPlayer } from "../../core/common/animation/MCPlayer";
import { SpinePlayer } from "../../core/common/animation/SpinePlayer";
import { ActType } from "../enum/Act";
import { AnimResourceType } from "../../core/common/animation/Type";
import { IAnimationPlayer } from "../../core/common/animation/IAnimationPlayer";


export interface ActionOptions {
    modelName: string;
    action: ActType;
    direction?: number;
    gender?: number;
    times?: number; // 0表示无限循环
}


// 抽象基类
export abstract class ActAnimationState {
    protected player: IAnimationPlayer;
    protected isLooping: boolean = false;
    protected act:ActType = ActType.ACT_IDLE;

    abstract initialize(...args: any[]): ActAnimationState;
    abstract changeAct(options:ActionOptions): Promise<void>; //播放动作

    public update(dt:number){
        this.player?.update(dt);
    }

    onComplete(callback: ((act:ActType) => void) ):ActAnimationState{
        if(callback){
            this.player.onComplete(()=>{
                callback(this.act);
            });
        }
        return this;
    }

    // 共用方法 0次表示无限循环
    play(times: number = 0)  {
        this.player.play(times);
    }

    stop() { this.player.stop(); }
  
    setFrameRate(frameRate: number) { this.player.setFrameRate(frameRate); }
}

/**
 * 基于 SpriteAtlasPlayer 实现
 * 能够使用creator plist atlas资源
 */
class AtlasAnimationState extends ActAnimationState {
    constructor() {
        super();
    }

    public initialize(sprite:Sprite): ActAnimationState {
        this.player = new MCPlayer(sprite);
        this.player.setFrameRate(12);
        return this;
    }

    async changeAct(options:ActionOptions): Promise<void> {
        if(!this.player){
            throw new Error('player not initialized');
        }
        const {
            modelName,
            action = ActType.ACT_IDLE,
        } = options;

        let mc = this.getMCKey(modelName,  action);
        let atlasPath = `anim/body/char`;
        await this.player.loadAnimation(AnimResourceType.SpriteAltas,atlasPath);
        this.player.setupAnimation(mc);
        this.play(options.times || 0);
    }

    protected getActionName(action: ActType): string {
        // Act1Player 特定的动作名映射
        const actionMap: { [key in ActType]?: string } = {
            [ActType.ACT_IDLE]: 's',
            [ActType.ACT_WALK]: 'r',
            [ActType.ACT_RUN]: 'r',
            [ActType.ACT_ATTACK]: 'a',
            [ActType.ACT_CAST]: 'j',
            [ActType.ACT_DEATH]: 'S',
        };
        return actionMap[action] || 's';
    }

    getMCKey(modelName: string, action: ActType): string {
        const actionName = this.getActionName(action);
        return `${modelName}_${actionName}`;
    }
    
}

// 
/**
 * 基于 SpriteSheetPlayer 实现
 * 能够使用egret sheet资源
 */
class EgretAnimationState extends ActAnimationState {
    constructor() {
        super();
    }

    public initialize(sprite:Sprite): ActAnimationState {
        this.player = new MCPlayer(sprite);
        this.player.setFrameRate(12);
        return this;
    }

    async changeAct(options:ActionOptions): Promise<void> {
        if(!this.player){
            throw new Error('player not initialized');
        }

        const {
            modelName,
            action = ActType.ACT_IDLE,
            gender = 1,
            direction = 0,
        } = options;

        let mc = this.getMCKey(modelName, gender, direction, action);
        let resoucePath = `anim/sheetbody/${mc}`;
        await this.player.loadAnimation(AnimResourceType.EgretSpriteSheet,resoucePath);
        this.player.setupAnimation(mc);
        this.play(options.times || 0);
    }

    getMCKey(modelName: string, gender: number = 1, direction: number, action: ActType): string {
        const actionName = this.getActionName(action);
        return `${modelName}_${gender}_${direction}${actionName}`;
    }

    protected getActionName(action: ActType): string {
        // Act2Player 特定的动作名映射
        const actionMap: { [key in ActType]?: string } = {
            [ActType.ACT_IDLE]: 's',
            [ActType.ACT_WALK]: 'r',
            [ActType.ACT_RUN]: 'r',
            [ActType.ACT_ATTACK]: 'a',
            [ActType.ACT_CAST]: 'c',
        };
        return actionMap[action] || 's';
    }
}


/**
 * 基于 SpriteSheetPlayer 实现
 * 能够使用egret sheet资源
 */
class DragonAnimationState extends ActAnimationState {
    constructor() {
        super();
    }

    public initialize(armatureDisplay:dragonBones.ArmatureDisplay): ActAnimationState {
        this.player =  new DragonPlayer(armatureDisplay);
        return this;
    }

    async changeAct(options:ActionOptions): Promise<void> {
        if(!this.player){
            throw new Error('player not initialized');
        }

        const {
            modelName,
            action = ActType.ACT_IDLE,
        } = options;
      
        let resoucePath = `anim/dragonbody/${modelName}`;


        await this.player.loadAnimation(AnimResourceType.DragonBones,resoucePath);
        const actionName = this.getActionName(action);
        this.player.setupAnimation(actionName,modelName);
        this.play(options.times || 0);
    }

    private actionMap: { [key in ActType]?: string } = {
        [ActType.ACT_IDLE]: 'Idle',
        [ActType.ACT_WALK]: 'Idle',
        [ActType.ACT_RUN]: 'Idle',
        [ActType.ACT_ATTACK]: 'Attack A',
        [ActType.ACT_ATTACK2]: 'Attack B',
        [ActType.ACT_ATTACK3]: 'Attack C',
        [ActType.ACT_ATTACK4]: 'Attack D',
        [ActType.ACT_CAST]: 'Attack B',
    };


    protected getActionName(action: ActType): string {
        // Act2Player 特定的动作名映射
        return this.actionMap[action] || 's';
    }
}



/**
 * 基于 SpriteSheetPlayer 实现
 * 能够使用egret sheet资源
 */
class SpineAnimationState extends ActAnimationState {
    constructor() {
        super();
    }
    public initialize(skeleton: sp.Skeleton): ActAnimationState {
        this.player =  new SpinePlayer(skeleton);
        return this;
    }

    async changeAct(options: ActionOptions): Promise<void> {
        if(!this.player){
            throw new Error('player not initialized');
        }

        const {
            modelName,
            action = ActType.ACT_IDLE,
        } = options;
      
        let resourcePath = `anim/spinebody/${modelName}`;

        await this.player.loadAnimation(AnimResourceType.Spine,resourcePath);
        const actionName = this.getActionName(action);

        this.player.setupAnimation(actionName,modelName);
        this.play(options.times || 0);
    }

    private actionMap: { [key in ActType]?: string } = {
        [ActType.ACT_IDLE]: 'Idle',
        [ActType.ACT_WALK]: 'Idle',
        [ActType.ACT_RUN]: 'Idle',
        [ActType.ACT_ATTACK]: 'Attack A',
        [ActType.ACT_CAST]: 'Attack B',
    };


    protected getActionName(action: ActType): string {
        // Act2Player 特定的动作名映射
        return this.actionMap[action] || 's';
    }
}




type AnimActMapping  = {
    new: new () => ActAnimationState;
    componentType: new () => Component;
};

/**
 * 动画播放器工厂
 * 兼容不同的动画资源类型
 * 用于创建不同类型的动画资源播放器
 */
export class ActAnimationStateFactory {
    private static playerMap: Map<AnimResourceType, AnimActMapping> = new Map([
        [AnimResourceType.SpriteAltas, { new: AtlasAnimationState, componentType: Sprite }],
        [AnimResourceType.EgretSpriteSheet, { new: EgretAnimationState, componentType: Sprite }],
        [AnimResourceType.DragonBones, { new: DragonAnimationState, componentType: dragonBones.ArmatureDisplay }],
        [AnimResourceType.Spine, { new: SpineAnimationState, componentType: sp.Skeleton }]
    ] );

    static getComponent(childNode: Node, type: AnimResourceType): Component {
        const playerInfo = this.playerMap.get(type);
        if (!playerInfo) {
            throw new Error(`Unsupported AnimResourceType: ${type}`);
        }
        const component = childNode.getComponent(playerInfo.componentType);
        component.node = childNode ;
        if (!component) {
            throw new Error(`Component ${playerInfo.componentType.name} not found .`);
        }
        return component;
    }

    static createPlayer(node: Node, type: AnimResourceType): ActAnimationState {
        const component = this.getComponent(node, type);
        const playerInfo = this.playerMap.get(type);
        
        if (!playerInfo) {
            throw new Error(`Unsupported AnimResourceType: ${type}`);
        }
        return new playerInfo.new().initialize(component);
    }
}

// // 使用示例
// async function useActAnimationState() {
//     const player = ActAnimationStateFactory.createPlayer('Act1');
//     await player.changeAct('character001', 1, 0, ActType.ACT_IDLE);
//     player.play();
// }




