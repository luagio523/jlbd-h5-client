import { Node, Sprite, SpriteFrame, dragonBones, sp, UITransform, Vec3 } from 'cc';
import { AnimResourceType } from '../../../core/animation/Type';
import { UIElement } from '../UIElement';


export class SpriteUnitBody extends UIElement {
    private sprite: Sprite;

    constructor(width: number = 100, height: number = 100) {
        super("SpriteUnitBody",width, height);
        this.sprite = this.node.addComponent(Sprite);
    }

    public async setup(parent?: Node): Promise<void> {
        
    }   
    public reset(): void {
        this.sprite.spriteFrame = null;
    }

    public setSpriteFrame(spriteFrame: SpriteFrame): void {
        this.sprite.spriteFrame = spriteFrame;
    }

    public getSprite(): Sprite {
        return this.sprite;
    }
}

export class DragonBonesUnitBody extends UIElement {
    private dragonBones: dragonBones.ArmatureDisplay;

    constructor(width: number = 100, height: number = 100) {
        super("SpriteUnitBody",width, height);
        this.dragonBones = this.node.addComponent(dragonBones.ArmatureDisplay);
    }

    public async setup(parent?: Node): Promise<void> {
        
    }   
    public reset(): void {
        this.dragonBones.dragonAsset = null;
        this.dragonBones.dragonAtlasAsset = null;
        this.dragonBones.armatureName = "";
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

export class SpineUnitBody  extends UIElement {
    private spine: sp.Skeleton;

    constructor(width: number = 100, height: number = 100) {
        super("SpineUnitBody",width, height);
        this.spine = this.node.addComponent(sp.Skeleton);
    }

    public async setup(parent?: Node): Promise<void> {
        
    }   
    public reset(): void {
        this.spine.skeletonData = null;
    }

    public setSpineData(skeletonData: sp.SkeletonData, animationName: string): void {
        this.spine.skeletonData = skeletonData;
        this.spine.setAnimation(0, animationName, true);
    }

    public getSpine(): sp.Skeleton {
        return this.spine;
    }
}

export function createUnitBody(type: AnimResourceType, width: number = 100, height: number = 100): UIElement {
    switch (type) {
        case AnimResourceType.SpriteAltas:
        case AnimResourceType.EgretSpriteSheet:
            return new SpriteUnitBody(width, height);
        case AnimResourceType.DragonBones:
            return new DragonBonesUnitBody(width, height);
        case AnimResourceType.Spine:
            return new SpineUnitBody(width, height);
        default:
            throw new Error(`Unsupported AnimResourceType: ${type}`);
    }
}
