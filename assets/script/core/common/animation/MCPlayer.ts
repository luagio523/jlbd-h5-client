import { _decorator, Component, Sprite, SpriteFrame, Vec2, Texture2D, ImageAsset, resources, SpriteAtlas, JsonAsset,Asset } from 'cc';
import MovieClip from './MovieClip';
import { BaseMCLoader } from './MCLoader';

const { ccclass, property } = _decorator;

/**
 * 通用mc播放器
 * 支持creator plist atlas 动画,支持Egret SpriteSheet 动画
 */
@ccclass('MCPlayer')
export class MCPlayer extends Component implements IAnimationPlayer{
    @property(Sprite)
    private sprite: Sprite | null = null;

    private loader: BaseMCLoader;
    private movieClip: MovieClip | null = null;
    private onCompleteCallback: Function | null = null;

    constructor(loader: BaseMCLoader) {
        super();
        this.loader = loader;
    }

    async loadAnimation(...args: any[]) {
        await this.loader.loadAnimation(...args);
        this.setupAnimation();
    }

    public setupAnimation(mcKey?: string) {
        if (!this.movieClip) {
            this.movieClip = new MovieClip();
            this.movieClip.setFrameUpdateRender(this.updateSprite.bind(this));
            this.movieClip.onComplete(() => {
                if (this.onCompleteCallback) {
                    this.onCompleteCallback();
                }
            });
        }
        const frames = this.loader.getAnimationData(mcKey) || [];
        this.movieClip.setFrames(frames);
    }

    setOnCompleteCallback(callback: Function) {
        this.onCompleteCallback = callback;
    }
    
    private updateSprite(spriteFrame: SpriteFrame, progress: number) {
        if (this.sprite) {
            this.sprite.spriteFrame = spriteFrame;
            this.sprite.node.setPosition(spriteFrame.offset.x, spriteFrame.offset.y);
        }
    }

    play() { 
        this.movieClip?.playAnime(); 
    }
    stop() { this.movieClip?.stopAnime(); }
    setUpdateGap(gap: number) { this.movieClip?.setUpdateGap(gap); }
    setAnimeTimes(times: number) { this.movieClip?.setAnimeTimes(times); }
    update(dt: number) { this.movieClip?.update(dt); }
    onDestroy() { this.movieClip?.destroy(); }
}








// // 使用 SpriteSheetLoader
// const sheetLoader = new SpriteSheetLoader();
// const sheetPlayer = new MCPlayer(sheetLoader);
// await sheetPlayer.loadAnimation('path/to/json', 'path/to/image');

// // 使用 SpriteAtlasLoader
// const atlasLoader = new SpriteAtlasLoader();
// const atlasPlayer = new MCPlayer(atlasLoader);
// await atlasPlayer.loadAnimation('path/to/atlas');

// // 播放动画
// sheetPlayer.play();
// atlasPlayer.play();
