/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2023-01-19 15:28:28
 */
import { DynamicAtlasManager, _decorator, macro, profiler, tween } from 'cc';
import { DEBUG, JSB } from 'cc/env';
import { oops } from './core/Oops';
import { Root } from './core/Root';
import { ecs } from './libs/ecs/ECS';
import { UIConfigData } from './game/common/config/GameUIConfig';
import { smc } from './game/common/ecs/SingletonModuleComp';
import { EcsPositionSystem } from './game/common/ecs/position/EcsPositionSystem';
import { Initialize } from './game/initialize/Initialize';

const { ccclass, property } = _decorator;

macro.CLEANUP_IMAGE_CACHE = false;
DynamicAtlasManager.instance.enabled = true;
DynamicAtlasManager.instance.maxFrameSize = 512;

@ccclass('Main')
export class Main extends Root {
    start() {
        if (DEBUG) profiler.showStats();
    }

    protected run() {
        smc.initialize = ecs.getEntity<Initialize>(Initialize);
        if (JSB) {
            oops.gui.toast("热更新后新程序的提示");
        }

        tween(this.node)
        .to(duration, { position: this.target.worldPosition }, { 
            easing: 'quadInOut',
            progress: (start, end, current, t) => {
                const mt: number = 1 - t;
                const newPos = start.clone().multiplyScalar(mt * mt).add(controlPoint.clone().multiplyScalar(2 * mt * t)).add(end.clone().multiplyScalar(t * t));
                
                // 沿途检测是否与怪物碰撞
                for (const monster of this.monsters) {
                    if (newPos.subtract(monster.worldPosition).length() < this.getCollisionThreshold()) {
                        // 撞到怪物，立即停止动画
                        this.onMonsterHit();
                        return newPos; // 直接返回当前位置，避免动画继续
                    }
                }
                
                return newPos;
            }
        })
        .call(() => {
            this.onProjectileLanded();
        })
        .start();
    }

    protected initGui() {
        oops.gui.init(UIConfigData);
    }

    protected async initEcsSystem() {
        oops.ecs.add(new EcsPositionSystem())
        // oops.ecs.add(new EcsAccountSystem());
        // oops.ecs.add(new EcsRoleSystem());
        // oops.ecs.add(new EcsInitializeSystem());
    }
}