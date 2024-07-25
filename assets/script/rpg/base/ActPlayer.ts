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
    callback?: () => void;
}


// 抽象基类
export abstract class ActPlayer {
    protected player: IAnimationPlayer;
    protected isLooping: boolean = false;


    abstract initialize(...args: any[]): ActPlayer;
    abstract changeAct(options:ActionOptions): Promise<void>;

    public update(dt:number){
        this.player?.update(dt);
    }

    onComplete(callback: (() => void) | null):ActPlayer{
        if(callback){
            this.player.onComplete(callback);
        }
        return this;
    }

    // 共用方法
    play( )  {this.player.play();}

    stop() { this.player.stop(); }
  
    setFrameRate(frameRate: number) { this.player.setFrameRate(frameRate); }
    setAnimeTimes(times: number) { this.player.setAnimeTimes(times); }

    setLooping(looping: boolean) {
        this.isLooping = looping;
        this.player.setAnimeTimes(looping ? 0 : 1);
    }
    
}

/**
 * 基于 SpriteAtlasPlayer 实现
 * 能够使用creator plist atlas资源
 */
class Act1Player extends ActPlayer {
    constructor() {
        super();
    }

    public initialize(sprite:Sprite): ActPlayer {
        this.player = new MCPlayer(sprite);
        return this;
    }

    async changeAct(options:ActionOptions): Promise<void> {
        if(!this.player){
            throw new Error('player not initialized');
        }
        const {
            modelName,
            action = ActType.ACT_IDLE,
            callback,
        } = options;

        let mc = this.getMCKey(modelName,  action);
        let atlasPath = `anim/body/char`;
        await this.player.loadAnimation(AnimResourceType.SpriteAltas,atlasPath);
        this.player.setupAnimation(mc);
        this.player.setFrameRate(12);
        if (callback){
            this.player.onComplete(callback);
        }else{
            this.setLooping(true); // 默认循环
        }
        this.play();
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
class Act2Player extends ActPlayer {
    constructor() {
        super();
    }

    public initialize(sprite:Sprite): ActPlayer {
        this.player = new MCPlayer(sprite);
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
            callback,
        } = options;

        let mc = this.getMCKey(modelName, gender, direction, action);
        let resoucePath = `anim/sheetbody/${mc}`;
        await this.player.loadAnimation(AnimResourceType.EgretSpriteSheet,resoucePath);
        this.player.setupAnimation(mc);
        this.player.setFrameRate(12);
        if (callback){
            this.player.onComplete(callback);
        }else{
            this.setLooping(true); // 默认循环
        }
        this.play();
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
class Act3Player extends ActPlayer {
    constructor() {
        super();
    }

    public initialize(armatureDisplay:dragonBones.ArmatureDisplay): ActPlayer {
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
            callback
        } = options;
      
        let resoucePath = `anim/dragonbody/${modelName}`;


        await this.player.loadAnimation(AnimResourceType.DragonBones,resoucePath);
        const actionName = this.getActionName(action);

        this.player.setupAnimation(actionName,modelName);
        if (callback){
            this.player.onComplete(callback);
        }else{
            this.setLooping(true); // 默认循环
        }
        this.play();
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
class Act4Player extends ActPlayer {
    constructor() {
        super();
    }
    public initialize(skeleton: sp.Skeleton): ActPlayer {
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
            callback
        } = options;
      
        let resourcePath = `anim/spinebody/${modelName}`;

        await this.player.loadAnimation(AnimResourceType.Spine,resourcePath);
        const actionName = this.getActionName(action);

        this.player.setupAnimation(actionName,modelName);
        if (callback){
            this.player.onComplete(callback);
        }else{
            this.setLooping(true); // 默认循环
        }
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





// // 工厂类
// export class ActPlayerFactory {
//     static createPlayer(type: AnimResourceType,comp:Component): ActPlayer {
//         switch (type) {
//             case AnimResourceType.SpriteAltas:
//                 // console.log("--------create act1",comp,"=====",comp.node)
//                 return new Act1Player().initialize(comp as Sprite);
//             case AnimResourceType.EgretSpriteSheet:
//                 return new Act2Player().initialize(comp as Sprite);
//             case AnimResourceType.DragonBones:
//                 return new Act3Player().initialize(comp as dragonBones.ArmatureDisplay);
//             case AnimResourceType.Spine:
//                 return new Act4Player().initialize(comp as sp.Skeleton);
//             default:
//                 throw new Error('Unsupported player type');
//         }
//     }
// }




// export class ActPlayerFactory {
//     private static playerMap = new Map<AnimResourceType, { new (): ActPlayer }>([
//         [AnimResourceType.SpriteAltas, Act1Player],
//         [AnimResourceType.EgretSpriteSheet, Act2Player],
//         [AnimResourceType.DragonBones, Act3Player],
//         [AnimResourceType.Spine, Act4Player]
//     ]);

//     private static componentMap = new Map<AnimResourceType, new () => Component>([
//         [AnimResourceType.SpriteAltas, Sprite],
//         [AnimResourceType.EgretSpriteSheet, Sprite],
//         [AnimResourceType.DragonBones, dragonBones.ArmatureDisplay],
//         [AnimResourceType.Spine, sp.Skeleton]
//     ]);

//     static createPlayer(type: AnimResourceType, comp: Component): ActPlayer {
//         const PlayerClass = this.playerMap.get(type);
//         const ComponentClass = this.componentMap.get(type);

//         if (!PlayerClass || !ComponentClass) {
//             throw new Error('Unsupported player type');
//         }

//         if (!(comp instanceof ComponentClass)) {
//             throw new Error(`Component is not of type ${ComponentClass.name}`);
//         }

//         return new PlayerClass().initialize(comp);
//     }
// }


type AnimActMapping  = {
    new: new () => ActPlayer;
    componentType: new () => Component;
};

export class ActPlayerFactory {
    private static playerMap: Map<AnimResourceType, AnimActMapping> = new Map([
        [AnimResourceType.SpriteAltas, { new: Act1Player, componentType: Sprite }],
        [AnimResourceType.EgretSpriteSheet, { new: Act2Player, componentType: Sprite }],
        [AnimResourceType.DragonBones, { new: Act3Player, componentType: dragonBones.ArmatureDisplay }],
        [AnimResourceType.Spine, { new: Act4Player, componentType: sp.Skeleton }]
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

    static createPlayer(node: Node, type: AnimResourceType): ActPlayer {
        const component = this.getComponent(node, type);
        const playerInfo = this.playerMap.get(type);
        
        if (!playerInfo) {
            throw new Error(`Unsupported AnimResourceType: ${type}`);
        }
        return new playerInfo.new().initialize(component);
    }
}

// // 使用示例
// async function useActPlayer() {
//     const player = ActPlayerFactory.createPlayer('Act1');
//     await player.changeAct('character001', 1, 0, ActType.ACT_IDLE);
//     player.play();
// }








// // 使用示例
// (async () => {
//     const player = ActPlayerFactory.createPlayer(AnimResourceType.ACT1);
//     await player.changeAct("character",  ActType.ACT_IDLE);
//     // 播放非循环动作（如攻击），并在完成后执行回调
//     player.play();

//     // 如果需要中途改变循环状态
//     player.setLooping(true);

//     // 如果需要中途改变完成回调
//     player.onComplete(() => {
//         console.log("新的完成回调");
//     });
// })();
