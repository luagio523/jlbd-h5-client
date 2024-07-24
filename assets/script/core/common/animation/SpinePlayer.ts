

import { Component, dragonBones ,_decorator, sp} from "cc";
const { ccclass, property } = _decorator;
@ccclass('SpinePlayer')
export class SpinePlayer extends Component implements IAnimationPlayer {
    @property(sp.Skeleton)
    private skeleton: sp.Skeleton | null = null;

    private animationName: string = '';
    private onCompleteCallback: Function | null = null;

    async loadAnimation(jsonPath: string, atlasPath: string, texturePath: string): Promise<void> {
        // 加载 Spine 资源
        // 这里需要根据 Cocos Creator 的资源加载系统进行适当的实现
    }

    setupAnimation(animationName: string) {
        this.animationName = animationName;
    }

    play() {
        if (this.skeleton && this.animationName) {
            this.skeleton.setAnimation(0, this.animationName, true);
            this.skeleton.setCompleteListener(() => {
                if (this.onCompleteCallback) {
                    this.onCompleteCallback();
                }
            });
        }
    }

    stop() {
        if (this.skeleton) {
            this.skeleton.clearTrack(0);
        }
    }

    pause() {
        if (this.skeleton) {
            this.skeleton.paused = true;
        }
    }

    resume() {
        if (this.skeleton) {
            this.skeleton.paused = false;
        }
    }

    setUpdateGap(gap: number) {
        // Spine 没有直接对应的方法，可以考虑使用 timeScale
        if (this.skeleton) {
            this.skeleton.timeScale = 1 / gap;
        }
    }

    setAnimeTimes(times: number) {
        // Spine 没有直接设置播放次数的方法，可以在 complete 回调中处理
    }

    setEasingFunction(easingFunction: (t: number) => number) {
        // Spine 没有直接设置缓动函数的方法
    }

    setOnCompleteCallback(callback: Function) {
        this.onCompleteCallback = callback;
    }

    update(dt: number) {
        // Spine 自动更新，不需要手动调用
    }
}