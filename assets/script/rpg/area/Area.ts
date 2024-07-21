import { Vec2 } from "cc";
import { Trigger } from "./Trigger";
import { ECSEntity } from "../ecs/ECSEntity";
import { ShapeUtil } from "../util/ShapeUtil";

export enum AreaType {
    SAFE, //安全
    COMBAT, //战斗
    NEUTRAL  //中立
}

export class Area {
    id: string;
    name: string;
    type: AreaType;
    boundaries: Vec2[];
    triggers: Trigger[];

    constructor(id: string, name: string, type: AreaType, boundaries: Vec2[]) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.boundaries = boundaries;
        this.triggers = [];
    }

    isPointInside(point: Vec2): boolean {
        return ShapeUtil.pointInPolygon(point, this.boundaries)
    }

    addTrigger(trigger: Trigger) {
        this.triggers.push(trigger);
    }

    removeTrigger(trigger: Trigger) {
        const index = this.triggers.indexOf(trigger);
        if (index > -1) {
            this.triggers.splice(index, 1);
        }
    }

    onEnter(player: ECSEntity) {
        console.log(`Player entered ${this.name}`);
        this.triggers.forEach(trigger => trigger.check('enter', player));
    }

    onExit(player: ECSEntity) {
        console.log(`Player exited ${this.name}`);
        this.triggers.forEach(trigger => trigger.check('exit', player));
    }
}
