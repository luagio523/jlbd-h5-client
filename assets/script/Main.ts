/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2023-01-19 15:28:28
 */
import { DynamicAtlasManager, Node, ResolutionPolicy, _decorator, log, macro, profiler, screen, tween, view } from 'cc';
import { DEBUG, JSB } from 'cc/env';
import { oops } from './core/Oops';
import { Root } from './core/Root';
import { UIManager } from './core/ui/UIManager';
import { UI_CONFIG } from './config/UIConfig';
import { MapDisplay } from './rpg/map/MapDisplay';
import { GameMap,MapType } from './rpg/map/GameMap';
import MapManager from './rpg/manager/MapManager';
import { EventListenerManager } from './rpg/event/EventListenerManager';
import { Event } from './rpg/event/Event';
import Display from './core/common/utils/display';
import { AdaptionManager } from './core/common/Adaption/AdaptionManager';
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
        
        // oops.gui = new UIManager(oops.facade)
        // oops.gui.initialize(UI_CONFIG);
        // console.log("initGUI",screen.windowSize);
        

        // screen.on("window-resize", () => {
        //     Display.initDisplayData();
        // }, this);

        console.log("screen",screen.resolution);

        AdaptionManager.getInstance();
          

        // screen.on("orientation-change", () => {
            
        // }, this);

        // view.on("orientation-change", () => {
        //     console.log("orientation-change");
        // }, this);

        // view.on("design-resolution-changed", () => {
        //     console.log("design-resolution-changed");
        // }, this);

        // view.on("resize", () => {            
        //     console.log("resize");
        // }, this);

        // view.on("canvas-resize", () => {
        //     console.log("canvas-resize");
        // }, this);

        // view.on("window-resize", () => {
        //     console.log("window-resize");
        // }, this);

        // screen.on("fullscreen-change", () => {
        // }, this);

        
        let display = new MapDisplay();
        oops.game.root.addChild(display);

        MapManager.getInstance().initMapDisplay(display);

        MapManager.getInstance().enterMap("map004");

        EventListenerManager.getInstance().registerListener(Event.EnterMap, function (event) {
            console.log("enter map", event);     
            
            display.changeMap();
        });
    }

   
}