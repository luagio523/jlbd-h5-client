export type EasingFunction = (t: number) => number;

export default class MovieClip {
    protected curAnimeTime: number = 0;
    protected finishNum: number = 0;
    protected statusPause: boolean = false;
    protected statusStop: boolean = true;
    protected frameIndex: number = 0;

    protected frameTb: any[] = [];
    protected frameCount: number = 0;
    protected updateGap: number = 0.33;
    protected animeTimes: number = 1;
    protected isLoop: boolean = false;
    protected activeInMgr: boolean = false;
    protected frameUpdateRender: Function | null = null;

    // Event callbacks
    protected onStartCallback: Function | null = null;
    protected onUpdateCallback: Function | null = null;
    protected onCompleteCallback: Function | null = null;

    // Easing function
    protected easingFunction: EasingFunction = (t) => t; // Linear easing by default

    public constructor() {
        this.init();
    }

    public init() {
        this.curAnimeTime = 0;
        this.finishNum = 0;
        this.statusPause = false;
        this.statusStop = true;
        this.frameIndex = 0;
        this.animeTimes = 1;
        this.isLoop = false;
        this.activeInMgr = false;
    }

    public setFrameUpdateRender(frameUpdateRender: Function) {
        this.frameUpdateRender = frameUpdateRender;
    }

    public setFrames(frameTb: any[]) {
        this.frameTb = frameTb;
        this.frameCount = frameTb.length;
    }

    public setUpdateGap(updateGap: number) {
        this.updateGap = updateGap;
    }

    public scaleTime(scale: number) {
        if (scale <= 0) {
            console.warn('scale must be greater than 0.');
            return;
        }
        this.updateGap /= scale;
    }

    public get interval(): number {
        return this.updateGap;
    }

    public setAnimeTimes(animeTimes: number) {
        this.finishNum = 0;
        this.animeTimes = animeTimes;
        this.isLoop = animeTimes === 0;
    }

    public onComplete(callback: Function) {
        this.isLoop = false;
        this.onCompleteCallback = callback;
    }

    public setEasingFunction(easingFunction: EasingFunction) {
        this.easingFunction = easingFunction;
    }

    public onStart(callback: Function) {
        this.onStartCallback = callback;
    }

    public onUpdate(callback: Function) {
        this.onUpdateCallback = callback;
    }

   

    public update(dt: number) {
        if (this.statusStop || this.statusPause) {
            return;
        }

        this.curAnimeTime += dt;

        while (this.curAnimeTime >= this.updateGap) {
            this.frameIndex++;
            if (this.frameIndex >= this.frameCount) {
                this.frameIndex = 0;
                if (!this.isLoop) {
                    this.finishNum++;
                    if (this.finishNum >= this.animeTimes) {
                        this.stopAnime();
                        if (this.onCompleteCallback) {
                            this.onCompleteCallback();
                        }
                        return;
                    }
                }
            }
            this.curAnimeTime -= this.updateGap;
            this.rendererCurrentFrame();
        }

        if (this.onUpdateCallback) {
            this.onUpdateCallback(this.frameIndex, this.frameCount);
        }
    }

    public rendererCurrentFrame() {
        if (this.frameUpdateRender && this.frameTb) {
            const currentFrame = this.frameTb[this.frameIndex];
            if (currentFrame) {
                const progress = this.easingFunction(this.frameIndex / (this.frameCount - 1));
                this.frameUpdateRender(currentFrame, progress);
            }
        }
    }

    public getCurrentFrame(): any {
        return this.frameTb ? this.frameTb[this.frameIndex] : null;
    }

    public setSpriteFrameIndex(frameIndex: number) {
        if (frameIndex >= 0 && frameIndex < this.frameCount) {
            this.frameIndex = frameIndex;
            this.rendererCurrentFrame();
        }
    }

    public getTotalTime(): number {
        return this.frameCount * this.updateGap * (this.isLoop ? Infinity : this.animeTimes);
    }

    public get totalFrames(): number {
        return this.frameCount;
    }

    public playAnime() {
        this.statusStop = false;
        if (this.onStartCallback) {
            this.onStartCallback();
        }
    }

    public remove() {
        this.stopAnime();
    }

    public stopAnime() {
        this.statusStop = true;
        this.resetAnime();
    }

    public resumeAnime() {
        this.statusPause = false;
    }

    public resetAnime() {
        this.frameIndex = 0;
        this.curAnimeTime = 0;
        this.finishNum = 0;
        this.rendererCurrentFrame();
    }

    public pauseAnime() {
        this.statusPause = true;
    }

    public isStatusStop(): boolean {
        return this.statusStop;
    }

