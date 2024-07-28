import { Node } from 'cc';
import { IEffect } from '../effect/Effect';
import { classMap } from '../effect/__private';
/**
 * 效果管理器
 * 如击飞等
 */


export class EffectManager {
    private static instance: EffectManager;
    private effectPools: Map<string, IEffect[]> = new Map();
    private activeEffects: Set<IEffect> = new Set();

    private constructor() {}

    public static getInstance(): EffectManager {
        if (!EffectManager.instance) {
            EffectManager.instance = new EffectManager();
        }
        return EffectManager.instance;
    }

    public applyEffect(name: string, target: Node, ...args: any[]): IEffect {
        const effect = this.getEffect(name);
        effect.onComplete(() => this.recycleEffect(effect));
        effect.apply(target, ...args);
        this.activeEffects.add(effect);
        return effect;
    }

    private getEffect(name: string): IEffect {
        const pool = this.effectPools.get(name) || [];
        if (pool.length > 0) {
            return pool.pop();
        } else {
            const EffectClass = classMap[name];
            if (!EffectClass) {
                throw new Error(`Effect ${name} not found`);
            }
            return new EffectClass();
        }
    }

    private recycleEffect(effect: IEffect): void {
        const name = effect.constructor.name;
        if (!this.effectPools.has(name)) {
            this.effectPools.set(name, []);
        }
        effect.reset();
        this.effectPools.get(name).push(effect);
        this.activeEffects.delete(effect);
    }

    public update(dt: number): void {
        for (const effect of this.activeEffects) {
            effect.update(dt);
        }
    }

    
}
  
