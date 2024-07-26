import { AnimResourceType } from "./Type";
import { IAnimationPlayer, PlayerFactory } from "./IAnimationPlayer";
import { Component } from "cc";

export interface AnimParams {
    animType: AnimResourceType;
    component: Component;
    resourcePath: string;
    animationName?: string;
    armatureName?: string;
    onComplete?: () => void;
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

    private playerPool: Map<AnimResourceType, IAnimationPlayer[]> = new Map();

    private getPlayer(type: AnimResourceType, component: Component): IAnimationPlayer {
        if (!this.playerPool.has(type)) {
            this.playerPool.set(type, []);
        }
        const pool = this.playerPool.get(type)!;
        if (pool.length > 0) {
            let player = pool.pop()!;
            player.setComponent(component);
            return player;
        }
        return PlayerFactory.createPlayer(type, component);
    }

    public async createPlayer(animParams: AnimParams): Promise<IAnimationPlayer> {
        let player: IAnimationPlayer = this.getPlayer(animParams.animType, animParams.component);
        await player.loadAnimation(animParams.animType, animParams.resourcePath);
        player.setupAnimation(animParams.animationName, animParams.armatureName);
        
        
        player.onComplete = () => {
            if (animParams.onComplete) {
                animParams.onComplete();
            }
            this.returnPlayer(player);
        };
        
        return player;
    }

    public playAnimation(player: IAnimationPlayer, times: number = 0): void {
        player.play(times);
    }

    public stopAnimation(player: IAnimationPlayer): void {
        player.stop();
        this.returnPlayer(player);
    }

    public returnPlayer(player: IAnimationPlayer): void {
        const type = player.getResourceType();
        player.reset(); // 重置播放器状态
        this.playerPool.get(type)!.push(player);
    }

    public clearPool(): void {
        this.playerPool.forEach(pool => {
            pool.forEach(player => player.reset());
            pool.length = 0;
        });
    }
}