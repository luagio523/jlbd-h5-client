import { AnimResourceType } from "./Type";
import { IAnimationPlayer, PlayerFactory } from "./IAnimationPlayer";
import { Component } from "cc";

export interface AnimParams {
    animType: AnimResourceType;
    component: Component;
    resoucePath:string 
    animationName?:string;
    armatureName?:string;
    times?:number; // 0 表示循环播放
}


export class AnimManager {
    private static instance: AnimManager;

    private constructor() {}

    public static getInstance(): AnimManager {
        if (!AnimManager.instance) {
            AnimManager.instance = new AnimManager();
        }
        return AnimManager.instance;
    }


    private playerPool: Map<string, IAnimationPlayer[]> = new Map();
   

    private getPlayer(type: AnimResourceType,component: Component): IAnimationPlayer {
        if (!this.playerPool.has(type)) {
            this.playerPool.set(type, []);
        }
        const pool = this.playerPool.get(type)!;
        if (pool.length > 0) {
            let player =pool.pop()!;
            player.setComponent(component)
        }
        return PlayerFactory.createPlayer(type,component);
    }

    public async createPlayer(animParams:AnimParams): Promise<IAnimationPlayer> {
        let player: IAnimationPlayer = PlayerFactory.createPlayer(animParams.animType,animParams.component);
        await player.loadAnimation(animParams.animType,animParams.resoucePath)
        player.setupAnimation(animParams.animationName,animParams.armatureName);
        return player;
    }

    public returnPlayer(player: IAnimationPlayer): void {
        const type = player.getResourceType();
        this.playerPool.get(type)!.push(player);
    }
}

