// KillEnemiesCondition.ts

import { IEvent, KillEvent } from "../event/Event";
import { ITaskCondition } from "./Condition";

export class KillEnemiesCondition implements ITaskCondition {
    private enemiesKilled: number = 0;
    private enemiesRequired: number;
    private monsterType: string;

    constructor(enemiesRequired: number, monsterType: string) {
        this.enemiesRequired = enemiesRequired;
        this.monsterType = monsterType;
    }

    public onTrigger(evt: IEvent): void {
        if (evt instanceof KillEvent) {
            if (this.monsterType === evt.monsterType) {
                this.enemiesKilled++;
            }
        }
    }

    public check(): boolean {
        return this.enemiesKilled >= this.enemiesRequired;
    }

    public reset(): void {
        this.enemiesKilled = 0; // 重置击杀数
    }
}
