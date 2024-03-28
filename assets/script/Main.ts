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
import { UIManager } from './core/ui/UIManager';
import { UI_CONFIG } from './config/UIConfig';

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
        if (JSB) {
            oops.gui.toast("热更新后新程序的提示");
        }
    }

    protected initGUI() {

        oops.gui = new UIManager(oops.facade)
        oops.gui.initialize(UI_CONFIG);
    }

   
}