import { UnitTargetType } from "../type/Unit";
import { Modifier } from "./Modifier";

 // Aura类继承自Modifier
 export class Aura extends Modifier {
    public range: number;
    public affects: UnitTargetType;
    public auraEffects: AuraEffect[];

    constructor(range: number, affects: UnitTargetType, thinkInterval: number) {
        super(thinkInterval);
        this.range = range;
        this.affects = affects;
    }


    
    
    public think() {
        // 实现Aura特有的周期性逻辑
        // 比如应用或更新范围内单位的Modifier
    }
    
    // 功能可能还包括对进入和离开光环范围单位的检测
    // ...

    // 其他Aura特有的属性或方法
}


// 定义Aura类
export class Aura {
    public range: number;
    public affects: UnitTargetType;
    

    constructor(range: number, affects: UnitTargetType, auraEffects: AuraEffect[]) {
        this.range = range;
        this.affects = affects;
        this.auraEffects = auraEffects;
    }

    // 应用光环效果方法
    public applyAura(targetEntity: ECSEntity): void {
        for (let effect of this.auraEffects) {
            effect.applyEffect(targetEntity);
        }
    }

    // 移除光环效果方法
    public removeAura(targetEntity: ECSEntity): void {
        for (let effect of this.auraEffects) {
            effect.removeEffect(targetEntity);
        }
    }
}
