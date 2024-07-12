import { ModifierState } from "../enum/Modifier";

// 定义状态效果组件
type StatusEffectState = {
    [key in ModifierState]?: boolean;
};

// 状态效果组件
export class StatusEffectsComponent {
    effects: StatusEffectState;

    constructor() {
        this.effects = {};
    }

    // 可以添加助手方法来方便地管理状态
    addEffect(effect: ModifierState) {
        this.effects[effect] = true;
    }

    removeEffect(effect: ModifierState) {
        this.effects[effect] = false;
    }

    hasEffect(effect: ModifierState): boolean {
        return !!this.effects[effect];
    }
}