import { Component, ImageAsset, Sprite, SpriteFrame, Texture2D, Vec2, resources,_decorator } from 'cc';
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
        const {frames, positions} = this.spriteSheetLoader.getAnimationData(mcKey) || {frames: [], positions: []};
        
        this.movieClip.setFrames(frames.map((frame, index) => ({
            spriteFrame: frame,
            position: positions[index]
        })));
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

    // 新增方法：获取指定 mc 的数据，如果不存在则获取现有的
    public getAnimationData(mcKey?: string): { frames: SpriteFrame[], positions: Vec2[] } | null {
        let frames = null;
        let positions = null;

        if (!mcKey) {
            console.warn(`Animation data not found for mcKey: ${mcKey}. Using available mcKey.`);
            const availableKey = this.spriteFramesMap.keys().next().value;
            frames = this.spriteFramesMap.get(availableKey);
            positions = this.positionsMap.get(availableKey);
        }else{
            frames = this.spriteFramesMap.get(mcKey);
            positions = this.positionsMap.get(mcKey);
        }

        if (frames && positions) {
            return { frames, positions };
        } else {
            console.error(`No available animation data found for mcKey:${mcKey}`);
            return null;
        }
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
