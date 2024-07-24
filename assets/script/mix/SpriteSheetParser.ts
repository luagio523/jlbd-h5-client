import { ImageAsset, SpriteFrame, Texture2D, Vec2, resources } from "cc";


export enum ActType {
    ACT_RESET = 0,        // 重置状态，通常用于初始化或者重置角色行为
    ACT_IDLE = 1,         // 空闲状态，角色站立不动或进行轻微活动
    ACT_WALK = 2,         // 行走状态，角色以走的方式移动
    ACT_RUN = 3,          // 跑步状态，角色以跑的方式快速移动
    ACT_ATTACK = 4,       // 攻击状态，角色执行攻击动作
    ACT_STAND = 5,        // 站立状态，角色静止站立
    ACT_DEATH = 6,        // 死亡状态，角色死亡动作和效果
    ACT_CAST =  7,        //施法
    ACT_HURT = 11, //受伤

    ACT_JUMP = 20,        // 跳跃状态，角色执行跳跃动作
    ACT_FLY = 21,         // 飞行状态，角色在空中飞行或悬浮
    ACT_SWIM = 22,        // 游泳状态，角色在水中游泳

    ACT_TRANSITION = 30,  // 过渡状态，角色从一个动作过渡到另一个动作
    ACT_USE = 31,         // 使用状态，角色互动或使用前面的物体或设备

    
}



interface IAnimationParser {
    parse(resource: any): void;
    getAnimation(modelName: string, gender: number , direction: number, action: ActType): any;
}






export class SpriteSheetLoader {
    private animationData: any = null;
    private spriteFramesMap: Map<string, SpriteFrame[]> = new Map(); // 使用 Map 存储精灵帧
    private positionsMap: Map<string, Vec2[]> = new Map(); // 使用 Map 存储位置

    async loadAnimation(jsonPath: string, imagePath: string) {
        try {
            // 同时加载 JSON 和图像
            this.animationData = await this.loadJSON(jsonPath);
            const imageAsset = await this.loadImage(imagePath);

            if (!this.animationData || !imageAsset) {
                console.error('Failed to load animation data or image');
                return;
            }

            const texture = new Texture2D();
            texture.image = imageAsset;

            await this.createSpriteFrames(texture);
            // this.setupMovieClip(); // 如果需要设置 MovieClip，可以在这里调用
        } catch (error) {
            console.error('Error loading animation:', error);
        }
    }

    private async createSpriteFrames(texture: Texture2D) {
        const mcKeys = Object.keys(this.animationData.mc); // 获取所有动画键

        // 遍历每个动画键，生成精灵帧
        mcKeys.forEach(mcKey => {
            const frames = this.animationData.mc[mcKey].frames;
            const res = this.animationData.res;

            // 初始化每个 mc 的精灵帧和位置数组
            this.spriteFramesMap.set(mcKey, []);
            this.positionsMap.set(mcKey, []);

            frames.forEach(frame => {
                const resData = res[frame.res];
                if (resData) {
                    const spriteFrame = new SpriteFrame();
                    spriteFrame.texture = texture;
                    spriteFrame.rect.set(resData.x, resData.y, resData.w, resData.h); // 使用 set 方法简化赋值
                    this.spriteFramesMap.get(mcKey)?.push(spriteFrame); // 将精灵帧添加到对应的 mc 数组
                    this.positionsMap.get(mcKey)?.push(new Vec2(frame.x, frame.y)); // 将位置添加到对应的 mc 数组
                } else {
                    console.warn(`Resource not found for frame: ${frame.res}`);
                }
            });
        });
    }

    private async loadJSON(path: string): Promise<any> {
        return new Promise((resolve, reject) => {
            resources.load(path, (err, jsonAsset: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(jsonAsset.json);
                }
            });
        });
    }

    private async loadImage(path: string): Promise<ImageAsset> {
        return new Promise((resolve, reject) => {
            resources.load(path, ImageAsset, (err, imageAsset) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(imageAsset);
                }
            });
        });
    }
}

import { Component, Sprite, _decorator } from 'cc';
import { SpriteSheetLoader } from './SpriteSheetLoader';
import MovieClip from './MovieClip';

const { ccclass, property } = _decorator;

@ccclass('SpriteSheetPlayer')
export class SpriteSheetPlayer extends Component {
    @property(Sprite)
    private sprite: Sprite | null = null;

    private spriteSheetLoader: SpriteSheetLoader = new SpriteSheetLoader();
    private movieClip: MovieClip | null = null;

