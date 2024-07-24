import { Node, Sprite, SpriteFrame, resources, Texture2D, ImageAsset, Vec2, dragonBones } from 'cc';

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








我现在想实现 角色动作的播放器。可能8方向可能四方向 比如一个角色 export enum ActType {
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
}  这些动作。
我现在 有很多不同的资源，比如 egret的序列帧资源
{"mc":{
	"body803_1_0a":{
		"frameRate":12,
		"frames":[
			{"res":"00024","x":-100,"y":-190},
			{"res":"00025","x":-189,"y":-209},
			{"res":"00026","x":-47,"y":-177},
			{"res":"00027","x":-222,"y":-106},
			{"res":"00028","x":-265,"y":-105},
			{"res":"00029","x":-250,"y":-110},
			{"res":"00030","x":-245,"y":-117}
		]
}},
"res":{
	"00024":{"x":920,"y":2,"w":148,"h":198},
	"00025":{"x":2,"y":2,"w":248,"h":218},
	"00026":{"x":1070,"y":2,"w":298,"h":188},
	"00027":{"x":1700,"y":2,"w":274,"h":122},
	"00028":{"x":1370,"y":2,"w":328,"h":184},
	"00029":{"x":252,"y":2,"w":328,"h":216},
	"00030":{"x":582,"y":2,"w":336,"h":206}
}}  其中body803_1_0a 是文件名。 body803是模型名  1 表示男生   后面的0是方向的意思。 a表示attack 攻击。

另外我还有 所有动作都放一个合图plist的。 
<plist version="1.0">
    <dict>
        <key>frames</key>
        <dict>
            <key>Heavy_a_1.png</key>
            <dict>
                <key>frame</key>
                <string>{{574,1874},{74,118}}</string>
                <key>offset</key>
                <string>{3,2}</string>
                <key>rotated</key>
                <false/>
                <key>sourceColorRect</key>
                <string>{{56,29},{74,118}}</string>
                <key>sourceSize</key>
                <string>{180,180}</string>
            </dict>
            <key>Heavy_a_2.png</key>
            Heavy_a_1.png   Heavy 是模型名  a 表示攻击 1表示帧数 
另外我还有骨骼动画,spine ,dragon. 

我该如何去抽象，适配这些资源呢？请提供完整代码。