import { _decorator, Component, Node, resources, dragonBones, UITransform, Vec2 } from 'cc';

const { ccclass, property } = _decorator;

interface SkinConfig {
    animUrl: string;
    armatureName?: string;
}

@ccclass('DragonPlayer')
export class DragonPlayer extends Component {
    public static readonly DEFAULT_ANIMATION = "Idle";

    @property(dragonBones.ArmatureDisplay)
    private display: dragonBones.ArmatureDisplay | null = null;

    private armature: dragonBones.Armature | null = null;
    private animationName: string = DragonPlayer.DEFAULT_ANIMATION;
    private playTimes: number = -1;
    private onCompleteCallback: Function | null = null;
    private animUrl: string = "";
    private armatureName: string = "Armature";

    onLoad() {
        this.initializeDisplay();
        this.addEventListeners();
    }

    private initializeDisplay() {
        if (!this.display) {
            this.display = this.addComponent(dragonBones.ArmatureDisplay);
        }
        this.armature = this.display.armature();
    }

    private addEventListeners() {
        if (this.display) {
            this.display.addEventListener(dragonBones.EventObject.COMPLETE, this.onAnimationComplete, this);
        }
    }

    public setAnchor(anchorX: number, anchorY: number): void {
        const transform = this.getComponent(UITransform);
        if (transform) {
            transform.setAnchorPoint(new Vec2(anchorX, anchorY));
        }
    }

    private onAnimationComplete(event: dragonBones.EventObject) {
        if (this.display && this.display.animationName === this.animationName) {
            this.onCompleteCallback?.();
        }
    }

    public play(animName: string, times: number = -1, complete: Function | null = null) {
        this.animationName = animName;
        this.onCompleteCallback = complete;
        this.playTimes = times;
        this.playAnimation(animName, times);
    }

    public playOnce(animName: string, complete: Function | null = null) {
        this.play(animName, 1, complete);
    }

    public playLoop(animName: string) {
        this.play(animName, 0);
    }

    private playAnimation(animName: string, playTimes: number = -1): dragonBones.AnimationState | null {
        return this.display?.playAnimation(animName, playTimes) || null;
    }

    public load(skinConfig: SkinConfig) {
        this.animUrl = skinConfig.animUrl;
        this.armatureName = skinConfig.armatureName || "Armature";
        this.loadAnimation(this.animUrl, this.armatureName, () => {
            this.playAnimation(this.animationName, this.playTimes);
        });
    }

    private loadAnimation(animUrl: string, armatureName: string, callback: Function | null = null) {
        const skeletonUrl = `${animUrl}_ske`;
        const textureUrl = `${animUrl}_tex`;

        resources.load(textureUrl, dragonBones.DragonBonesAtlasAsset, (err, atlasAsset) => {
            if (err) {
                console.error("Failed to load DragonBones atlas:", err);
                return;
            }
            if (this.display) {
                this.display.dragonAtlasAsset = atlasAsset;
            }

            resources.load(skeletonUrl, dragonBones.DragonBonesAsset, (err, asset) => {
                if (err) {
                    console.error("Failed to load DragonBones asset:", err);
                    return;
                }
                if (this.display) {
                    this.display.dragonAsset = asset;
                    this.display.armatureName = armatureName;
                    callback?.();
                }
            });
        });
    }

    public resetState() {
        this.node.setScale(1, 1);
        this.node.angle = 0;
        this.animUrl = "";
        this.animationName = "";
        if (this.display) {
            this.display.dragonAtlasAsset = null;
            this.display.dragonAsset = null;
            this.display.armatureName = "";
        }
    }

    onDestroy() {
        if (this.display) {
            this.display.removeEventListener(dragonBones.EventObject.COMPLETE, this.onAnimationComplete, this);
        }
    }
}