    public destroy() {
        this.frameTb = [];
        this.frameUpdateRender = null;
        this.onStartCallback = null;
        this.onUpdateCallback = null;
        this.onCompleteCallback = null;
    }
}




// @ccclass('SpriteSequenceAnimator')
// export class SpriteSequenceAnimator extends Component {
//     @property(Sprite)
//     sprite: Sprite | null = null;

//     private movieClip: MovieClip | null = null;

//     start() {
//         this.movieClip = new MovieClip();
//         this.movieClip.setFrameUpdateRender(this.updateSprite.bind(this));
//     }

//     update(dt: number) {
//         if (this.movieClip) {
//             this.movieClip.update(dt);
//         }
//     }

//     setFrames(frames: SpriteFrame[]) {
//         if (this.movieClip) {
//             this.movieClip.setFrames(frames);
//         }
//     }

//     play() {
//         if (this.movieClip) {
//             this.movieClip.playAnime();
//         }
//     }

//     stop() {
//         if (this.movieClip) {
//             this.movieClip.stopAnime();
//         }
//     }

//     pause() {
//         if (this.movieClip) {
//             this.movieClip.pauseAnime();
//         }
//     }

//     resume() {
//         if (this.movieClip) {
//             this.movieClip.resumeAnime();
//         }
//     }

//     setUpdateGap(gap: number) {
//         if (this.movieClip) {
//             this.movieClip.setUpdateGap(gap);
//         }
//     }

//     setAnimeTimes(times: number) {
//         if (this.movieClip) {
//             this.movieClip.setAnimeTimes(times);
//         }
//     }

//     setEasingFunction(easingFunction: (t: number) => number) {
//         if (this.movieClip) {
//             this.movieClip.setEasingFunction(easingFunction);
//         }
//     }

//     onStart(callback: Function) {
//         if (this.movieClip) {
//             this.movieClip.onStart(callback);
//         }
//     }

//     onUpdate(callback: Function) {
//         if (this.movieClip) {
//             this.movieClip.onUpdate(callback);
//         }
//     }

//     onComplete(callback: Function) {
//         if (this.movieClip) {
//             this.movieClip.onComplete(callback);
//         }
//     }

//     private updateSprite(frame: SpriteFrame, progress: number) {
//         if (this.sprite) {
//             this.sprite.spriteFrame = frame;
//             // You can use the progress value for additional effects if needed
//         }
//     }

//     onDestroy() {
//         if (this.movieClip) {
//             this.movieClip.destroy();
//             this.movieClip = null;
//         }
//     }
// }




// import { _decorator, Component, Sprite, SpriteFrame, SpriteAtlas, Animation, AnimationClip, animation } from 'cc';
// const { ccclass, property } = _decorator;

// @ccclass('SequencePlayer')
// export class SequencePlayer extends Component {
//     @property(Sprite)
//     sprite: Sprite = null;

//     @property(SpriteAtlas)
//     atlas: SpriteAtlas = null;

//     @property(Animation)
//     private animation: Animation = null;

//     private currentConfig: any = null;

//     async load(config: {
//         keyPrefix: string,
//         start: number,
//         length: number,
//         interval: number
//     }) {
//         this.currentConfig = config;
//         await this.createAnimationClip(config);
//     }

//     play() {
//         if (this.animation && this.currentConfig) {
//             this.animation.play(this.currentConfig.keyPrefix);
//         }
//     }

//     stop() {
//         if (this.animation) {
//             this.animation.stop();
//         }
//     }

//     private async createAnimationClip(config: any) {
//         const clip = new AnimationClip();
//         clip.name = config.keyPrefix;
//         clip.duration = (config.length * config.interval) / 1000; // 转换为秒
//         clip.wrapMode = AnimationClip.WrapMode.Loop;

//         const frames: SpriteFrame[] = [];
//         for (let i = 0; i < config.length; i++) {
//             const frameName = `${config.keyPrefix}${config.start + i}`;
//             const spriteFrame = this.atlas.getSpriteFrame(frameName);
//             if (spriteFrame) {
//                 frames.push(spriteFrame);
//             } else {
//                 console.warn(`Frame not found: ${frameName}`);
//             }
//         }

//         const track = new animation.ObjectTrack();
//         track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame');
        
//         const ratios: number[] = [];
//         const values: any[] = [];

//         frames.forEach((frame, index) => {
//             ratios.push(index / (config.length - 1));
//             values.push(frame);
//         });

//         track.channel.curve.assignSorted(ratios, values);

//         clip.addTrack(track);

//         if (!this.animation) {
//             this.animation = this.getComponent(Animation) || this.addComponent(Animation);
//         }

//         this.animation.defaultClip = clip;
//         this.animation.createState(clip);
//     }
// }