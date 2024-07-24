
import { _decorator, Component, dragonBones, resources } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DragonPlayer')
export class DragonPlayer extends Component implements IAnimationPlayer {
    @property(dragonBones.ArmatureDisplay)
    private armatureDisplay: dragonBones.ArmatureDisplay | null = null;

    private animationName: string = '';
    private onCompleteCallback: Function | null = null;

    constructor() {
        super();
    }

    async loadAnimation(dragonBonesDataPath: string, textureAtlasPath: string, armatureName: string = "Armature"): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            resources.load(dragonBonesDataPath, dragonBones.DragonBonesAsset, (err, dragonBonesAsset) => {
                if (err) {
                    console.error('Failed to load DragonBones data:', err);
                    reject(err);
                    return;
                }

                resources.load(textureAtlasPath, dragonBones.DragonBonesAtlasAsset, (err, atlasAsset) => {
                    if (err) {
                        console.error('Failed to load texture atlas:', err);
                        reject(err);
                        return;
                    }

                    if (this.armatureDisplay) {
                        this.armatureDisplay.dragonAsset = dragonBonesAsset;
                        this.armatureDisplay.dragonAtlasAsset = atlasAsset;
                        this.armatureDisplay.armatureName = armatureName;
                        this.armatureDisplay.addEventListener(dragonBones.EventObject.COMPLETE, this.onAnimationComplete, this);
                    }

                    resolve();
                });
            });
        });
    }

    setupAnimation(animationName?: string): void {
        if (animationName) {
            this.animationName = animationName;
        }
        if (this.armatureDisplay) {
            this.playAnimation(this.animationName || 'idle');
        }
    }

    playAnimation(animName: string, playTimes = 0) {
        if (this.armatureDisplay) {
            this.armatureDisplay.playAnimation(animName, playTimes);
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

    setAnimeTimes(times: number) {
        this.play(times);
    }

    setOnCompleteCallback(callback: Function) {
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
    }


}





















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
