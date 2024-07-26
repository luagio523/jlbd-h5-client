import { Node, Sprite, SpriteFrame, dragonBones, sp, UITransform, Vec3 } from 'cc';
import { AnimResourceType } from '../../core/animation/Type';

export abstract class BaseBodyNode {
    protected node: Node;

    constructor(width: number = 100, height: number = 100) {
        this.node = new Node('BodyNode');
        const transform = this.node.addComponent(UITransform);
        transform.setContentSize(width, height);
    }

    public setSize(width: number, height: number): void {
        const transform = this.node.getComponent(UITransform);
        if (transform) {
            transform.setContentSize(width, height);
        }
    }

    public setPosition(x: number, y: number, z: number = 0): void {
        this.node.setPosition(new Vec3(x, y, z));
    }

    public getNode(): Node {
        return this.node;
    }
}

export class SpriteBodyNode extends BaseBodyNode {
    private sprite: Sprite;

    constructor(width: number = 100, height: number = 100) {
        super(width, height);
        this.sprite = this.node.addComponent(Sprite);
    }

    public setSpriteFrame(spriteFrame: SpriteFrame): void {
        this.sprite.spriteFrame = spriteFrame;
    }

    public getSprite(): Sprite {
        return this.sprite;
    }
}

export class DragonBonesBodyNode extends BaseBodyNode {
    private dragonBones: dragonBones.ArmatureDisplay;

    constructor(width: number = 100, height: number = 100) {
        super(width, height);
        this.dragonBones = this.node.addComponent(dragonBones.ArmatureDisplay);
    }

    public setDragonBonesData(asset: dragonBones.DragonBonesAsset, atlasAsset: dragonBones.DragonBonesAtlasAsset, armatureName: string): void {
        this.dragonBones.dragonAsset = asset;
        this.dragonBones.dragonAtlasAsset = atlasAsset;
        this.dragonBones.armatureName = armatureName;
    }

    public getDragonBones(): dragonBones.ArmatureDisplay {
        return this.dragonBones;
    }
}

export class SpineBodyNode extends BaseBodyNode {
    private spine: sp.Skeleton;

    constructor(width: number = 100, height: number = 100) {
        super(width, height);
        this.spine = this.node.addComponent(sp.Skeleton);
    }

    public setSpineData(skeletonData: sp.SkeletonData, animationName: string): void {
        this.spine.skeletonData = skeletonData;
        this.spine.setAnimation(0, animationName, true);
    }

    public getSpine(): sp.Skeleton {
        return this.spine;
    }
}

export function createBodyNode(type: AnimResourceType, width: number = 100, height: number = 100): BaseBodyNode {
    switch (type) {
        case AnimResourceType.SpriteAltas:
        case AnimResourceType.EgretSpriteSheet:
            return new SpriteBodyNode(width, height);
        case AnimResourceType.DragonBones:
            return new DragonBonesBodyNode(width, height);
        case AnimResourceType.Spine:
            return new SpineBodyNode(width, height);
        default:
            throw new Error(`Unsupported AnimResourceType: ${type}`);
    }
}
