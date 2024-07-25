import { _decorator, Component, Sprite, SpriteFrame } from 'cc';
import MovieClip from './MovieClip';
import { AnimManager } from './AnimManager';
import { IAnimationPlayer } from './IAnimationPlayer';
import { AnimResourceType } from './Type';

const { ccclass, property } = _decorator;

/**
 * 通用mc播放器
 * 支持creator plist atlas 动画,支持Egret SpriteSheet 动画
 */
@ccclass('MCPlayer')
export class MCPlayer implements IAnimationPlayer {
    private sprite: Sprite;
    private movieClip: MovieClip;
    private animManager: AnimManager;
    private resourcePath: string;

    constructor(sprite: Sprite) {
        this.sprite = sprite;
        this.movieClip = new MovieClip();
        this.animManager = AnimManager.getInstance();
    }

    async loadAnimation(type: AnimResourceType, resourcePath: string ) {
        this.resourcePath = resourcePath;
        await this.animManager.loadAnimation(type, resourcePath);
    }

    public setupAnimation(mcKey?: string) {
        this.movieClip.setFrameUpdateRender(this.updateSprite.bind(this));
        const frames = this.animManager.getAnimationData(this.resourcePath, mcKey) || [];
        this.movieClip.setFrames(frames);
    }

    onComplete(callback: Function) {
        this.movieClip.onComplete(callback);
    }
    
    private updateSprite(spriteFrame: SpriteFrame, progress: number) {
        if (this.sprite) {
            this.sprite.spriteFrame = spriteFrame;
            this.sprite.node.setPosition(spriteFrame.offset.x, spriteFrame.offset.y);
        }
    }

    play() { this.movieClip.playAnime(); }
    stop() { this.movieClip.stopAnime(); }
    setFrameRate(rate: number): void { this.movieClip.setFrameRate(rate); }
    setUpdateGap(gap: number) { this.movieClip.setUpdateGap(gap); }
    setAnimeTimes(times: number) { this.movieClip.setAnimeTimes(times); }
    update(dt: number) { this.movieClip.update(dt); }
    
    onDestroy() {
        this.movieClip.destroy();
        this.animManager.releaseAnimation(this.resourcePath);
    }
}









// const sheetPlayer = new MCPlayer();
// await sheetPlayer.loadAnimation(AnimResourceType.EGRET_SPRITE_SHEET, 'path/to/image');
// // 播放动画
// sheetPlayer.play();
