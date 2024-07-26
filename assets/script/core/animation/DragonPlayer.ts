
import { Component, _decorator,  dragonBones,  } from 'cc';
import { IAnimationPlayer } from './IAnimationPlayer';
import { AnimResourceType } from './Type';
import { AnimResManager } from './AnimResManager';
const { ccclass, property } = _decorator;

export class DragonPlayer implements IAnimationPlayer {
    private armatureDisplay: dragonBones.ArmatureDisplay  = null;
    private resourceType: AnimResourceType =null;
    private resourcePath: string = '';
    private animationName: string = '';
    private onCompleteCallback: Function | null = null;
    private AnimResManager: AnimResManager;
    constructor(armatureDisplay: dragonBones.ArmatureDisplay) {
        this.armatureDisplay = armatureDisplay;
        this.AnimResManager = AnimResManager.getInstance();
    }

    // let resoucePath = `anim/dragonbody/${modelName}_ske`;
    // let imgPath = `anim/dragonbody/${modelName}_tex`;

    async loadAnimation(type: AnimResourceType, resourcePath: string): Promise<void> {
        this.resourceType = type;
        this.resourcePath = resourcePath;
        if (!this.AnimResManager.hasAnimation(resourcePath)) {
            await this.AnimResManager.loadAnimation(type, resourcePath);
        }
    }

    public getResourceType(): AnimResourceType{
        return this.resourceType;
    }

    setComponent(component: Component): void{
        this.armatureDisplay = component as dragonBones.ArmatureDisplay;
    }

    setupAnimation(animationName?: string,armatureName?: string): void {

        const {dragonBonesAsset, atlasAsset} = this.AnimResManager.getAnimationData(this.resourcePath,"default");
        
        if (this.armatureDisplay) {
            this.armatureDisplay.dragonAsset = dragonBonesAsset;
            this.armatureDisplay.dragonAtlasAsset = atlasAsset;
            this.armatureDisplay.armatureName = armatureName;
            this.armatureDisplay.addEventListener(dragonBones.EventObject.COMPLETE, this.onAnimationComplete, this);
        }

        if (animationName) {
            this.animationName = animationName;
        }
       
    }

    
    play(playTimes = 0) {
        if (this.armatureDisplay && this.animationName) {
            this.armatureDisplay.playAnimation(this.animationName, playTimes);
        }
    }
    

    stop() {
        if (this.armatureDisplay && this.armatureDisplay.armature()) {
            this.armatureDisplay.armature().animation.stop();
        }
    }


    setUpdateGap(gap: number) {
        if (this.armatureDisplay) {
            this.armatureDisplay.timeScale = 1 / gap;
        }
    }

    setFrameRate(rate: number): void {
        this.setUpdateGap(1 / rate);
    }

    setAnimeTimes(times: number) {
        this.play(times);
    }

    onComplete(callback: Function) {
        this.onCompleteCallback = callback;
    }

    update(dt: number) {
        // DragonBones 自动更新，不需要手动调用
    }

    private onAnimationComplete() {
        if (this.onCompleteCallback) {
            this.onCompleteCallback();
        }
    }

    public dispose() {
        if (this.armatureDisplay) {
            // 停止动画播放
            this.stop();
            // 移除事件监听器
            this.armatureDisplay.removeEventListener(dragonBones.EventObject.COMPLETE, this.onAnimationComplete, this);

            // 注意：不需要手动从世界时钟中移除或销毁armature
            // DragonBones会在适当的时候处理这些
            // 清除引用
            this.armatureDisplay = null;
        }
        // 清除其他引用
        this.resourceType = null;
        this.resourcePath = '';
        this.animationName = '';
        this.onCompleteCallback = null;
    }

}









// export class DragonPlayer implements IAnimationPlayer {
//     private armatureDisplay: dragonBones.ArmatureDisplay | null = null;
//     private AnimResManager: AnimResManager;
//     private resourcePath: string = '';
//     private animationName: string = '';
//     private onCompleteCallback: Function | null = null;

//     constructor(armatureDisplay: dragonBones.ArmatureDisplay) {
//         this.armatureDisplay = armatureDisplay;
//         this.AnimResManager = AnimResManager.getInstance();
//     }

