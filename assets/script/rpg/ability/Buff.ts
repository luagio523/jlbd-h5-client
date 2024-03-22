// 例如，你可能想要把 value 当做基础的变化值，intensity 用来增强或者削弱这个基础效果。在这个框架里，
// 可以用 value来表示基础速度或者基础伤害，然后 intensity 用来影响这个基础速度或者基础伤害的强度。
// 对应到上述移动速度减缓的例子，可以将value用作基础减速值，
// 然后用intensity来增强这个减速效果。例如，如果value是10，intensity是0.2
// ，那么移动速度减缓为基础速度的10%，然后再额外减缓20%，即最终减缓比例为12%(=10% + 10%*0.2)。

export class BuffEffect {
    public effectType: EffectType
    public value: number
    public intensity: number

    // 新增一个属性保存应用的效果值
    public effectAppliedValue: number = 0;

    public applyEffect(entity: ECSEntity) {
        if (this.effectType == EffectType.moveSpeedBonusPercentage) {
            const movable = entity.getComponent(MovableComponent);
            if (movable) {
                // 先减缓基础速度的百分比，再乘以强度
                this.effectAppliedValue = movable.speed * this.value * (1 + this.intensity);
                movable.speed -= this.effectAppliedValue;
            }
        }

        // TODO: Handle other effect types...
    }

    public expireEffect(entity: ECSEntity) {
        if (this.effectType == EffectType.moveSpeedBonusPercentage) {
            const movable = entity.getComponent(MovableComponent);
            if (movable) {
                // Restore the speed to its original value
                movable.speed += this.effectAppliedValue;
                this.effectAppliedValue = 0;
            }
        }

        // TODO: Handle other effect expiration...
    }
}


export enum BuffType {
    BUFF = 0,
    DEBUFF = 1
}




export class Buff {
    public id: string
    public stackable: boolean;
    public stackLimit?: number;
    public stackingStrategy?: StackingStrategy;
    public duration: number
    public buffType: BuffType
    public refreshable: boolean;
    public removable: boolean;
    public source: ECSEntity | null;
    public purgable: boolean;

    // 新增一个buff效果数组
    public buffEffects: BuffEffect[];

    public applyModifier(entity: ECSEntity, buff: Buff) {
        // 在这之前的代码保持不变

        // 对于 buffEffects 中的每一个效果，都调用它的 applyEffect 方法
        for (let effect of this.buffEffects) {
            effect.applyEffect(entity);
        }
    };

    public expirationModifier(entity: ECSEntity, buff: Buff) {
        // 在这之前的代码保持不变

        // 对于 buffEffects 中的每一个效果，都调用它的 expireEffect 方法
        for (let effect of this.buffEffects) {
            effect.expireEffect(entity);
        }
    };



      // 新增一个处理光环效果的方法，找出并更新光环所影响的实体
      public updateAuraTargets(auraHolderEntity: ECSEntity, entities: ECSEntity[]) {
        for (let aura of this.auras ?? []) {
            entities.forEach((entity) => {
                const distance = this.calculateDistance(auraHolderEntity, entity);
                if (this.shouldAffect(entity, aura.affects) && distance <= aura.range) {
                    aura.applyAura(entity);
                } else {
                    aura.removeAura(entity);
                }
            });
        }
    }

    private calculateDistance(sourceEntity: ECSEntity, targetEntity: ECSEntity): number {
        // 实现计算两个实体间的距离的方法
        // 这通常需要访问Transform组件或位置信息
    }

    private shouldAffect(targetEntity: ECSEntity, targetFilter: UnitTargetType): boolean {
        // 实现根据UnitTargetType确定目标是否应被光环影响的方法
        // 这可能涉及到检查实体的类型，所属队伍，是否存活等等
    }

    public auras?: {
        range: number;
        affects: UnitTargetType;
    };
}