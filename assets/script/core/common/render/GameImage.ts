
import { _decorator, Node, Sprite, SpriteFrame, UITransform, Texture2D, resources, assetManager } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameImage')
export default class GameImage extends Node {
    @property(Sprite)
    protected renderSprite: Sprite = null!;

    @property
    private _url: string = "";

    @property({type: Function})
    public onLoad: ((url: string) => void) | null = null;

    constructor() {
        super();
        if (!this.renderSprite) {
            this.renderSprite = this.addComponent(Sprite);
        }
    }

    public setAnchor(x: number, y: number): void {
        const transform = this.getComponent(UITransform);
        transform.setAnchorPoint(x, y);
    }

    public isLoaded(url: string): boolean {
        return this._url === url && !!this.renderSprite.spriteFrame;
    }

    public get source(): string {
        return this._url;
    }

    public set source(url: string) {
        if (this.isLoaded(url)) return;
        this.clear();
        this._url = url;
        this.loadSpriteFrame(url);
    }

    private loadSpriteFrame(url: string): void {
        resources.load(url, SpriteFrame, (err, frame) => {
            if (err) {
                console.error(`Failed to load sprite frame: ${url}`, err);
                return;
            }
            if (this._url !== url) return; // URL可能在加载过程中已经改变
            this.renderSprite.spriteFrame = frame;
            this.onLoad?.call(this, url);
        });
    }

    public setTexture(texture: Texture2D): void {
        if (this.renderSprite.spriteFrame) {
            this.renderSprite.spriteFrame.texture = texture;
        } else {
            this.renderSprite.spriteFrame = new SpriteFrame();
            this.renderSprite.spriteFrame.texture = texture;
        }
    }

    public clear(): void {
        if (this.renderSprite.spriteFrame) {
            assetManager.releaseAsset(this.renderSprite.spriteFrame);
            this.renderSprite.spriteFrame = null;
        }
        this._url = "";
    }
    
    public clone(): GameImage {
        const image = new GameImage();
        image.source = this._url;
        return image;
    }

    public dispose(): void {
        this.clear();
        this.onLoad = null;
    }
}
