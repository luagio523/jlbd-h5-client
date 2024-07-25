import { Asset, SpriteFrame,  resources } from "cc";
import { BaseMCLoader, LoaderFactory } from "./MCLoader";
import { AnimResourceType } from "./Type";

export class AnimManager {
    private static instance: AnimManager;
    private loaders: Map<string, BaseMCLoader> = new Map();
    private loadedAssets: Map<string, Asset[]> = new Map();
    private loaderPool: Map<string, BaseMCLoader[]> = new Map();

    private constructor() {}

    public static getInstance(): AnimManager {
        if (!AnimManager.instance) {
            AnimManager.instance = new AnimManager();
        }
        return AnimManager.instance;
    }

    private getLoader(type: AnimResourceType): BaseMCLoader {
        if (!this.loaderPool.has(type)) {
            this.loaderPool.set(type, []);
        }
        const pool = this.loaderPool.get(type)!;
        if (pool.length > 0) {
            return pool.pop()!;
        }
        return LoaderFactory.createLoader(type);
    }

    private returnLoader(loader: BaseMCLoader): void {
        const type = LoaderFactory.getLoaderType(loader);
        loader.reset();
        this.loaderPool.get(type)!.push(loader);
    }

    public hasAnimation(resourcePath: string): boolean {
        return this.loadedAssets.has(resourcePath);
    }

    public async loadAnimation(type: AnimResourceType, resourcePath: string): Promise<void> {
        if (this.hasAnimation(resourcePath)) {
            console.log(`Animation already loaded: ${resourcePath}`);
            return;
        }

        const loader = this.getLoader(type);
        const assets = await loader.loadAnimation(resourcePath);
        this.loaders.set(resourcePath, loader);
        this.loadedAssets.set(resourcePath, assets);
    }

    public getAnimationData(resourcePath: string, key?: string): any | null {
        const loader = this.loaders.get(resourcePath);
        if (!loader) {
            console.error(`No loader found for resource: ${resourcePath}`);
            return null;
        }
        return loader.getAnimationData(key);
    }

    public getAnimationAssets(resourcePath: string): Asset[] | null {
        return this.loadedAssets.get(resourcePath) || null;
    }

    public releaseAnimation(resourcePath: string): void {
        const loader = this.loaders.get(resourcePath);
        const assets = this.loadedAssets.get(resourcePath);
        if (loader && assets) {
            assets.forEach(asset => resources.release(asset.uuid));
            this.returnLoader(loader);
            this.loaders.delete(resourcePath);
            this.loadedAssets.delete(resourcePath);
        }
    }

    public releaseAllAnimations(): void {
        this.loadedAssets.forEach((assets, resourcePath) => {
            this.releaseAnimation(resourcePath);
        });
    }
}

