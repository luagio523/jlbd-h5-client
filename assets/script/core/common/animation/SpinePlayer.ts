

import { Component,_decorator, sp, resources} from "cc";
const { ccclass, property } = _decorator;


@ccclass('SpinePlayer')
export class SpinePlayer extends Component {
    @property(sp.Skeleton)
    private skeleton: sp.Skeleton | null = null;

    private animationName: string = '';
    private onCompleteCallback: Function | null = null;

    constructor() {
        super();
    }

    async loadAnimation(spineDataPath: string, animationName: string = "default"): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            resources.load(spineDataPath, sp.SkeletonData, (err, spineData) => {
                if (err) {
                    console.error('Failed to load Spine data:', err);
                    reject(err);
                    return;
                }

                if (this.skeleton) {
                    this.skeleton.skeletonData = spineData;
                    this.skeleton.setAnimation(0, animationName, true);
                    this.skeleton.setCompleteListener(this.onAnimationComplete.bind(this));
                }

                resolve();
            });
        });
    }

    setupAnimation(animationName?: string): void {
        if (animationName) {
            this.animationName = animationName;
        }
        if (this.skeleton) {
            this.playAnimation(this.animationName || 'idle');
        }
    }

    playAnimation(animName: string, loop: boolean = true) {
        if (this.skeleton) {
            this.skeleton.setAnimation(0, animName, loop);
        }
    }

    play(loop: boolean = true) {
        if (this.skeleton && this.animationName) {
            this.skeleton.setAnimation(0, this.animationName, loop);
        }
    }

    stop() {
        if (this.skeleton) {
            this.skeleton.clearTrack(0);
        }
    }

    setUpdateGap(gap: number) {
        if (this.skeleton) {
            this.skeleton.timeScale = 1 / gap;
        }
    }

    setAnimeTimes(times: number) {
        // Spine 的播放次数可以通过 loop 参数控制，通常不需要手动设置播放次数
        this.play(times > 1);
    }

    setOnCompleteCallback(callback: Function) {
        this.onCompleteCallback = callback;
    }

    update(dt: number) {
        // Spine 自动更新，不需要手动调用
    }

    private onAnimationComplete() {
        if (this.onCompleteCallback) {
            this.onCompleteCallback();
        }
    }

    onDestroy() {
        if (this.skeleton) {
            this.skeleton.setCompleteListener(null);
        }
    }
}
