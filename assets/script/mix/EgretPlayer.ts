import { _decorator, Component, Sprite, SpriteFrame, ImageAsset, Texture2D, UITransform, Vec2, resources } from 'cc';
import MovieClip from '../core/common/render/MovieClip';

const { ccclass, property } = _decorator;


// {"mc":{
// 	"body803_1_0a":{
// 		"frameRate":12,
// 		"frames":[
// 			{"res":"00024","x":-100,"y":-190},
// 			{"res":"00025","x":-189,"y":-209},
// 			{"res":"00026","x":-47,"y":-177},
// 			{"res":"00027","x":-222,"y":-106},
// 			{"res":"00028","x":-265,"y":-105},
// 			{"res":"00029","x":-250,"y":-110},
// 			{"res":"00030","x":-245,"y":-117}
// 		]
// }},
// "res":{
// 	"00024":{"x":920,"y":2,"w":148,"h":198},
// 	"00025":{"x":2,"y":2,"w":248,"h":218},
// 	"00026":{"x":1070,"y":2,"w":298,"h":188},
// 	"00027":{"x":1700,"y":2,"w":274,"h":122},
// 	"00028":{"x":1370,"y":2,"w":328,"h":184},
// 	"00029":{"x":252,"y":2,"w":328,"h":216},
// 	"00030":{"x":582,"y":2,"w":336,"h":206}
// }}


@ccclass('EgretPlayer')
export class EgretPlayer extends Component {
    @property(Sprite)
    private sprite: Sprite = null;

    private movieClip: MovieClip = null;
    private animationData: any = null;
    private spriteFrames: SpriteFrame[] = [];
    private positions: Vec2[] = [];

    async loadAnimation(jsonPath: string, imagePath: string) {
        this.animationData = await this.loadJSON(jsonPath);
        const imageAsset = await this.loadImage(imagePath);
        
        if (!this.animationData || !imageAsset) {
            console.error('Failed to load animation data or image');
            return;
        }

        const texture = new Texture2D();
        texture.image = imageAsset;

        await this.createSpriteFrames(texture);
        this.setupMovieClip();
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

    private async createSpriteFrames(texture: Texture2D) {
        const mcKey = Object.keys(this.animationData.mc)[0]; // Assuming there's only one animation
        const frames = this.animationData.mc[mcKey].frames;
        const res = this.animationData.res;

        frames.forEach(frame => {
            const resData = res[frame.res];
            const spriteFrame = new SpriteFrame();
            spriteFrame.texture = texture;
            spriteFrame.rect.x = resData.x;
            spriteFrame.rect.y = resData.y;
            spriteFrame.rect.width = resData.w;
            spriteFrame.rect.height = resData.h;
            
            this.spriteFrames.push(spriteFrame);
            this.positions.push(new Vec2(frame.x, frame.y));
        });
    }

    private setupMovieClip() {
        this.movieClip = new MovieClip();
        this.movieClip.setFrames(this.spriteFrames);
        this.movieClip.setUpdateGap(1 / this.animationData.mc[Object.keys(this.animationData.mc)[0]].frameRate);
        this.movieClip.setFrameUpdateRender(this.updateSprite.bind(this));
    }

    private updateSprite(frame: SpriteFrame, progress: number) {
        if (this.sprite) {
            this.sprite.spriteFrame = frame;
            const index = Math.floor(progress * (this.positions.length - 1));
            const position = this.positions[index];
            this.sprite.node.setPosition(position.x, position.y);
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

    update(dt: number) {
        if (this.movieClip) {
            this.movieClip.update(dt);
        }
    }
}
