import { Node, TiledMap, TiledMapAsset, resources } from "cc";
import { GameMap } from "../map/GameMap";
import { MapDisplay } from "../map/MapDisplay";
import { EnterMapEvent } from "../event/Event";
import app from "../../App";
import { EventDispatcher } from "../event/EventListenerManager";
import { ColliderManager } from "./ColliderManager";

export default class MapManager {
    private static instance: MapManager;
    private gameMap: GameMap;
    private mapDisplay: MapDisplay;
    private tiledMap: TiledMap;
    private eventDispatcher: EventDispatcher;

    private constructor() {
        this.eventDispatcher = new EventDispatcher();
        this.gameMap = new GameMap();
        ColliderManager.getInstance().initialize(this.gameMap);
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

    public initMapDisplay(mapDisplay: MapDisplay): Node {
        this.mapDisplay = mapDisplay;
        this.mapDisplay.initialize(this.gameMap);
        this.tiledMap = this.mapDisplay.getTiledMap();
        return this.mapDisplay;
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
            this.gameMap.initWithTiledMap(this.tiledMap);
            this.eventDispatcher.trigger(new EnterMapEvent());
            this.mapDisplay.changeMap();
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
