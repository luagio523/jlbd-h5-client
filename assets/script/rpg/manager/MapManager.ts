import { ImageAsset, Node, SpriteFrame, Texture2D, TiledMap, TiledMapAsset, log, resources } from "cc";
import { GameMap } from "../map/GameMap";
import { MapDisplay } from "../map/MapDisplay";
import { EventDispatcher } from "../../core/common/event/EventDispatcher";
import { MapEvent } from "../map/Event";
import { EventListenerManager } from "../event/EventListenerManager";
import { EnterMapEvent, Event } from "../event/Event";
import app from "../../App";

export default class MapManager {
    private static instance: MapManager;
    private gameMap: GameMap
    private mapDisplay:MapDisplay
    private eventDispatcher: EventDispatcher


    public static getInstance(): MapManager {
        if (!MapManager.instance) {
            MapManager.instance = new MapManager();
        }
        return MapManager.instance;
    }


    public initMapDisplay(mapDisplay:MapDisplay):Node{
        if(!this.gameMap){
            this.eventDispatcher = new EventDispatcher();
            this.gameMap = new GameMap();
        }
        this.mapDisplay = mapDisplay;
        this.mapDisplay.init(this.gameMap)
        return this.mapDisplay;
    }
    
   

    public async enterMap(mapID: string): Promise<void> {
        if(!this.mapDisplay){
            console.error("should init map display first");
            return;
        }
        console.log(`enterMap map ${mapID}`); // TODO: load map
        this.gameMap.changeMap(mapID);

        const mapPath = this.gameMap.getMapPath();
        try {
            const tiledMapAsset = await this.loadTiledMapAsset(mapPath);
            let tiledMap: TiledMap = this.mapDisplay.getTiledMap();
            tiledMap.tmxAsset = tiledMapAsset;
            this.gameMap.initWithTiledMap(tiledMap);
            EventListenerManager.getInstance().dispatchEvent(new EnterMapEvent());

            app.log.logView({mapID: mapID},'');
        } catch (err) {
            console.error("Error loading map:", err);
        }
    }

    protected onComplete(): void {
        // this.dispatchEvent(Event.MAP_DATA_INIT);
    }


    private loadTiledMapAsset(mapPath: string): Promise<TiledMapAsset> {
        app.log.logView({mapPath},'');
        return new Promise((resolve, reject) => {
            resources.load(mapPath, TiledMapAsset, (err, tiledMapAsset) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(tiledMapAsset);
                }
            });

            app.log.logView({mapPath:mapPath},'loadTiledMapAsset');
            resources.load(`map/map004/small`, ImageAsset, (err, spFrame) => {
                if (err) {
                    console.error("Error loading sprite frame:", err);
                    console.log("Attempted to load from path:", `map/map004/small`);
                    return;
                }
                log("Successfully loaded sprite frame");
               
            });
            resources.load(`map/map004/small`, SpriteFrame, (err, spFrame) => {
                if (err) {
                    console.error("Error loading sprite frame:", err);
                    console.log("Attempted to load from path:", `map/map004/small`);
                    return;
                }
                log("Successfully loaded sprite frame");
               
            });

        });
    }

   
   

}