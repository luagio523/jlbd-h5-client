import { Node, Sprite, SpriteFrame, resources, Texture2D, ImageAsset, Vec2 } from 'cc';

class PlistAnimationPlayer implements IAnimationPlayer {
    private node: Node;
    private movieClip: MovieClip;
    private sprite: Sprite;
    private spriteFrames: SpriteFrame[] = [];
    private positions: Vec2[] = [];

    constructor(parent: Node, plistPath: string, imagePath: string) {
        this.node = new Node();
        parent.addChild(this.node);
        this.sprite = this.node.addComponent(Sprite);
        this.movieClip = new MovieClip();
        this.loadAnimation(plistPath, imagePath);
    }

    private async loadAnimation(plistPath: string, imagePath: string) {
        const plistData = await this.loadPlist(plistPath);
        const imageAsset = await this.loadImage(imagePath);
        const texture = new Texture2D();
        texture.image = imageAsset;
        this.createSpriteFrames(plistData, texture);
        this.setupMovieClip(plistData);
    }

    private async loadPlist(path: string): Promise<any> {
        return new Promise((resolve, reject) => {
            resources.load(path, (err, plistAsset: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(plistAsset);
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

    private createSpriteFrames(plistData: any, texture: Texture2D) {
        const frames = plistData.frames;
        for (const key in frames) {
            const frameData = frames[key];
            const spriteFrame = new SpriteFrame();
            spriteFrame.texture = texture;
            spriteFrame.rect.x = frameData.x;
            spriteFrame.rect.y = frameData.y;
            spriteFrame.rect.width = frameData.w;
            spriteFrame.rect.height = frameData.h;

            this.spriteFrames.push(spriteFrame);
            this.positions.push(new Vec2(frameData.offsetX, frameData.offsetY));
        }
    }

    private setupMovieClip(plistData: any) {
        this.movieClip.setFrames(this.spriteFrames);
        this.movieClip.setUpdateGap(1 / plistData.frameRate);
        this.movieClip.setFrameUpdateRender(this.updateSprite.bind(this));
    }

    private updateSprite(frame: SpriteFrame, progress: number) {
        this.sprite.spriteFrame = frame;
        const index = Math.floor(progress * (this.positions.length - 1));
        const position = this.positions[index];
        this.sprite.node.setPosition(position.x, position.y);
    }

    play() {
        this.movieClip.playAnime();
    }

    stop() {
        this.movieClip.stopAnime();
    }

    pause() {
        this.movieClip.pauseAnime();
    }

    resume() {
        this.movieClip.resumeAnime();
    }

    update(dt: number) {
        this.movieClip.update(dt);
    }

    destroy() {
        this.node.destroy();
    }
}








我现在想实现 角色动作的播放器。 比如一个角色 export enum ActType {
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