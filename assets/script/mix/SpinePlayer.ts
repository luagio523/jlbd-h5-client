import { Node, sp } from 'cc';

class SpineAnimationPlayer implements IAnimationPlayer {
    private node: Node;
    private skeleton: sp.Skeleton;

    constructor(parent: Node, spineDataPath: string, atlasPath: string) {
        this.node = new Node();
        parent.addChild(this.node);
        this.skeleton = this.node.addComponent(sp.Skeleton);
        this.loadAnimation(spineDataPath, atlasPath);
    }

    private loadAnimation(spineDataPath: string, atlasPath: string) {
        // Load Spine data and atlas
        resources.load(spineDataPath, sp.SkeletonData, (err, spineData) => {
            if (err) {
                console.error('Failed to load Spine data:', err);
                return;
            }
            this.skeleton.skeletonData = spineData;

            resources.load(atlasPath, sp.Atlas, (err, atlas) => {
                if (err) {
                    console.error('Failed to load atlas:', err);
                    return;
                }
                this.skeleton.atlas = atlas;
                this.skeleton.setAnimation(0, 'AnimationName', true); // Replace with your animation name
            });
        });
    }

    play() {
        this.skeleton.setAnimation(0, 'AnimationName', true);
    }

    stop() {
        this.skeleton.clearTrack(0);
    }

    pause() {
        this.skeleton.paused = true;
    }

    resume() {
        this.skeleton.paused = false;
    }

    update(dt: number) {
        // Spine automatically updates
    }

    destroy() {
        this.node.destroy();
    }
}
