import { Vec2 } from "cc";
import { Area, AreaType } from "./Area";
import { ECSEntity } from "../ecs/ECSEntity";

export class AFKArea extends Area {
    constructor(id: string, name: string, boundaries: Vec2[]) {
        super(id, name, AreaType.AFK, boundaries);
    }

    onEnter(player: ECSEntity) {
        super.onEnter(player);
        console.log(`Player entered ${this.name} AFK area`);
        this.enableChat(player);
    }

    onExit(player: ECSEntity) {
        super.onExit(player);
        console.log(`Player exited ${this.name} AFK area`);
        this.disableChat(player);
    }

    enableChat(player: ECSEntity) {
        // 实现启用聊天面板
        console.log(`Enabling chat for player in ${this.name}`);
    }

    disableChat(player: ECSEntity) {
        // 实现禁用聊天面板
        console.log(`Disabling chat for player in ${this.name}`);
    }
}