    async loadAnimation(jsonPath: string, imagePath: string) {
        await this.spriteSheetLoader.loadAnimation(jsonPath, imagePath);
        this.setupMovieClip();
    }

    private onCompleteCallback: Function | null = null;

    public setupMovieClip(mcKey?: string) {
        if (!this.movieClip) {
            this.movieClip = new MovieClip();
            this.movieClip.setFrameUpdateRender(this.updateSprite.bind(this));
            this.movieClip.onComplete(() => {
                if (this.onCompleteCallback) {
                    this.onCompleteCallback();
                }
            });
        }
        
        if (!mcKey) {
            mcKey = this.spriteSheetLoader.spriteFramesMap.keys().next().value;
        }
        
        if (mcKey) {
            const frames = this.spriteSheetLoader.spriteFramesMap.get(mcKey) || [];
            const positions = this.spriteSheetLoader.positionsMap.get(mcKey) || [];
            
            this.movieClip.setFrames(frames.map((frame, index) => ({
                spriteFrame: frame,
                position: positions[index]
            })));
        }
    }

    // 新增方法：设置播放完成回调
    setOnCompleteCallback(callback: Function) {
        this.onCompleteCallback = callback;
    }
    
    private updateSprite(frameData: { spriteFrame: SpriteFrame, position: Vec2 }, progress: number) {
        if (this.sprite) {
            this.sprite.spriteFrame = frameData.spriteFrame;
            this.sprite.node.setPosition(frameData.position.x, frameData.position.y);
        }
    }

    play() {
        if (this.movieClip) {
            this.movieClip.playAnime();
        }
    }

    stop() {
        if (this.movieClip) {
            this.movieClip.stopAnime();
        }
    }

    pause() {
        if (this.movieClip) {
            this.movieClip.pauseAnime();
        }
    }

    resume() {
        if (this.movieClip) {
            this.movieClip.resumeAnime();
        }
    }

    setUpdateGap(gap: number) {
        if (this.movieClip) {
            this.movieClip.setUpdateGap(gap);
        }
    }

    setAnimeTimes(times: number) {
        if (this.movieClip) {
            this.movieClip.setAnimeTimes(times);
        }
    }

    setEasingFunction(easingFunction: (t: number) => number) {
        if (this.movieClip) {
            this.movieClip.setEasingFunction(easingFunction);
        }
    }

    update(dt: number) {
        if (this.movieClip) {
            this.movieClip.update(dt);
        }
    }

    onDestroy() {
        if (this.movieClip) {
            this.movieClip.destroy();
        }
    }
}



class SpriteSheetParser implements IAnimationParser {
    private animations: { [key: string]: any } = {};
    private resources: { [key: string]: any } = {};

    /**
     * 解析资源
     * @param resource - 包含动画和资源信息的 JSON 对象
     */
    public parse(resource: any) {
        this.animations = resource.mc; // 解析动画信息
        this.resources = resource.res;  // 解析资源信息
    }

    public loadResource(key: string): any {
        return this.resources[key];
    }

    /**
     * 获取对应动作和方向的动画帧列表
     * @param modelName - 模型名
     * @param gender - 性别（默认为1）
     * @param direction - 方向（0-7）
     * @param action - 动作类型
     * @returns 返回对应的动画帧列表
     */
    public getAnimation(modelName: string, gender: number = 1, direction: number, action: ActType): any[] {
        const actionName = this.getActionName(action);
        const key = `${modelName}_${gender}_${direction}${actionName}`;

        const animationData = this.animations[key];
        if (!animationData) {
            console.warn(`Animation data not found for key: ${key}`);
            return [];
        }

        const frames = animationData.frames;
        const animationFrames = frames.map(frame => {
            const resource = this.resources[frame.res];
            if (!resource) {
                console.warn(`Resource not found for frame: ${frame.res}`);
                return null;
            }
            return {
                res: frame.res,
                x: frame.x,
                y: frame.y,
                width: resource.w,
                height: resource.h,
                offsetX: frame.x,
                offsetY: frame.y,
            };
        }).filter(frame => frame !== null); // 过滤掉未找到资源的帧

        return animationFrames;
    }

    /**
     * 根据动作类型获取动作后缀
     * @param action - 动作类型
     * @returns 返回动作后缀字符串
     */
    private getActionName(action: ActType): string {
        switch (action) {
            case ActType.ACT_IDLE: return 's';
            case ActType.ACT_WALK: return 'r';
            case ActType.ACT_RUN: return 'r';
            case ActType.ACT_ATTACK: return 'a';
            case ActType.ACT_CAST: return 'c';
            default: return 's'; // 默认返回空闲状态
        }
    }
}