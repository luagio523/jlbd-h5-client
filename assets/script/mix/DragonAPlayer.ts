import { Node, dragonBones } from 'cc';

class DragonBonesAnimationPlayer implements IAnimationPlayer {
    private node: Node;
    private armatureDisplay: dragonBones.ArmatureDisplay;

    constructor(parent: Node, dragonBonesDataPath: string, textureAtlasPath: string) {
        this.node = new Node();
        parent.addChild(this.node);
        this.armatureDisplay = this.node.addComponent(dragonBones.ArmatureDisplay);
        this.loadAnimation(dragonBonesDataPath, textureAtlasPath);
    }

    private loadAnimation(dragonBonesDataPath: string, textureAtlasPath: string) {
        // Load DragonBones data and texture atlas
        resources.load(dragonBonesDataPath, dragonBones.DragonBonesAsset, (err, dragonBonesAsset) => {
            if (err) {
                console.error('Failed to load DragonBones data:', err);
                return;
            }
            this.armatureDisplay.dragonAsset = dragonBonesAsset;

            resources.load(textureAtlasPath, dragonBones.DragonBonesAtlasAsset, (err, atlasAsset) => {
                if (err) {
                    console.error('Failed to load texture atlas:', err);
                    return;
                }
                this.armatureDisplay.dragonAtlasAsset = atlasAsset;
                this.armatureDisplay.armatureName = 'ArmatureName'; // Replace with your armature name
                this.armatureDisplay.playAnimation('AnimationName', 0); // Replace with your animation name
            });
        });
    }

    play() {
        this.armatureDisplay.playAnimation('AnimationName', 0);
    }

    stop() {
        this.armatureDisplay.stop();
    }

    pause() {
        this.armatureDisplay.paused = true;
    }

    resume() {
        this.armatureDisplay.paused = false;
    }

    update(dt: number) {
        // DragonBones automatically updates
    }

    destroy() {
        this.node.destroy();
    }
}
