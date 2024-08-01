import { Camera, Node, Rect, TiledMap, TiledMapAsset, Vec2, Vec3, resources } from "cc";
import { GameMap } from "../map/GameMap";
import { MapDisplay } from "../map/MapDisplay";
import { EnterMapEvent, InitedMapEvent } from "../event/Event";
import app from "../../App";
import { EventDispatcher } from "../event/EventManager";
import { ColliderManager } from "./ColliderManager";
import { AdaptionManager } from "../../core/common/Adaption/AdaptionManager";
import { CameraController } from "../map/CameraController";
import { CameraEffectsManager } from "./CameraEffectsManager";
import { SLayerType, SceneManager } from "./SceneManager";


export default class MapManager {
    private static instance: MapManager;
    private gameMap: GameMap;
    private mapDisplay: MapDisplay;
    private tiledMap: TiledMap;
    private eventDispatcher: EventDispatcher;
    private cameraNode: Node;
    private camera: Camera;
    private cameraController: CameraController;



    public static getInstance(): MapManager {
        if (!MapManager.instance) {
            MapManager.instance = new MapManager();
        }
        return MapManager.instance;
    }

    private constructor() {
        this.eventDispatcher = new EventDispatcher();
    }

    

    public getGameMap(): GameMap {
        return this.gameMap;
    }

    public initialize(cameraNode: Node): void {
        this.mapDisplay = new MapDisplay()
        SceneManager.getInstance().addToLayer(SLayerType.Map,this.mapDisplay); //添加到场景

        this.setupCamera(cameraNode);//设置相机
        CameraEffectsManager.getInstance().initialize(this.cameraController); //设置相机特效管理器
        ColliderManager.getInstance().initialize(this.gameMap);

        let adaptionManager = AdaptionManager.getInstance(); //适配
        adaptionManager.on("adaption-updated", (safeArea) => {
            this.adaptForMap(safeArea);
        });

        this.gameMap = new GameMap();
        this.gameMap.updateVisibleArea(adaptionManager.getSafeArea());

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
    /**
     * 设置相机跟踪目标
     * @param targetNode 
     */
    public setCameraTarget(targetNode: Node): void {
        if (this.cameraController) {
            this.cameraController.setTarget(targetNode) ;
        }
    }
    /**
     * 设置相机焦点
     * @param position 
     */
    public setCameraFocus(position: Vec2): void {
        if (this.cameraController) {
            this.cameraController.setTargetPosition(new Vec3(position.x, position.y, 0));
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
            this.cameraController.setBoundaryArea(this.gameMap.getBoundaryArea()); //设置相机边界区域
        }
    }

    public async enterMap(mapID: string): Promise<void> {
        if (!this.mapDisplay) {
            throw new Error("Map display must be initialized first.");
        }

        try {
            this.gameMap.changeMap(mapID);
            const mapPath = this.gameMap.getMapPath();
            const tiledMapAsset = await this.loadTiledMapAsset(mapPath);
            
            this.tiledMap.tmxAsset = tiledMapAsset;
            
            this.gameMap.initWithTiledMap(mapID, this.tiledMap);
            this.cameraController.setBoundaryArea(this.gameMap.getBoundaryArea()); //设置相机边界区域
            this.mapDisplay.setupMap();

            this.eventDispatcher.trigger(new InitedMapEvent());
        } catch (err) {
            console.error("Error entering map:", err);
            throw err;
        }
    }

    private loadTiledMapAsset(mapPath: string): Promise<TiledMapAsset> {
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
