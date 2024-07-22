import { Vec2 } from "cc";
import { Trigger } from "./Trigger";
import { ECSEntity } from "../ecs/ECSEntity";
import { ShapeUtil } from "../util/ShapeUtil";

export enum AreaType {
    SAFE,// 安全区域
    MONSTER, // 怪物区域
    TRAINING, // 训练区域
    MAIN_CITY,// 主城区域
    AFK // 离线区域
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
        const context = { event: 'enter', area: this, player: player };
        this.triggers.forEach(trigger => trigger.check(player, context));
    }

    onExit(player: ECSEntity) {
        console.log(`Player exited ${this.name}`);
        const context = { event: 'exit', area: this, player: player };
        this.triggers.forEach(trigger => trigger.check(player, context));
    }

    update(deltaTime: number) {
        // 基础 Area 可能不需要更新逻辑
    }
}








// // 创建区域管理器
// const areaManager = new AreaManager();

// // 定义区域
// const safeZone = new Area('1', 'Safe Zone', AreaType.SAFE, [new Vec2(0, 0), new Vec2(10, 0), new Vec2(10, 10), new Vec2(0, 10)]);
// const combatZone = new Area('2', 'Combat Zone', AreaType.COMBAT, [new Vec2(15, 0), new Vec2(25, 0), new Vec2(25, 10), new Vec2(15, 10)]);

// // 添加触发器
// const safeZoneTrigger = new Trigger('safe-entry', TriggerCondition.ENTER, (player) => {
//     console.log('Player entered the safe zone.');
// });
// safeZone.addTrigger(safeZoneTrigger);

// const combatZoneTrigger = new Trigger('combat-entry', TriggerCondition.ENTER, (player) => {
//     console.log('Player entered the combat zone.');
// });
// combatZone.addTrigger(combatZoneTrigger);