import { Asset, Node,  assetManager } from "cc";
import { IAssetExpire, LRUCache } from "../../core/common/collection/LRUCache";
import GameImage from "../../core/common/render/GameImage";



class AssetRelease implements IAssetExpire {
    private asset: Asset;
    public lastAccessTime: number;

    public constructor(asset: Asset) {
        this.asset = asset;
        this.lastAccessTime = Date.now();
    }

    public updateAsset(asset: Asset): void {
        this.asset = asset;
        this.lastAccessTime = Date.now();
    }

    public onExpire(): void {
        if (this.asset) {
            console.log("TileImage release asset:", this.asset.name);
            assetManager.releaseAsset(this.asset);
        }
    }
}


export default class TileImage extends GameImage {
    static lruCache: LRUCache<string, AssetRelease> = new LRUCache<string, AssetRelease>(24);
    private static readonly MAX_IDLE_TIME = 5 * 60 * 1000; // 5 minutes

    public addTo(node: Node): void {
        if (!this.parent) {
            node.addChild(this);
        }
        TileImage.lruCache.access(this.source);
    }

    public removeFromParent(): void {
        const existingRelease = TileImage.lruCache.get(this.source);
        if (existingRelease) {
            existingRelease.updateAsset(this.renderSprite.spriteFrame);
        } else {
            TileImage.lruCache.set(this.source, new AssetRelease(this.renderSprite.spriteFrame));
        }
        super.removeFromParent();
    }

    public static cleanupIdleAssets(): void {
        const now = Date.now();
        for (const [key, assetRelease] of TileImage.lruCache.entries()) {
            if (now - assetRelease.lastAccessTime > TileImage.MAX_IDLE_TIME) {
                TileImage.lruCache.delete(key);
            }
        }
    }
}


