import { Component, Node, Sprite, dragonBones, resources, sp } from "cc";
import { DragonPlayer } from "../../core/animation/DragonPlayer";
import { MCPlayer } from "../../core/animation/MCPlayer";
import { SpinePlayer } from "../../core/animation/SpinePlayer";
import { ActType } from "../enum/Act";
import { AnimResourceType } from "../../core/animation/Type";
import { IAnimationPlayer } from "../../core/animation/IAnimationPlayer";


export interface ActionOptions {
    model?:string;
    modelName: string;
    action: ActType;
    direction?: number;
    gender?: number;
    frameRate?: number;
    times?:number;
}


// 抽象基类
export abstract class UnitAnimationState {
    protected player: IAnimationPlayer;
    protected currentActionOptions: ActionOptions;

    abstract initialize(...args: any[]): UnitAnimationState;
    abstract changeAct(options: ActionOptions): Promise<UnitAnimationState>;

    public update(dt: number) {
        this.player?.update(dt);
    }



    onComplete(callback: ((act: ActionOptions) => void)): UnitAnimationState {
        if (callback) {
            this.player.onComplete(() => {
                callback(this.currentActionOptions);
            });
        }
        return this;
    }

    play(times: number = 0) {
        this.player.play(times);
    }

    stop() {
        this.player.stop();
    }

    setFrameRate(frameRate: number) {
        this.player.setFrameRate(frameRate);
    }

    getCurrentActionOptions(): ActionOptions {
        return this.currentActionOptions;
    }


    public static  isEqual(options1: ActionOptions, options2: ActionOptions): boolean {
        if (!options1 || !options2) return false; // 其中一个为空，认为不相等
        // 比较必需的属性
        if (options1.model !== options2.model ||options1.modelName !== options2.modelName) return false;
    
        // 比较 action、direction 和 gender
        if (options1.action !== options2.action || 
            options1.direction !== options2.direction || 
            options1.gender !== options2.gender) {
            return false;
        }
        return true; // 所有检查通过，两个对象相等
    }
}

/**
 * 基于 SpriteAtlasPlayer 实现
 * 能够使用creator plist atlas资源
 */
class AtlasAnimationState extends UnitAnimationState {
    constructor() {
        super();
    }

    public initialize(sprite: Sprite): UnitAnimationState {
        this.player = new MCPlayer(sprite);
        this.setFrameRate(12);
        return this;
    }

    async changeAct(options: ActionOptions): Promise<UnitAnimationState> {
        if (!this.player) {
            throw new Error('player not initialized');
        }

        if(UnitAnimationState.isEqual(options,this.currentActionOptions)){
            if(options.frameRate !== this.currentActionOptions.frameRate){
                this.setFrameRate(options.frameRate)
            }
            return this;
        }

        const { model,modelName, action ,frameRate } = options;

        this.currentActionOptions = options;
        const mc = this.getMCKey(modelName, action);
        const atlasPath = model??`anim/body/char`;
        if(frameRate){
            this.setFrameRate(frameRate)
        }
        await this.player.loadAnimation(AnimResourceType.SpriteAltas, atlasPath);
        this.player.setupAnimation(mc);

        return this;
    }