//     async loadAnimation(resourcePath: string, armatureName: string = "Armature"): Promise<void> {
//         this.resourcePath = resourcePath;
//         if (!this.AnimResManager.hasAnimation(resourcePath)) {
//             await this.AnimResManager.loadAnimation('dragonbones', resourcePath);
//         }

//         const assets = this.AnimResManager.getAnimationAssets(resourcePath);
//         if (assets && assets.length === 2) {
//             const [dragonBonesAsset, atlasAsset] = assets as [dragonBones.DragonBonesAsset, dragonBones.DragonBonesAtlasAsset];
            
//             if (this.armatureDisplay) {
//                 this.armatureDisplay.dragonAsset = dragonBonesAsset;
//                 this.armatureDisplay.dragonAtlasAsset = atlasAsset;
//                 this.armatureDisplay.armatureName = armatureName;
//                 this.armatureDisplay.addEventListener(dragonBones.EventObject.COMPLETE, this.onAnimationComplete, this);
//             }
//         }
//     }

//     setupAnimation(animationName?: string): void {
//         if (animationName) {
//             this.animationName = animationName;
//         }
//         if (this.armatureDisplay) {
//             this.playAnimation(this.animationName || 'idle');
//         }
//     }


//     onDestroy() {
//         if (this.armatureDisplay) {
//             this.armatureDisplay.removeEventListener(dragonBones.EventObject.COMPLETE, this.onAnimationComplete, this);
//         }
//         this.AnimResManager.releaseAnimation(this.resourcePath);
//     }
// }















// export class DragonBonesManager {
//     private static instance: DragonBonesManager;
//     private factory: dragonBones.CCFactory;
//     private loadedAssets: Map<string, { dragonBonesAsset: dragonBones.DragonBonesAsset, atlasAsset: dragonBones.DragonBonesAtlasAsset }>;

//     private constructor() {
//         this.factory = dragonBones.CCFactory.getInstance();
//         this.loadedAssets = new Map();
//     }

//     static getInstance(): DragonBonesManager {
//         if (!DragonBonesManager.instance) {
//             DragonBonesManager.instance = new DragonBonesManager();
//         }
//         return DragonBonesManager.instance;
//     }

//     async loadDragonBonesAsset(name: string, dragonBonesDataPath: string, textureAtlasPath: string): Promise<void> {
//         if (this.loadedAssets.has(name)) {
//             return Promise.resolve();
//         }

//         return new Promise<void>((resolve, reject) => {
//             resources.load(dragonBonesDataPath, dragonBones.DragonBonesAsset, (err, dragonBonesAsset) => {
//                 if (err) {
//                     reject(err);
//                     return;
//                 }

//                 resources.load(textureAtlasPath, dragonBones.DragonBonesAtlasAsset, (err, atlasAsset) => {
//                     if (err) {
//                         reject(err);
//                         return;
//                     }

//                     this.factory.parseDragonBonesData(dragonBonesAsset.dragonBonesJson);
//                     this.factory.parseTextureAtlasData(atlasAsset.atlasJson, atlasAsset.texture);

//                     this.loadedAssets.set(name, { dragonBonesAsset, atlasAsset });
//                     resolve();
//                 });
//             });
//         });
//     }

//     createArmatureDisplay(name: string, armatureName: string): dragonBones.ArmatureDisplay | null {
//         const assetInfo = this.loadedAssets.get(name);
//         if (!assetInfo) {
//             console.error(`Dragon bones asset ${name} not loaded`);
//             return null;
//         }

//         return this.factory.createArmatureDisplay(armatureName);
//     }
// }

// // 在 DragonPlayer 中使用
// export class DragonPlayer extends Component implements IAnimationPlayer {
//     // ... 其他属性

//     async loadAnimation(name: string, dragonBonesDataPath: string, textureAtlasPath: string, armatureName: string = "Armature"): Promise<void> {
//         const manager = DragonBonesManager.getInstance();
//         await manager.loadDragonBonesAsset(name, dragonBonesDataPath, textureAtlasPath);
        
//         this.armatureDisplay = manager.createArmatureDisplay(name, armatureName);
//         if (this.armatureDisplay) {
//             this.node.addChild(this.armatureDisplay.node);
//             this.armatureName = armatureName;
//             this.armatureDisplay.addEventListener(dragonBones.EventObject.COMPLETE, this.onAnimationComplete, this);
//         }
//     }

//     // ... 其他方法
// }
