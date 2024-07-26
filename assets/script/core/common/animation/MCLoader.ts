
import { _decorator,  SpriteFrame, Vec2, Texture2D, ImageAsset, resources, SpriteAtlas, JsonAsset,Asset, Rect, Size, dragonBones, sp } from 'cc';
import { AnimResourceType } from './Type';






// 基础加载器类
export abstract class BaseMCLoader {
    protected animationDataMap: Map<string, any> = new Map();

    abstract loadAnimation(resourcePath: string): Promise<Asset[]>;
    abstract getAnimationData(key?: string): any;
    reset(): void{
        this.animationDataMap.clear();
    }

    protected async loadResource<T extends Asset>(path: string, type: { new (): T }): Promise<T> {
        return new Promise((resolve, reject) => {
            resources.load(path, type, (err, asset) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(asset as T);
                }
            });
        });
    }
}


/**
 * 确保json,image 文件名字一致
 */
export class SpriteSheetLoader extends BaseMCLoader {

    async loadAnimation(resourcePath: string): Promise<Asset[]> {
        try {
            const jsonAsset = await this.loadResource<JsonAsset>(resourcePath, JsonAsset);
            const imageAsset = await this.loadResource<ImageAsset>(resourcePath, ImageAsset);

            if (!jsonAsset || !imageAsset) {
                console.error('Failed to load animation data or image');
                return [];
            }
            let texture = new Texture2D();
            texture.image = imageAsset;
            await this.createSpriteFrames(jsonAsset.json,texture);
            return [jsonAsset, imageAsset];
        } catch (error) {
            console.error('Error loading animation:', error);
            return [];
        }
    }

    private async createSpriteFrames(animationData:any,texture: Texture2D) {
        // console.log('createSpriteFrames', animationData);

        const mcKeys = Object.keys(animationData.mc);
        mcKeys.forEach(mcKey => {
            const frames = animationData.mc[mcKey].frames;
            const res = animationData.res;
            this.animationDataMap.set(mcKey, []);
            frames.forEach(frame => {
                const resData = res[frame.res];
                
                if (resData) {
                    const spriteFrame = new SpriteFrame();
                    spriteFrame.texture = texture;
                    spriteFrame.rect.set(resData.x, resData.y, resData.w, resData.h);
                     // 设置矩形区域（注意：Cocos Creator 3.x 中，y 坐标是从底部向上的）
                    // const textureHeight = texture.height;
                     // 设置偏移（如果需要的话）
                    // spriteFrame.offset = new Vec2(frame.x, -frame.y);
                    // spriteFrame.offset = new Vec2(frame.x, frame.y);
                    // 设置原始大小
                    spriteFrame.originalSize = new Size(resData.w, resData.h);
                    // 确保 Sprite 组件使用正确的尺寸模式
                    // spriteComp.sizeMode = Sprite.SizeMode.CUSTOM;
                    this.animationDataMap.get(mcKey)?.push(spriteFrame);
                }
            });
        });
    }

    getAnimationData(mcKey?: string): SpriteFrame[] | null {
        if (!mcKey) {
            mcKey = this.animationDataMap.keys().next().value;
        }
        return this.animationDataMap.get(mcKey) || null;
    }

}


export class SpriteAtlasLoader extends BaseMCLoader {
    async loadAnimation(atlasPath: string): Promise<Asset[]> {
        try {
            let spriteAtlas = await this.loadResource<SpriteAtlas>(atlasPath, SpriteAtlas);
            if (!spriteAtlas) {
                console.error('Failed to load sprite atlas');
                return [];
            }
            this.createSpriteFrames(spriteAtlas);
            return [spriteAtlas];
        } catch (error) {
            console.error('Error loading animation:', error);
            return [];
        }
    }

    private createSpriteFrames(spriteAtlas: SpriteAtlas) {
        const spriteFrames = spriteAtlas.getSpriteFrames();
        spriteFrames.forEach(spriteFrame => {
            const animKey = this.getAnimationKey(spriteFrame.name);
            if (!this.animationDataMap.has(animKey)) {
                this.animationDataMap.set(animKey, []);
            }
            this.animationDataMap.get(animKey)?.push(spriteFrame);
        });
    }

    private getAnimationKey(frameName: string): string {
        return frameName.split('_').slice(0, -1).join('_');
    }

    getAnimationData(animKey?: string): SpriteFrame[] | null {
        if (!animKey) {
            animKey = this.animationDataMap.keys().next().value;
        }
        return this.animationDataMap.get(animKey) || null;
    }
    
}


export class DragonLoader extends BaseMCLoader {
    async loadAnimation(resourcePath: string): Promise<Asset[]> {
        const [dragonBonesAsset, atlasAsset] = await Promise.all([
            this.loadResource<dragonBones.DragonBonesAsset>(resourcePath, dragonBones.DragonBonesAsset),
            this.loadResource<dragonBones.DragonBonesAtlasAsset>(resourcePath, dragonBones.DragonBonesAtlasAsset)
        ]);
        this.animationDataMap.set('dragon',  {dragonBonesAsset: dragonBonesAsset, atlasAsset: atlasAsset } )
        return [dragonBonesAsset, atlasAsset];
    }

    getAnimationData(key: string = 'dragon'): { dragonBonesAsset: dragonBones.DragonBonesAsset, atlasAsset: dragonBones.DragonBonesAtlasAsset }  {
        return this.animationDataMap.get(key) || null;
    }
}


export class SpineLoader extends BaseMCLoader {
    async loadAnimation(resourcePath: string): Promise<Asset[]> {
        try {
            const spineData = await this.loadResource<sp.SkeletonData>(resourcePath, sp.SkeletonData);
            this.animationDataMap.set('skeleton', spineData);
            return [spineData];
        } catch (error) {
            console.error('Error loading Spine animation:', error);
            return [];
        }
    }

    getAnimationData(key: string = 'skeleton'): sp.SkeletonData | null {
        return this.animationDataMap.get(key) || null;
    }
}




export class LoaderFactory {
    private static loaderMap: Map<AnimResourceType, new () => BaseMCLoader> = new Map<AnimResourceType, new () => BaseMCLoader>([
        [AnimResourceType.SpriteAltas, SpriteAtlasLoader],
        [AnimResourceType.EgretSpriteSheet, SpriteSheetLoader],
        [AnimResourceType.DragonBones, DragonLoader],  // 添加 DragonLoader
        [AnimResourceType.Spine, SpineLoader],  // 添加 DragonLoader
    ]);

    static createLoader(type: AnimResourceType): BaseMCLoader {
        const LoaderClass = this.loaderMap.get(type);
        if (!LoaderClass) {
            throw new Error(`Unsupported animation type: ${type}`);
        }
        return new LoaderClass();
    }

    static getLoaderType(loader: BaseMCLoader): string {
        for (const [type, LoaderClass] of this.loaderMap.entries()) {
            if (loader instanceof LoaderClass) {
                return type;
            }
        }
        throw new Error('Unknown loader type');
    }
}