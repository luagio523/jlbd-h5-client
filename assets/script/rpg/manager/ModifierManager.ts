import { AuraModifier } from "../ability/Aura";
import { Modifier } from "../ability/Modifier";
import {  ModifierComponent } from "../component/ModifierComponent";
import { ECSEntity } from "../ecs/ECSEntity";
import { ModifierFunction, ModifierState } from "../enum/Modifier";

export class ModifierManager {

    private static instance: ModifierManager;

    private constructor() {}

    public static getInstance(): ModifierManager {
        if (!ModifierManager.instance) {
            ModifierManager.instance = new ModifierManager();
        }
        return ModifierManager.instance;
    }


    addModifier(entity: ECSEntity, newModifier: Modifier) {
        const modifierComponent = entity.getComponent(ModifierComponent);
        if (modifierComponent) {
            const existingModifier = modifierComponent.getModifiers().find(mod => mod.id === newModifier.id);
            if (existingModifier) {
                existingModifier.handleStacking(newModifier);
            } else {
                modifierComponent.addModifier(newModifier);
                newModifier.OnCreated();
            }

            
        } else {
            console.error("Entity does not have a ModifierComponent");
        }
    }

    removeModifier(entity: ECSEntity, modifierId: string) {
        const modifierComponent = entity.getComponent(ModifierComponent);
        if (modifierComponent) {
            const modifier = modifierComponent.getModifiers().find(m => m.id === modifierId);
            if (modifier) {
                modifier.OnDestroy();
                modifierComponent.removeModifier(modifierId);

                
            }
        }
    }

    getModifierValue(entity: ECSEntity, func: ModifierFunction): number {
        const modifierComponent = entity.getComponent(ModifierComponent);
        if (!modifierComponent) return 0;

        if (modifierComponent.isDirty()) {
            this.recalculateCache(entity, modifierComponent);
        }

        const cache = modifierComponent.getCache();
        if (cache.has(func)) {
            return cache.get(func)!;
        }

        return this.calculateModifierValue(entity, modifierComponent, func);
    }

    private recalculateCache(entity: ECSEntity, modifierComponent: ModifierComponent) {
        for (const modifier of modifierComponent.getModifiers()) {
            for (const func of modifier.ListDeclareFunctions()) {
                const value = this.calculateModifierValue(entity, modifierComponent, func);
                modifierComponent.setCache(func, value);
            }
        }
        modifierComponent.clearDirty();
    }

    private calculateModifierValue(entity: ECSEntity, modifierComponent: ModifierComponent, func: ModifierFunction): number {
        return modifierComponent.getModifiers().reduce((total, modifier) => {
            return total + modifier.getModifierValue(func, entity);
        }, 0);
    }

    getModifiers(entity: ECSEntity): Modifier[] {
        const modifierComponent = entity.getComponent(ModifierComponent);
        return modifierComponent ? modifierComponent.getModifiers() : [];
    }

    isInState(entity: ECSEntity, state: ModifierState): boolean {
        const modifierComponent = entity.getComponent(ModifierComponent);
        if (!modifierComponent) return false;

        return modifierComponent.getModifiers().some(modifier => modifier.getModifierState(state));
    }


   

    updateModifiers(entity: ECSEntity, deltaTime: number) {
        const modifierComponent = entity.getComponent(ModifierComponent);
        if (modifierComponent) {
            const modifiers = modifierComponent.getModifiers();
            for (let i = modifiers.length - 1; i >= 0; i--) {
                const modifier = modifiers[i];
                modifier.update(deltaTime);
                if (modifier.isExpired()) {
                    this.removeModifier(entity, modifier.id);
                }
            }
        }
    }
}





// const buffManager = new BuffManager();
// const sven = new Hero(65, 30, 16);

// // 添加属性加成buff
// buffManager.addBuff(sven, new AttributeBonusModifier());

// // 添加God's Strength buff
// buffManager.addBuff(sven, new GodsStrengthModifier());

// // 添加眩晕效果
// buffManager.addBuff(sven, new StunModifier(2));  // 2秒眩晕

// // 计算最终攻击力
// function calculateFinalAttack(hero: Hero, buffManager: BuffManager): number {
//     const baseAttack = hero.baseAttack;
//     const strengthBonus = buffManager.getModifierValue(hero, ModifierFunction.MODIFIER_PROPERTY_STATS_STRENGTH_BONUS);
//     const damagePercentage = buffManager.getModifierValue(hero, ModifierFunction.MODIFIER_PROPERTY_TOTALDAMAGEOUTGOING_PERCENTAGE);

//     let attack = baseAttack + strengthBonus;
//     attack *= (1 + damagePercentage / 100);

//     return Math.floor(attack);
// }

// const finalAttack = calculateFinalAttack(sven, buffManager);
// console.log(`Sven's final attack at level ${sven.getLevel()}: ${finalAttack}`);

// // 获取并打印所有buff
// const buffs = buffManager.getBuffs(sven);
// console.log("Sven's buffs:", buffs.map(b => b.id));

// // 检查英雄是否处于眩晕状态
// const isStunned = buffManager.isInState(sven, ModifierState.MODIFIER_STATE_STUNNED);
// console.log(`Hero is stunned: ${isStunned}`);




// const buffManager = new BuffManager();
// const sven = new Hero(65, 30, 16);

// // 添加属性加成buff
// buffManager.addBuff(sven, new AttributeBonusModifier());

// // 添加God's Strength buff
// buffManager.addBuff(sven, new GodsStrengthModifier());

// // 计算最终攻击力
// function calculateFinalAttack(hero: Hero, buffManager: BuffManager): number {
//     const baseAttack = hero.baseAttack;
//     const strengthBonus = buffManager.getModifierValue(hero, ModifierFunction.MODIFIER_PROPERTY_STATS_STRENGTH_BONUS);
//     const damagePercentage = buffManager.getModifierValue(hero, ModifierFunction.MODIFIER_PROPERTY_TOTALDAMAGEOUTGOING_PERCENTAGE);

//     let attack = baseAttack + strengthBonus;
//     attack *= (1 + damagePercentage / 100);

//     return Math.floor(attack);
// }

// const finalAttack = calculateFinalAttack(sven, buffManager);
// console.log(`Sven's final attack at level ${sven.getLevel()}: ${finalAttack}`);





// const buffManager = new BuffManager();
// const hero = new Hero(100, 20, 1);

// // 添加眩晕效果
// buffManager.addBuff(hero, new StunModifier(2));  // 2秒眩晕

// // 检查英雄是否处于眩晕状态
// const isStunned = buffManager.isInState(hero, ModifierState.MODIFIER_STATE_STUNNED);
// console.log(`Hero is stunned: ${isStunned}`);

// // 在游戏逻辑中使用
// function canCastSpell(hero: Hero, buffManager: BuffManager): boolean {
//     return !buffManager.isInState(hero, ModifierState.MODIFIER_STATE_STUNNED) &&
//            !buffManager.isInState(hero, ModifierState.MODIFIER_STATE_SILENCED);
// }