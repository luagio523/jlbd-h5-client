import { ECSEntity } from "../ecs/ECSEntity";

export enum TriggerCondition {
    ENTER,
    EXIT
}

export class Trigger {
    id: string;
    condition: TriggerCondition;
    actionScript: (player: ECSEntity) => void;

    constructor(id: string, condition: TriggerCondition, actionScript: (player: ECSEntity) => void) {
        this.id = id;
        this.condition = condition;
        this.actionScript = actionScript;
    }

    check(event: 'enter' | 'exit', player: ECSEntity) {
        if ((event === 'enter' && this.condition === TriggerCondition.ENTER) ||
            (event === 'exit' && this.condition === TriggerCondition.EXIT)) {
            this.execute(player);
        }
    }

    execute(player: ECSEntity) {
        console.log(`Executing trigger ${this.id} for player`);
        this.actionScript(player);
    }
}
