import { DragonPlayer } from "../../core/common/animation/DragonPlayer";
import { SpriteAtlasLoader, SpriteSheetLoader } from "../../core/common/animation/MCLoader";
import { MCPlayer } from "../../core/common/animation/MCPlayer";
import { SpinePlayer } from "../../core/common/animation/SpinePlayer";
import { ActType } from "../enum/Act";

// 抽象基类
abstract class ActPlayer {
    protected player: IAnimationPlayer;
    protected isLooping: boolean = false;

    abstract changeAct(...args: any[]): Promise<ActPlayer>;

    onComplete(callback: (() => void) | null):ActPlayer{
        this.player.onComplete(callback);
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
        const loader = new SpriteAtlasLoader();
        this.player = new MCPlayer(loader);
    }

    async changeAct(modelName: string,action: ActType): Promise<ActPlayer> {
        let mc = this.getMCKey(modelName,  action);
        let atlasPath = `anim/body/char`;
        await this.player.loadAnimation(atlasPath);
        this.player.setupAnimation(mc);
        this.setLooping(true); // 默认循环
        return this;
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
        const sheetLoader = new SpriteSheetLoader();
        this.player = new MCPlayer(sheetLoader);
    }

    async changeAct(modelName: string,action: ActType,  direction: number,gender: number): Promise<ActPlayer> {
        let mc = this.getMCKey(modelName, gender, direction, action);
        let jsonPath = `anim/sheetbody/${mc}.json`;
        let imgPath = `anim/sheetbody/${mc}.png`;
        await this.player.loadAnimation(jsonPath, imgPath);
        this.player.setupAnimation(mc);
        // 设置默认的循环行为
        this.setLooping(true);
        return this
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
        this.player =  new DragonPlayer();
    }

    async changeAct(modelName: string,action: ActType): Promise<ActPlayer> {
      
        let jsonPath = `anim/dragonbody/${modelName}_ske`;
        let imgPath = `anim/dragonbody/${modelName}_tex`;


        await this.player.loadAnimation(jsonPath, imgPath,modelName);
        const actionName = this.getActionName(action);

        this.player.setupAnimation(actionName);
        // 设置默认的循环行为
        this.setLooping(true);
        return this
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
        this.player =  new SpinePlayer();
    }

    async changeAct(modelName: string, action: ActType = ActType.ACT_IDLE): Promise<ActPlayer> {
      
        let jsonPath = `anim/dragonbody/${modelName}_ske`;
        let imgPath = `anim/dragonbody/${modelName}_tex`;


        await this.player.loadAnimation(jsonPath, imgPath,modelName);
        const actionName = this.getActionName(action);

        this.player.setupAnimation(actionName);
        // 设置默认的循环行为
        this.setLooping(true);
        return this
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
    static createPlayer(type: ActResourceType): ActPlayer {
        switch (type) {
            case ActResourceType.ACT1:
                return new Act1Player();
            case ActResourceType.ACT2:
                return new Act2Player();
            case ActResourceType.ACT3:
                return new Act3Player();
            case ActResourceType.ACT4:
                return new Act4Player();
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








