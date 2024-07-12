
export default class MovieClip {
    protected curAnimeTime: number = 0;
    protected finishNum: number = 0;
    protected statusPause: boolean = false;
    protected statusStop: boolean = true;
    protected frameIndex: number = 0; // 帧序号

    protected frameTb: any[] = [];
    protected frameCount: number = 0; // 总帧数
    protected updateGap: number = 0.33; // 跟新间隔默认值
    protected animeTimes: number = 1;
    protected isLoop: boolean = false; // 是否循环
    protected callback: Function | null = null;
    protected activeInMgr: boolean = false; // 在动画管理器是否活动状态
    protected frameUpdateRender: Function | null = null; // 帧渲染函数　会传递当前帧数据

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

	/**
	 * 秒
	 * @param updateGap 
	 */
    public setUpdateGap(updateGap: number) {
        this.updateGap = updateGap ;
    }

	 /**
     * 调整动画播放的速度
     * @param {number} scale - 播放速度的缩放比例。值大于1将加快动画速度，值小于1将减慢动画速度。
     */
	 public scaleTime(scale: number) {
        if (scale <= 0) {
            console.warn('scale must be greater than 0.');
            return;
        }
        // 用传入的缩放比例调整更新间隔
        this.updateGap /= scale;
    }

    public get interval(): number {
        return this.updateGap ;
    }

    public setAnimeTimes(animeTimes: number) {
        this.finishNum = 0;
        this.animeTimes = animeTimes;
        this.isLoop = animeTimes === 0;
    }

    public setCallback(callback: Function) {
        this.callback = callback;
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
                        if (this.callback) {
                            this.callback();
                        }
                        return;
                    }
                }
            }
            this.curAnimeTime -= this.updateGap;
            this.rendererCurrentFrame();
        }
    }

    public rendererCurrentFrame() {
        if (this.frameUpdateRender && this.frameTb) {
            const currentFrame = this.frameTb[this.frameIndex];
            if (currentFrame) {
                this.frameUpdateRender(currentFrame);
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
        // Optionally reset to the first frame to start from the beginning
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
        this.callback = null;
    }
}