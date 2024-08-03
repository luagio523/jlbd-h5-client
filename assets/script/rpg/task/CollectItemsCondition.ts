import { CollectEvent } from "../event/Event";
import { ITaskCondition } from "./Condition";

export class CollectItemsCondition implements ITaskCondition {
    private itemsCollected: Set<string> = new Set();
    private itemsRequired: Set<string>;

    constructor(itemsRequired: string[]) {
        this.itemsRequired = new Set(itemsRequired);
    }

    public onTrigger(evt:CollectEvent ): void {
        this.itemsCollected.add(evt.item);
    }

    public check(): boolean {
        return [...this.itemsRequired].every(item => this.itemsCollected.has(item));
    }

    public reset(): void {
        this.itemsCollected.clear(); // 清空已收集的物品
    }

    public getCollectedItems(): string[] {
        return [...this.itemsCollected]; // 获取已收集物品
    }
}