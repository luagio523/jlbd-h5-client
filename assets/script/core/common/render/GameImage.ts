import { Node, Sprite, UITransform, resources, SpriteFrame, Texture2D, assetManager } from 'cc';

/**
 * 游戏图片
 */
export default class GameImage extends Node {
    
    protected renderSprite: Sprite; // 渲染精灵
    protected url: string = ""; // 图片 URL
    public onLoad?: (url: string) => void; // 加载完成回调

    public constructor() {
        super();
        this.renderSprite = this.addComponent(Sprite);
    }

    public setAnchor(x: number, y: number) {
        let transform = this.getComponent(UITransform);
        transform.anchorX = x;
        transform.anchorY = y;
    }

    public isLoad(url: string): boolean {
        return this.url === url && !!this.renderSprite.spriteFrame;
    }

    public set source(url: string) {
        if (this.isLoad(url)) return;
        this.clear(); // 清除原有的
        this.url = url;
        resources.load(url, SpriteFrame, (err, frame) => {
            if (err) {
                console.error(err);
                return;
            }
            this.renderSprite.spriteFrame = frame;
            if (this.onLoad) {
                this.onLoad(url);
            }
        });
    }

    public setTexture(texture: Texture2D) {
        if (this.renderSprite.spriteFrame) {
            this.renderSprite.spriteFrame.texture = texture;
        }
    }

    public clear() {
        if (this.renderSprite.spriteFrame) {
            assetManager.releaseAsset(this.renderSprite.spriteFrame);
            this.renderSprite.spriteFrame = null;
        }
        if (this.url) {
            this.url = "";
        }
    }
    
    public clone(): GameImage {
        let image = new GameImage();
        image.source = this.url;
        return image;
    }

    

    // 释放资源
    public dispose() {
        this.clear();
        this.onLoad = undefined;
    }
}