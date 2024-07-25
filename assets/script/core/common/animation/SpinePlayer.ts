

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
        const spineData = this.animManager.getAnimationData(this.resourcePath) as sp.SkeletonData;

        if (spineData && this.skeleton) {
            this.skeleton.skeletonData = spineData;
            this.skeleton.setAnimation(0, animationName, true);
            this.skeleton.setCompleteListener(this.onAnimationComplete.bind(this));
        }

        this.animationName = animationName;

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

    setFrameRate(rate: number): void {
        this.setUpdateGap(1 / rate);
    }

    setAnimeTimes(times: number) {
        this.play(times > 1);
    }

    onComplete(callback: Function) {
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
        this.animManager.releaseAnimation(this.resourcePath);
    }
}
