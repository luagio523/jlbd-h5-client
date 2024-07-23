import { Node, Rect, TiledMap, TiledMapAsset, resources } from "cc";
import { GameMap } from "../map/GameMap";
import { MapDisplay } from "../map/MapDisplay";
import { EnterMapEvent } from "../event/Event";
import app from "../../App";
import { EventDispatcher } from "../event/EventListenerManager";
import { ColliderManager } from "./ColliderManager";
import { AdaptionManager } from "../../core/common/Adaption/AdaptionManager";

export default class MapManager {
    private static instance: MapManager;
    private gameMap: GameMap;
    private mapDisplay: MapDisplay;
    private tiledMap: TiledMap;
    private eventDispatcher: EventDispatcher;

    private constructor() {
        this.eventDispatcher = new EventDispatcher();
        
       
        
    }

    private adaptForMap(safeArea: Rect) {
        let size = safeArea.size;
        if(this.gameMap){
            this.gameMap.updateVisibleArea(size);
        }
        if(this.mapDisplay){
            this.mapDisplay.updateVisibleArea(size);
        }
    }

    public static getInstance(): MapManager {
        if (!MapManager.instance) {
            MapManager.instance = new MapManager();
        }
        return MapManager.instance;
    }

    public getGameMap(): GameMap {
        return this.gameMap;
    }

    public initialize(mapDisplay: MapDisplay): void {
        if(this.mapDisplay){
            return ;
        }
        ColliderManager.getInstance().initialize(this.gameMap);

        let adaptionManager = AdaptionManager.getInstance();
        adaptionManager.on("adaption-updated", (safeArea) => { // 屏幕适配更新事件
            this.adaptForMap(safeArea);
        })
        this.gameMap = new GameMap();
        this.gameMap.updateVisibleArea(adaptionManager.getSafeArea());

        this.mapDisplay = mapDisplay;
        this.mapDisplay.initialize(this.gameMap);
        this.mapDisplay.updateVisibleArea(adaptionManager.getSafeArea());
        this.tiledMap = this.mapDisplay.getTiledMap();
    }

    public async enterMap(mapID: string): Promise<void> {
        app.log.logView({ mapID }, 'enterMap');
        
        if (!this.mapDisplay) {
            throw new Error("Map display must be initialized first.");
        }

        try {
            this.gameMap.changeMap(mapID);
            const mapPath = this.gameMap.getMapPath();
            const tiledMapAsset = await this.loadTiledMapAsset(mapPath);
            
            this.tiledMap.tmxAsset = tiledMapAsset;
            
            this.gameMap.initWithTiledMap(mapID,this.tiledMap);
            this.mapDisplay.setupMap();

            this.eventDispatcher.trigger(new EnterMapEvent());
        } catch (err) {
            console.error("Error entering map:", err);
            throw err; // 重新抛出错误，允许调用者处理
        }
    }

    private loadTiledMapAsset(mapPath: string): Promise<TiledMapAsset> {
        app.log.logView({ mapPath }, 'loadTiledMapAsset');
        
        return new Promise((resolve, reject) => {
            resources.load(mapPath, TiledMapAsset, (err, tiledMapAsset) => {
                if (err) {
                    console.error("Error loading TiledMapAsset:", err);
                    reject(err);
                } else {
                    resolve(tiledMapAsset);
                }
            });
        });
    }
}
