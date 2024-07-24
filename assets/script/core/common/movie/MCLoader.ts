
import { _decorator,  SpriteFrame, Vec2, Texture2D, ImageAsset, resources, SpriteAtlas, JsonAsset,Asset } from 'cc';


// 基础加载器类
export abstract class BaseMCLoader {
    protected spriteFramesMap: Map<string, SpriteFrame[]> = new Map();

    abstract loadAnimation(...args: any[]): Promise<void>;
    abstract getAnimationData(key?: string): SpriteFrame[] | null;

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


export class SpriteSheetLoader extends BaseMCLoader {
    private animationData: any = null;

    async loadAnimation(jsonPath: string, imagePath: string) {
        try {
            this.animationData = await this.loadResource<JsonAsset>(jsonPath,JsonAsset);
            const imageAsset = await this.loadResource<ImageAsset>(imagePath, ImageAsset);

            if (!this.animationData || !imageAsset) {
                console.error('Failed to load animation data or image');
                return;
            }

            const texture = new Texture2D();
            texture.image = imageAsset;

            await this.createSpriteFrames(texture);
        } catch (error) {
            console.error('Error loading animation:', error);
        }
    }

    private async createSpriteFrames(texture: Texture2D) {
        const mcKeys = Object.keys(this.animationData.mc);
        mcKeys.forEach(mcKey => {
            const frames = this.animationData.mc[mcKey].frames;
            const res = this.animationData.res;
            this.spriteFramesMap.set(mcKey, []);

            frames.forEach(frame => {
                const resData = res[frame.res];
                if (resData) {
                    const spriteFrame = new SpriteFrame();
                    spriteFrame.texture = texture;
                    spriteFrame.rect.set(resData.x, resData.y, resData.w, resData.h);
                    spriteFrame.offset.set(frame.x, frame.y);
                    this.spriteFramesMap.get(mcKey)?.push(spriteFrame);
                }
            });
        });
    }

    getAnimationData(mcKey?: string): SpriteFrame[] | null {
        if (!mcKey) {
            mcKey = this.spriteFramesMap.keys().next().value;
        }
        return this.spriteFramesMap.get(mcKey) || null;
    }
}


export class SpriteAtlasLoader extends BaseMCLoader {
    async loadAnimation(atlasPath: string) {
        try {
            const spriteAtlas = await this.loadResource<SpriteAtlas>(atlasPath, SpriteAtlas);
            if (!spriteAtlas) {
                console.error('Failed to load sprite atlas');
                return;
            }
            this.createSpriteFrames(spriteAtlas);
        } catch (error) {
            console.error('Error loading animation:', error);
        }
    }

    private createSpriteFrames(spriteAtlas: SpriteAtlas) {
        const spriteFrames = spriteAtlas.getSpriteFrames();
        spriteFrames.forEach(spriteFrame => {
            const animKey = this.getAnimationKey(spriteFrame.name);
            if (!this.spriteFramesMap.has(animKey)) {
                this.spriteFramesMap.set(animKey, []);
            }
            this.spriteFramesMap.get(animKey)?.push(spriteFrame);
        });
    }

    private getAnimationKey(frameName: string): string {
        return frameName.split('_').slice(0, -1).join('_');
    }

    getAnimationData(animKey?: string): SpriteFrame[] | null {
        if (!animKey) {
            animKey = this.spriteFramesMap.keys().next().value;
        }
        return this.spriteFramesMap.get(animKey) || null;
    }
}
