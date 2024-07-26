import { sys } from "cc";

export type EasingFunction = (t: number) => number;

export default class MovieClip {
    protected curAnimeTime: number = 0;
    protected finishNum: number = 0;
    protected statusPause: boolean = false;
    protected statusStop: boolean = true;
    protected frameIndex: number = 0;

    protected frameTb: any[] = [];
    protected frameCount: number = 0;
    protected updateGap: number = 0.033;
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

    public setFrameRate(frameRate: number) {
        this.updateGap = 1 / frameRate;
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

        let frameUpdated = false;

        while (this.curAnimeTime >= this.updateGap) {
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
            frameUpdated = true;
            this.frameIndex++;
        }

        if (frameUpdated && this.onUpdateCallback) {
            this.onUpdateCallback(this.frameIndex, this.frameCount);
        }
    }

    public rendererCurrentFrame() {
        if (this.frameUpdateRender && this.frameTb) {
            const currentFrame = this.frameTb[this.frameIndex];
            if (currentFrame) {
                // const progress = this.easingFunction(this.frameIndex / (this.frameCount - 1));
                // this.frameUpdateRender(currentFrame, progress);

                this.frameUpdateRender(currentFrame);
            }
        }
    }

    public playAnime() {
        this.statusStop = false;
        this.statusPause = false;
        this.resetAnime(); // 重置动画状态
        this.rendererCurrentFrame(); // 立即渲染第一帧
        if (this.onStartCallback) {
            this.onStartCallback();
        }
    }

    public resetAnime() {
        this.frameIndex = 0;
        this.curAnimeTime = 0;
        this.finishNum = 0;
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
