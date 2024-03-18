import { Asset, Node,  assetManager } from "cc";
import { IAssetExpire, LRUCache } from "../../core/common/collection/LRUCache";
import GameImage from "../../core/common/render/GameImage";


class AssetRelase implements IAssetExpire{
    asset :Asset
    public constructor(asset :Asset){
        this.asset = asset
    }
    public onExpire(): void {
        if(this.asset){
            assetManager.releaseAsset(this.asset)  
        }
    }
}

export default class TileImage extends GameImage {
    static lruCache:LRUCache<String,AssetRelase> = new LRUCache<string,AssetRelase>(24)
    public addTo(node:Node){
        if(!this.parent){
            node.addChild(this)
        }
        TileImage.lruCache.access(this.url) //再次利用时,队列标记为新入
    }

    public removeFromParent(): void { //地图过大的时候，需要释放一些资源
        //一段时间不用
        TileImage.lruCache.set(this.url,new AssetRelase(this.renderSprite.spriteFrame)) //移除时丢入 释放队列
        super.removeFromParent()
    }

}