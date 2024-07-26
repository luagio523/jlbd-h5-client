import { Component, Sprite, dragonBones, sp } from "cc";
import { DragonPlayer } from "./DragonPlayer";
import { MCPlayer } from "./MCPlayer";
import { SpinePlayer } from "./SpinePlayer";
import { AnimResourceType } from "./Type";

export interface IAnimationPlayer {
    setComponent(component: Component): void;
    loadAnimation(type:AnimResourceType,  resourcePath: String): Promise<void>;
    getResourceType(): AnimResourceType;
    setupAnimation(key?: string,...args:any[]): void;
    play(times:number): void;
    stop(): void;
    setFrameRate(rate: number): void;
    onComplete(callback: Function): void;
    update(dt: number): void;
    dispose():void;
}


export class PlayerFactory {
    static createPlayer(type: AnimResourceType,component:Component): IAnimationPlayer {
        switch (type) {
            case AnimResourceType.SpriteAltas:
            case AnimResourceType.EgretSpriteSheet:
                return new MCPlayer(component as Sprite);
            case AnimResourceType.DragonBones:
                return new DragonPlayer(component as dragonBones.ArmatureDisplay);
            case AnimResourceType.Spine:
                return new SpinePlayer(component as sp.Skeleton);
            default:
                throw new Error(`Unsupported animation type: ${type}`);
        }
    }


    
  
}