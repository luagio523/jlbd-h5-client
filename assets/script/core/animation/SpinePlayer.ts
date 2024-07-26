import { Component, _decorator, sp } from "cc";
import { AnimResManager } from "./AnimResManager";
import { IAnimationPlayer } from "./IAnimationPlayer";
import { AnimResourceType } from "./Type";
const { ccclass, property } = _decorator;

export class SpinePlayer implements IAnimationPlayer {
    private skeleton: sp.Skeleton | null = null;
    private animationName: string = '';
    private onCompleteCallback: Function | null = null;
    private AnimResManager: AnimResManager;
    private resourceType: AnimResourceType = null;
    private resourcePath: string = '';
    private playTimes: number = 0;
    private currentPlayCount: number = 0;

    constructor(skeleton: sp.Skeleton) {
        this.skeleton = skeleton;
        this.AnimResManager = AnimResManager.getInstance();
    }

    setComponent(component: Component): void {
        this.skeleton = component as sp.Skeleton;
    }

    async loadAnimation(type: AnimResourceType, resourcePath: string): Promise<void> {
        this.resourceType = type;
        this.resourcePath = resourcePath;
        if (!this.AnimResManager.hasAnimation(resourcePath)) {
            await this.AnimResManager.loadAnimation(type, resourcePath);
        }
    }

    public getResourceType(): AnimResourceType {
        return this.resourceType;
    }

    setupAnimation(animationName?: string): void {
        const spineData = this.AnimResManager.getAnimationData(this.resourcePath, "default") as sp.SkeletonData;

        if (spineData && this.skeleton) {
            this.skeleton.skeletonData = spineData;
            if (animationName) {
                this.animationName = animationName;
            }
            this.skeleton.setCompleteListener(this.onAnimationComplete.bind(this));
        }
    }

    play(times: number = 0) {
        this.playTimes = times;
        this.currentPlayCount = 0;
        if (this.skeleton && this.animationName) {
            this.skeleton.setAnimation(0, this.animationName, times === 0);
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

    setAnimeTimes(times: number) {
        this.play(times);
    }

    update(dt: number) {
        // Spine 自动更新，不需要手动调用
    }

    dispose() {
        if (this.skeleton) {
             // 停止当前正在播放的动画
            this.stop();
            this.skeleton.setCompleteListener(null);
            this.skeleton = null;
        }
        // 清除其他引用
        this.resourceType = null;
        this.resourcePath = '';
        this.animationName = '';
        this.onCompleteCallback = null;
    }
}