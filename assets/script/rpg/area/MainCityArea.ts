import { Vec2 } from "cc";
import { ECSEntity } from "../ecs/ECSEntity";
import { Area, AreaType } from "./Area";

export class MainCityArea extends Area {
    constructor(id: string, name: string, boundaries: Vec2[]) {
        super(id, name, AreaType.MAIN_CITY, boundaries);
    }

    onEnter(player: ECSEntity) {
        super.onEnter(player);
        console.log(`Player entered ${this.name} main city area`);
        this.applyHealingBuff(player);
    }

    onExit(player: ECSEntity) {
        super.onExit(player);
        console.log(`Player exited ${this.name} main city area`);
        this.removeHealingBuff(player);
    }

    applyHealingBuff(player: ECSEntity) {
        // 实现加回血buff
        console.log(`Applying healing buff to player in ${this.name}`);
    }

    removeHealingBuff(player: ECSEntity) {
        // 移除加回血buff
        console.log(`Removing healing buff from player in ${this.name}`);
    }
}
