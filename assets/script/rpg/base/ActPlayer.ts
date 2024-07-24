import { Sprite, dragonBones, sp } from "cc";
import { DragonPlayer } from "../../core/common/animation/DragonPlayer";
import { SpriteAtlasLoader, SpriteSheetLoader } from "../../core/common/animation/MCLoader";
import { MCPlayer } from "../../core/common/animation/MCPlayer";
import { SpinePlayer } from "../../core/common/animation/SpinePlayer";
import { ActType } from "../enum/Act";

// 抽象基类
export abstract class ActPlayer {
    protected player: IAnimationPlayer;
    protected isLooping: boolean = false;


    abstract initialize(...args: any[]): ActPlayer;
    abstract changeAct(...args: any[]): Promise<void>;

    onComplete(callback: (() => void) | null):ActPlayer{
        if(callback){
            this.player.onComplete(callback);
        }
        return this;
    }

    // 共用方法
    play( )  {this.player.play();}

    stop() { this.player.stop(); }
  
    setUpdateGap(gap: number) { this.player.setUpdateGap(gap); }
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
        const loader = new SpriteAtlasLoader();
        this.player = new MCPlayer(sprite,loader);
        return this;
    }

    async changeAct(modelName: string,action: ActType): Promise<void> {
        if(!this.player){
            throw new Error('player not initialized');
        }
        let mc = this.getMCKey(modelName,  action);
        let atlasPath = `anim/body/char`;
        await this.player.loadAnimation(atlasPath);
        this.player.setupAnimation(mc);
        this.setLooping(true); // 默认循环
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
        const loader = new SpriteSheetLoader();
        this.player = new MCPlayer(sprite,loader);
        return this;
    }

    async changeAct(modelName: string,action: ActType,  direction: number,gender: number): Promise<void> {
        if(!this.player){
            throw new Error('player not initialized');
        }

        let mc = this.getMCKey(modelName, gender, direction, action);
        let jsonPath = `anim/sheetbody/${mc}.json`;
        let imgPath = `anim/sheetbody/${mc}.png`;
        await this.player.loadAnimation(jsonPath, imgPath);
        this.player.setupAnimation(mc);
        // 设置默认的循环行为
        this.setLooping(true);
        return 
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

    async changeAct(modelName: string,action: ActType): Promise<void> {
        if(!this.player){
            throw new Error('player not initialized');
        }
      
        let jsonPath = `anim/dragonbody/${modelName}_ske`;
        let imgPath = `anim/dragonbody/${modelName}_tex`;


        await this.player.loadAnimation(jsonPath, imgPath,modelName);
        const actionName = this.getActionName(action);

        this.player.setupAnimation(actionName);
        // 设置默认的循环行为
        this.setLooping(true);
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

    async changeAct(modelName: string, action: ActType = ActType.ACT_IDLE): Promise<void> {
        if(!this.player){
            throw new Error('player not initialized');
        }
      
        let jsonPath = `anim/dragonbody/${modelName}_ske`;
        let imgPath = `anim/dragonbody/${modelName}_tex`;


        await this.player.loadAnimation(jsonPath, imgPath,modelName);
        const actionName = this.getActionName(action);

        this.player.setupAnimation(actionName);
        // 设置默认的循环行为
        this.setLooping(true);
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

// 使用示例
(async () => {
    const player = ActPlayerFactory.createPlayer(ActResourceType.ACT1);
    await player.changeAct("character",  ActType.ACT_IDLE);
    // 播放非循环动作（如攻击），并在完成后执行回调
    player.play();

    // 如果需要中途改变循环状态
    player.setLooping(true);

    // 如果需要中途改变完成回调
    player.onComplete(() => {
        console.log("新的完成回调");
    });
})();


export  enum  ActResourceType {
    ACT1 = 'plist',
    ACT2 = 'egret sheet',
    ACT3 = 'dragon',
    ACT4 = 'spine'
}

// 工厂类
export class ActPlayerFactory {
    static createPlayer(type: ActResourceType,...args: any): ActPlayer {
        switch (type) {
            case ActResourceType.ACT1:
                return new Act1Player().initialize(args);
            case ActResourceType.ACT2:
                return new Act2Player().initialize(args);
            case ActResourceType.ACT3:
                return new Act3Player().initialize(args);
            case ActResourceType.ACT4:
                return new Act4Player().initialize(args);
            default:
                throw new Error('Unsupported player type');
        }
    }
}

// // 使用示例
// async function useActPlayer() {
//     const player = ActPlayerFactory.createPlayer('Act1');
//     await player.changeAct('character001', 1, 0, ActType.ACT_IDLE);
//     player.play();
// }








