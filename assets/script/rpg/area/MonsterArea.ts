import { Vec2 } from "cc";
import { ECSEntity } from "../ecs/ECSEntity";
import { Area, AreaType } from "./Area";

export enum AggressionType {
    PASSIVE,
    AGGRESSIVE
}

export class MonsterArea extends Area {
    aggressionType: AggressionType;

    constructor(id: string, name: string, boundaries: Vec2[], aggressionType: AggressionType) {
        super(id, name, AreaType.MONSTER, boundaries);
        this.aggressionType = aggressionType;
    }

    onEnter(player: ECSEntity) {
        super.onEnter(player);
        console.log(`Player entered ${this.name} combat area`);
        if (this.aggressionType === AggressionType.AGGRESSIVE) {
            this.triggerAggressiveBehavior(player);
        }
    }

    triggerAggressiveBehavior(player: ECSEntity) {
        // 实现怪物的攻击行为
        console.log(`Monsters in ${this.name} are attacking the player`);
    }
}
