import { IEvent } from "../event/Event";
import { CollectItemsCondition } from "./CollectItemsCondition";
import { KillEnemiesCondition } from "./KillEnemiesCondition";

export interface ITaskCondition {
    onTrigger(evt:IEvent): void; // 触发条件
    check(): boolean; // 检查条件是否满足
    reset(): void; // 重置条件
}



export class ConditionFactory {
    public static createCondition(condition: any) {
        switch (condition.type) {
            case 'KillEnemiesCondition':
                return new KillEnemiesCondition(condition.required,condition.monsterType);
            case 'CollectItemsCondition':
                return new CollectItemsCondition(condition.required);
            default:
                throw new Error(`Unknown condition type: ${condition.type}`);
        }
    }
}
