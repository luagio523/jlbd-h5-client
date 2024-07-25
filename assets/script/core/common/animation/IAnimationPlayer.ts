import { AnimResourceType } from "./Type";

export interface IAnimationPlayer {
    loadAnimation(type:AnimResourceType,  resourcePath: String): Promise<void>;
    setupAnimation(key?: string,...args:any[]): void;
    play(times:number): void;
    stop(): void;
    setFrameRate(rate: number): void;
    onComplete(callback: Function): void;
    update(dt: number): void;
}