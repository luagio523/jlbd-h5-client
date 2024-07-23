import { Camera, Node, Rect, TiledMap, TiledMapAsset, Vec3, resources } from "cc";
import { GameMap } from "../map/GameMap";
import { MapDisplay } from "../map/MapDisplay";
import { EnterMapEvent } from "../event/Event";
import app from "../../App";
import { EventDispatcher } from "../event/EventListenerManager";
import { ColliderManager } from "./ColliderManager";
import { AdaptionManager } from "../../core/common/Adaption/AdaptionManager";
import { CameraController } from "../map/CameraController";


export default class MapManager {
    private static instance: MapManager;
    private gameMap: GameMap;
    private mapDisplay: MapDisplay;
    private tiledMap: TiledMap;
    private eventDispatcher: EventDispatcher;
    private cameraNode: Node;
    private camera: Camera;
    private cameraController: CameraController;

    private constructor() {
        this.eventDispatcher = new EventDispatcher();
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

    public initialize(mapDisplay: MapDisplay, cameraNode: Node): void {
        if (this.mapDisplay) {
            return;
        }

        this.setupCamera(cameraNode);//设置相机

        ColliderManager.getInstance().initialize(this.gameMap);

        let adaptionManager = AdaptionManager.getInstance();
        adaptionManager.on("adaption-updated", (safeArea) => {
            this.adaptForMap(safeArea);
        });

        this.gameMap = new GameMap();
        this.gameMap.updateVisibleArea(adaptionManager.getSafeArea());
        

        this.mapDisplay = mapDisplay;
        this.mapDisplay.initialize(this.gameMap,this.cameraController);
        this.mapDisplay.updateVisibleArea(adaptionManager.getSafeArea());
        this.tiledMap = this.mapDisplay.getTiledMap();
        
    }

    private setupCamera(cameraNode: Node): void {
        this.cameraNode = cameraNode;
        
        this.camera = this.cameraNode.getComponent(Camera);
        if (!this.camera) {
            console.error("Camera component not found on the provided node.");
            return;
        }

        this.cameraController = this.cameraNode.addComponent(CameraController);
        this.cameraController.smoothTime = 0.3;
        this.cameraController.deadZoneWidth = 100;
        this.cameraController.deadZoneHeight = 100;
    }

    public updateCameraTarget(targetNode: Node): void {
        if (this.cameraController) {
            this.cameraController.target = targetNode;
        }
    }

    public setCameraPosition(position: Vec3): void {
        if (this.cameraNode) {
            this.cameraNode.setPosition(position);
        }
    }

    private adaptForMap(safeArea: Rect) {
        let size = safeArea.size;
        if (this.gameMap) {
            this.gameMap.updateVisibleArea(size);
        }
        if (this.mapDisplay) {
            this.mapDisplay.updateVisibleArea(size);
        }
        // 可能还需要更新相机的正交高度或其他属性
        if (this.camera) {
            // 根据需要调整相机属性
            // this.camera.orthoHeight = size.height / 2;
        }
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
            
            this.gameMap.initWithTiledMap(mapID, this.tiledMap);
            this.mapDisplay.setupMap();

            this.eventDispatcher.trigger(new EnterMapEvent());
        } catch (err) {
            console.error("Error entering map:", err);
            throw err;
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
