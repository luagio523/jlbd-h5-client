import { _decorator, Component, Sprite, SpriteFrame } from 'cc';
import MovieClip from './MovieClip';
import { AnimResManager } from './AnimResManager';
import { IAnimationPlayer } from './IAnimationPlayer';
import { AnimResourceType } from './Type';

const { ccclass, property } = _decorator;

/**
 * 通用mc播放器
 * 支持creator plist atlas 动画,支持Egret SpriteSheet 动画
 */
export class MCPlayer implements IAnimationPlayer {
    private sprite: Sprite | null = null;
    private movieClip: MovieClip;
    private resourceType: AnimResourceType = null;
    private resourcePath: string = '';
    private AnimResManager: AnimResManager;
    private initialSpriteFrame: SpriteFrame | null = null;

    constructor(sprite: Sprite) {
        this.sprite = sprite;
        this.movieClip = new MovieClip();
        this.AnimResManager = AnimResManager.getInstance();
    }

    setComponent(component: Component): void {
        this.sprite = component as Sprite;
        this.initialSpriteFrame = this.sprite.spriteFrame;
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

    public setupAnimation(mcKey?: string): void {
        this.movieClip.setFrameUpdateRender(this.updateSprite.bind(this));
        const frames = this.AnimResManager.getAnimationData(this.resourcePath, mcKey) || [];
        if (frames.length === 0) {
            console.warn(`can not find animation data for ${this.resourcePath} ${mcKey}`);
            return;
        }
        this.movieClip.setFrames(frames);
    }

    onComplete(callback: Function): void {
        this.movieClip.onComplete(callback);
    }

    private updateSprite(spriteFrame: SpriteFrame, progress: number): void {
        if (this.sprite) {
            this.sprite.spriteFrame = spriteFrame;
            this.sprite.node.setPosition(spriteFrame.offset.x, spriteFrame.offset.y);
        }
    }

    play(times: number = 0): void {
        this.movieClip.setAnimeTimes(times);
        this.movieClip.playAnime();
    }

   
    stop(): void {
        this.movieClip.stopAnime();
        this.resetSprite(); //还原到初始状态
    }

    private resetSprite(): void {
        if (this.sprite && this.initialSpriteFrame) {
            this.sprite.spriteFrame = this.initialSpriteFrame;
            this.sprite.node.setPosition(0, 0); // 重置位置
        }
    }

    setFrameRate(rate: number): void {
        this.movieClip.setFrameRate(rate);
    }

    setUpdateGap(gap: number): void {
        this.movieClip.setUpdateGap(gap);
    }

    setAnimeTimes(times: number): void {
        this.movieClip.setAnimeTimes(times);
    }

    update(dt: number): void {
        this.movieClip.update(dt);
    }
    
    reset(): void {
        this.stop();
        this.movieClip.destroy();
        this.sprite = null;
        this.resourceType = null;
        this.resourcePath = '';
    }
}