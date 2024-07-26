

import { Component,_decorator, sp, resources} from "cc";
import { AnimManager } from "./AnimManager";
import { IAnimationPlayer } from "./IAnimationPlayer";
import { AnimResourceType } from "./Type";
const { ccclass, property } = _decorator;

export class SpinePlayer implements IAnimationPlayer {
    private skeleton: sp.Skeleton | null = null;
    private animationName: string = '';
    private onCompleteCallback: Function | null = null;
    private animManager: AnimManager;
    private resourcePath: string = '';
    private playTimes: number = 0;
    private currentPlayCount: number = 0;

    constructor(skeleton: sp.Skeleton) {
        this.skeleton = skeleton;
        this.animManager = AnimManager.getInstance();
    }

    async loadAnimation(type:AnimResourceType,resourcePath: string): Promise<void> {
        this.resourcePath = resourcePath;
        if (!this.animManager.hasAnimation(resourcePath)) {
            await this.animManager.loadAnimation(type, resourcePath);
        }
    }

    setupAnimation(animationName?: string): void {
        const spineData = this.animManager.getAnimationData(this.resourcePath,"default") as sp.SkeletonData;

        if (spineData && this.skeleton) {
            this.skeleton.skeletonData = spineData;
            this.skeleton.setAnimation(0, animationName, true);
            this.skeleton.setCompleteListener(this.onAnimationComplete.bind(this));
        }

        this.animationName = animationName;

        if (this.skeleton) {
            //this.play();
        }
    }

    play(times: number = 0) {
        this.playTimes = times;
        this.currentPlayCount = 0;
        if (this.skeleton && this.animationName) {
            if (times === 0) {
                this.skeleton.setAnimation(0, this.animationName, true);
            } else {
                this.skeleton.setAnimation(0, this.animationName, false);
            }
        }
    }

    private onAnimationComplete() {
        if (this.playTimes === 0) {
            return;
        }

        this.currentPlayCount++;
        if (this.currentPlayCount < this.playTimes) {
            if (this.skeleton && this.animationName) {
                this.skeleton.setAnimation(0, this.animationName, false);
            }
        } else {
            if (this.onCompleteCallback) {
                this.onCompleteCallback();
            }
        }
    }

    onComplete(callback: Function) {
        this.onCompleteCallback = callback;
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

    setFrameRate(rate: number): void {
        this.setUpdateGap(1 / rate);
    }

    update(dt: number) {
        // Spine 自动更新，不需要手动调用
    }

    onDestroy() {
        if (this.skeleton) {
            this.skeleton.setCompleteListener(null);
        }
        // this.animManager.releaseAnimation(this.resourcePath); 不需要在这里释放资源，因为可能还有其他地方使用
    }
}