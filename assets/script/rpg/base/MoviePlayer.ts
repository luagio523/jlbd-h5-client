import { _decorator, Component, Sprite, SpriteFrame, SpriteAtlas, resources,  Vec2, UITransform } from 'cc';
import MovieClip from './MovieClip';
import app from '../../App';

const { ccclass, property } = _decorator;

export interface MovieData {
    interval: number;
    times?: number;
    animUrl: string;
    frameKey: string;
    start?: number;
    length?: number;
    scale: number;
    anchorX: number;
    anchorY: number;
    frameTb?: Array<SpriteFrame>;
}

@ccclass('MoviePlayer')
export class MoviePlayer extends Component {
    public static DEFAULT_MOVIE_INTERVAL: number = 200; // 默认动画间隔

    @property(Sprite)
    private sprite: Sprite | null = null;

    private movieClip: MovieClip;
    private animName: string | null = null;
    private movieMap: { [key: string]: MovieData } = {};
    private onCompleteCallback: Function | null = null;

    onLoad() {
        this.movieClip = new MovieClip();
        this.movieClip.setFrameUpdateRender(this.updateFrame.bind(this));
        this.movieClip.setSpriteFrameIndex(0);
        this.movieClip.onComplete(this.handleAnimationComplete.bind(this));
    }

    update(dt: number) {
        this.movieClip?.update(dt);
    }

    public playAnime(animName: string, onComplete?: Function): void {
        if (!animName) return;
        
        this.onCompleteCallback = onComplete;
        
        if (this.animName === animName) {
            this.movieClip.setSpriteFrameIndex(0);
            return;
        }
        
        this.animName = animName;
        const movieData = this.getOrLoadMovieData(animName);
        
        if (movieData) {
            this.applyMovieData(movieData);
        }
    }

    private getOrLoadMovieData(animName: string): MovieData | null {
        let movieData = this.movieMap[animName];
        if (!movieData) {
            movieData = app.config.get("animation")[animName];
            if (movieData) {
                this.movieMap[animName] = movieData;
            }
        }
        return movieData;
    }

    private applyMovieData(movieData: MovieData): void {
        this.setScale(movieData.scale);
        this.setAnchor(movieData.anchorX, movieData.anchorY);

        if (movieData.frameTb) {
            this.playWithFrames(movieData.frameTb);
        } else {
            this.loadAndPlayAnimation(movieData);
        }
    }

    private setScale(scale: number): void {
        this.node.setScale(scale,scale);
    }

    private setAnchor(x: number, y: number): void {
        const transform = this.getComponent(UITransform);
        if (transform) {
            transform.setAnchorPoint(new Vec2(x, y));
        }
    }

    private playWithFrames(frames: Array<SpriteFrame>): void {
        this.movieClip.setFrames(frames);
        this.movieClip.playAnime();
    }

    private loadAndPlayAnimation(movieData: MovieData): void {
        resources.load(movieData.animUrl, SpriteAtlas, (err, atlas) => {
            if (err) {
                console.error("Failed to load animation:", err);
                return;
            }
            if (atlas && this.node.active) {
                const frames = this.createFramesFromAtlas(atlas, movieData);
                movieData.frameTb = frames;
                this.playWithFrames(frames);
            }
        });
    }

    private createFramesFromAtlas(atlas: SpriteAtlas, movieData: MovieData): SpriteFrame[] {
        const frameFormat = this.getFrameFormat(movieData.frameKey);
        const start = movieData.start || 0;
        const length = movieData.length || -1;
        return this.getFrames(atlas, frameFormat, start, length);
    }

    private getFrames(atlas: SpriteAtlas, frameName: string, start: number, length: number): SpriteFrame[] {
        const frames: SpriteFrame[] = [];
        const end = length < 0 ? Number.MAX_SAFE_INTEGER : start + length;
        
        for (let i = start; i < end; i++) {
            const frame = atlas.getSpriteFrame(frameName.replace('%d', i.toString()));
            if (frame) {
                frames.push(frame);
            } else {
                break; // Stop if we can't find the next frame
            }
        }
        
        return frames;
    }

    private getFrameFormat(frameKey: string): string {
        return `${frameKey}_%d`;
    }

    public setUpdateGap(interval: number): void {
        this.movieClip.setUpdateGap(interval || MoviePlayer.DEFAULT_MOVIE_INTERVAL);
    }

    public setSpriteFrameIndex(index: number): void {
        this.movieClip.setSpriteFrameIndex(index);
    }

    public get clip(): MovieClip {
        return this.movieClip;
    }

    private updateFrame(frame: SpriteFrame): void {
        if (this.sprite) {
            this.sprite.spriteFrame = frame;
        }
    }

    private handleAnimationComplete(): void {
        if (this.onCompleteCallback) {
            this.onCompleteCallback();
        }
    }

    // New methods
    public setEasingFunction(easingFunction: (t: number) => number): void {
        this.movieClip.setEasingFunction(easingFunction);
    }

    public setAnimeTimes(times: number): void {
        this.movieClip.setAnimeTimes(times);
    }

    public pauseAnime(): void {
        this.movieClip.pauseAnime();
    }

    public resumeAnime(): void {
        this.movieClip.resumeAnime();
    }

    public stopAnime(): void {
        this.movieClip.stopAnime();
    }

    onDestroy() {
        this.movieClip?.destroy();
    }
}