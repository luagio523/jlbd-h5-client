import { Vec2 } from "cc";
import { Area } from "../area/Area";
import { ECSEntity } from "../ecs/ECSEntity";

export class AreaManager {
    areas: Area[] = [];
    currentArea: Area | null = null;

    addArea(area: Area) {
        this.areas.push(area);
    }

    getAreaAtPoint(point: Vec2): Area | null {
        for (const area of this.areas) {
            if (area.isPointInside(point)) {
                return area;
            }
        }
        return null;
    }

    handleAreaTransition(player: ECSEntity, newArea: Area | null) {
        if (this.currentArea === newArea) return;

        if (this.currentArea) {
            this.currentArea.onExit(player);
        }

        if (newArea) {
            newArea.onEnter(player);
        }

        this.currentArea = newArea;
    }

    update(deltaTime: number) {
        for (const area of this.areas) {
            area.update(deltaTime);
        }
    }
}






// 创建区域管理器
// const areaManager = new AreaManager();

// // 定义区域
// const trainingAreaExp = new TrainingArea('1', 'Training Room (EXP)', [new Vec2(0, 0), new Vec2(20, 0), new Vec2(20, 20), new Vec2(0, 20)], TrainingType.EXPERIENCE, SpawnPattern.CONTINUOUS, 5000, 5, 'dummy');
// const trainingAreaGold = new TrainingArea('2', 'Training Room (Gold)', [new Vec2(25, 0), new Vec2(45, 0), new Vec2(45, 20), new Vec2(25, 20)], TrainingType.GOLD, SpawnPattern.BATCH, 10000, 10, 'gold_dummy');
// const combatAreaNeutral = new CombatArea('3', 'Neutral Combat Area', [new Vec2(50, 0), new Vec2(70, 0), new Vec2(70, 20), new Vec2(50, 20)], AggressionType.PASSIVE);
// const combatAreaAggressive = new CombatArea('4', 'Aggressive Combat Area', [new Vec2(75, 0), new Vec2(95, 0), new Vec2(95, 20), new Vec2(75, 20)], AggressionType.AGGRESSIVE);
// const mainCity = new MainCityArea('5', 'Main City', [new Vec2(100, 0), new Vec2(120, 0), new Vec2(120, 20), new Vec2(100, 20)]);
// const afkArea = new AFKArea('6', 'AFK Area', [new Vec2(125, 0), new Vec2(145, 0), new Vec2(145, 20), new Vec2(125, 20)]);

// // 添加区域到管理器
// areaManager.addArea(trainingAreaExp);
// areaManager.addArea(trainingAreaGold);
// areaManager.addArea(combatAreaNeutral);
// areaManager.addArea(combatAreaAggressive);
// areaManager.addArea(mainCity);
// areaManager.addArea(afkArea);

// // 创建玩家
// const player = new ECSEntity();
// player.addComponent('Transform', { position: new Vec2(5, 5) });
// player.addComponent('Inventory', new Inventory());

// // 模拟玩家移动
// function onPlayerMove(newPosition: Vec2) {
//     player.getComponent('Transform').position = newPosition;
//     const newArea = areaManager.getAreaAtPoint(newPosition);
//     areaManager.handleAreaTransition(player, newArea);
// }

// // 游戏循环更新
// function gameLoop(deltaTime: number) {
//     areaManager.update(deltaTime);
//     // 其他游戏逻辑
// }

// // 示例：玩家移动到新位置
// onPlayerMove(new Vec2(6, 5)); // 移动到 (6, 5)
// onPlayerMove(new Vec2(26, 5)); // 移动到 (26, 5)，进入金币练功房