    protected getActionName(action: ActType): string {
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
class EgretAnimationState extends UnitAnimationState {
    constructor() {
        super();
    }

    public initialize(sprite: Sprite): UnitAnimationState {
        this.player = new MCPlayer(sprite);
        this.player.setFrameRate(12)
        return this;
    }

    async changeAct(options: ActionOptions): Promise<UnitAnimationState> {
        if (!this.player) {
            throw new Error('player not initialized');
        }
        if(UnitAnimationState.isEqual(options,this.currentActionOptions)){
            if(options.frameRate !== this.currentActionOptions.frameRate){
                this.setFrameRate(options.frameRate)
            }
            return this;
        } 
        const {
            model,
            modelName,
            action = ActType.ACT_IDLE,
            gender = 1,
            direction = 0,
            frameRate
        } = options;

        if(frameRate){
            this.player.setFrameRate(frameRate)
        }

        this.currentActionOptions = options;

        const mc = this.getMCKey(modelName, gender, direction, action);
        const resourcePath = model??`anim/sheetbody/${mc}`;

        await this.player.loadAnimation(AnimResourceType.EgretSpriteSheet, resourcePath);
        this.player.setupAnimation(mc);

        return this;
    }

    getMCKey(modelName: string, gender: number = 1, direction: number, action: ActType): string {
        const actionName = this.getActionName(action);
        return `${modelName}_${gender}_${direction}${actionName}`;
    }

    protected getActionName(action: ActType): string {
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
class DragonAnimationState extends UnitAnimationState {
    constructor() {
        super();
    }

    public initialize(armatureDisplay: dragonBones.ArmatureDisplay): UnitAnimationState {
        this.player = new DragonPlayer(armatureDisplay);
        return this;
    }

    async changeAct(options: ActionOptions): Promise<UnitAnimationState> {
        if (!this.player) {
            throw new Error('player not initialized');
        }

        if(UnitAnimationState.isEqual(options,this.currentActionOptions)){
            if(options.frameRate !== this.currentActionOptions.frameRate){
                this.setFrameRate(options.frameRate)
            }
            return this;
        } 

        const {
            model,
            modelName,
            action = ActType.ACT_IDLE
        } = options;

        this.currentActionOptions = options;

        const resourcePath = model??`anim/dragonbody/${modelName}`;

        await this.player.loadAnimation(AnimResourceType.DragonBones, resourcePath);
        const actionName = this.getActionName(action);
        this.player.setupAnimation(actionName, modelName);

        return this;
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
        return this.actionMap[action] || 'Idle';
    }
}



/**
 * 基于 SpriteSheetPlayer 实现
 * 能够使用egret sheet资源
 */
class SpineAnimationState extends UnitAnimationState {
    constructor() {
        super();
    }

    public initialize(skeleton: sp.Skeleton): UnitAnimationState {
        this.player = new SpinePlayer(skeleton);
        return this;
    }

    async changeAct(options: ActionOptions): Promise<UnitAnimationState> {
        if (!this.player) {
            throw new Error('player not initialized');
        }

        if(UnitAnimationState.isEqual(options,this.currentActionOptions)){
            if(options.frameRate !== this.currentActionOptions.frameRate){
                this.setFrameRate(options.frameRate)
            }
            return this;
        } 

        const {
            model,
            modelName,
            action = ActType.ACT_IDLE
        } = options;

        this.currentActionOptions = options;

        const resourcePath = model??`anim/spinebody/${modelName}`;

        await this.player.loadAnimation(AnimResourceType.Spine, resourcePath);
        const actionName = this.getActionName(action);
        this.player.setupAnimation(actionName, modelName);

        return this;
    }

    private actionMap: { [key in ActType]?: string } = {
        [ActType.ACT_IDLE]: 'walk',
        [ActType.ACT_WALK]: 'walk',
        [ActType.ACT_RUN]: 'walk',
        [ActType.ACT_ATTACK]: 'walk',
        [ActType.ACT_CAST]: 'walk',
        [ActType.ACT_JUMP]: 'jump',
    };

    protected getActionName(action: ActType): string {
        return this.actionMap[action] || 'walk';
    }
}




type AnimActMapping  = {
    new: new () => UnitAnimationState;
    componentType: new () => Component;
};

/**
 * 动画播放器工厂
 * 兼容不同的动画资源类型
 * 用于创建不同类型的动画资源播放器
 */
export class UnitAnimationStateFactory {
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

    static createPlayer(node: Node, type: AnimResourceType): UnitAnimationState {
        const component = this.getComponent(node, type);
        const playerInfo = this.playerMap.get(type);
        
        if (!playerInfo) {
            throw new Error(`Unsupported AnimResourceType: ${type}`);
        }
        return new playerInfo.new().initialize(component);
    }
}

// // 使用示例
// async function useUnitAnimationState() {
//     const player = UnitAnimationStateFactory.createPlayer('Act1');
//     await player.changeAct('character001', 1, 0, ActType.ACT_IDLE);
//     player.play();
// }




