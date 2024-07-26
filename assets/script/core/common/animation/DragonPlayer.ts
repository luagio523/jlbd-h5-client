
import { _decorator,  dragonBones,  } from 'cc';
import { IAnimationPlayer } from './IAnimationPlayer';
import { AnimResourceType } from './Type';
import { AnimManager } from './AnimManager';
const { ccclass, property } = _decorator;

export class DragonPlayer implements IAnimationPlayer {
    private armatureDisplay: dragonBones.ArmatureDisplay | null = null;
    private resourcePath: string = '';
    private animationName: string = '';
    private onCompleteCallback: Function | null = null;
    private animManager: AnimManager;
    constructor(armatureDisplay: dragonBones.ArmatureDisplay) {
        this.armatureDisplay = armatureDisplay;
        this.animManager = AnimManager.getInstance();
    }

    // let resoucePath = `anim/dragonbody/${modelName}_ske`;
    // let imgPath = `anim/dragonbody/${modelName}_tex`;

    async loadAnimation(type: AnimResourceType, resourcePath: string): Promise<void> {
        this.resourcePath = resourcePath;
        if (!this.animManager.hasAnimation(resourcePath)) {
            await this.animManager.loadAnimation(type, resourcePath);
        }
    }

    setupAnimation(animationName?: string,armatureName?: string): void {

        const {dragonBonesAsset, atlasAsset} = this.animManager.getAnimationData(this.resourcePath,"default");
        
        if (this.armatureDisplay) {
            this.armatureDisplay.dragonAsset = dragonBonesAsset;
            this.armatureDisplay.dragonAtlasAsset = atlasAsset;
            this.armatureDisplay.armatureName = armatureName;
            this.armatureDisplay.addEventListener(dragonBones.EventObject.COMPLETE, this.onAnimationComplete, this);
        }

        if (animationName) {
            this.animationName = animationName;
        }
        if (this.armatureDisplay) {
            // this.play(0);
        }
    }

    
    play(playTimes = 0) {
        if (this.armatureDisplay && this.animationName) {
            this.armatureDisplay.playAnimation(this.animationName, playTimes);
        }
    }

    stop() {
        if (this.armatureDisplay) {
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

    onDestroy() {
        if (this.armatureDisplay) {
            this.armatureDisplay.removeEventListener(dragonBones.EventObject.COMPLETE, this.onAnimationComplete, this);
        }
        // this.animManager.releaseAnimation(this.resourcePath); 不需要在这里释放资源，因为可能还有其他地方使用
    }


}









// export class DragonPlayer implements IAnimationPlayer {
//     private armatureDisplay: dragonBones.ArmatureDisplay | null = null;
//     private animManager: AnimManager;
//     private resourcePath: string = '';
//     private animationName: string = '';
//     private onCompleteCallback: Function | null = null;

//     constructor(armatureDisplay: dragonBones.ArmatureDisplay) {
//         this.armatureDisplay = armatureDisplay;
//         this.animManager = AnimManager.getInstance();
//     }

//     async loadAnimation(resourcePath: string, armatureName: string = "Armature"): Promise<void> {
//         this.resourcePath = resourcePath;
//         if (!this.animManager.hasAnimation(resourcePath)) {
//             await this.animManager.loadAnimation('dragonbones', resourcePath);
//         }

//         const assets = this.animManager.getAnimationAssets(resourcePath);
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
//         this.animManager.releaseAnimation(this.resourcePath);
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
