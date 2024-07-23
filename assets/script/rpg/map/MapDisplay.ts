import { Node, Vec2, tween, log, _decorator, Vec3, TiledMap, TransformBit, Size } from "cc";
import { GameMap } from "./GameMap";
import { MapVisualizer } from "./MapVisualizer";
import { TrackLookAt } from "./TrackLookAt";
import Thumbnail from "./Thumbnail";
import { ResPathUtil } from "./ResPathUtil";
import { CameraController } from "./CameraController";
const { ccclass, property } = _decorator;


export interface MapTweenOptions {
    time?: number;
    callback?: Function;
}


/**
 * 地图显示层
 * 管理地图的显示、缩略图和高清地图的渲染
 */
export class MapDisplay extends Node {
    private gameMap: GameMap;
    private thumbnail: Thumbnail;
    private mapVisualizer: MapVisualizer;
    private mapNode: Node;
    private cameraController: CameraController | null = null;

    constructor() {
        super("MapDisplay");
        this.mapNode = new Node("mapNode");
        this.thumbnail = new Thumbnail();
        this.mapVisualizer = new MapVisualizer();
    }

    /**
     * 初始化地图层
     * @param gameMap 游戏地图实例
     * @param cameraController 平滑相机实例
     */
    public initialize(gameMap: GameMap, cameraController: CameraController): void {
        this.gameMap = gameMap;
        this.cameraController = cameraController;

        this.addChild(this.mapNode);
        this.mapNode.addComponent(TiledMap);
		this.mapNode.active = false;

        this.addChild(this.thumbnail);
        this.thumbnail.onLoad = this.onThumbnailComplete.bind(this);

        this.addChild(this.mapVisualizer);

        this.updateVisibleArea(gameMap.getVisibleArea());
    }

    private setupThumbnail(mapName: string, width: number, height: number): void {
        this.thumbnail.setSize(width, height);
        this.thumbnail.setPosition(width / 2, height / 2);
        this.thumbnail.source = ResPathUtil.getMapThumbnailPath(mapName);
    }

    public getTiledMap(): TiledMap | null {
        return this.mapNode.getComponent(TiledMap);
    }

    /**
     * 设置相机关注点
     * @param position 世界坐标中的位置
     */
    public setCameraFocus(position: Vec2): void {
		if (this.cameraController) {
			this.cameraController.setTargetPosition(new Vec3(position.x, position.y, this.cameraController.node.worldPosition.z));
		}
    }


    /**
     * 开启一张新图
     * @param position 初始视野点，可选，默认看向地图中心 
     */
    public setupMap(position?: Vec2): void {
        log("setup map:", this.gameMap.getFileName(), position);
        this.updateMap(this.gameMap.getFileName());
        if (position) {
            this.setCameraFocus(position);
        } else {
            this.centerViewOnMap();
        }
    }

    /**
     * 注视世界地图中心
     */
    private centerViewOnMap(): void {
        this.setCameraFocus(new Vec2(this.gameMap.maxWidth / 2, this.gameMap.maxHeight / 2));
    }

    private updateMap(mapName: string): void {
        this.thumbnail.clear();
        this.setupThumbnail(mapName, this.gameMap.maxWidth, this.gameMap.maxHeight);
        this.mapVisualizer.setupHDMap(mapName, this.gameMap.maxWidth, this.gameMap.maxHeight, GameMap.IMG_SIZE);
    }

    /**
     * 渲染高清地图
     * @param force 强制重新渲染
     */
    public renderHDMap(force: boolean = false): void {
        if (this.cameraController) {
            const cameraPosition = this.cameraController.node.worldPosition;
            this.mapVisualizer.renderHDMap(cameraPosition.x, cameraPosition.y, force);
        }
    }

    private onThumbnailComplete(url: string): void {
        log("thumbnail complete:", url);
        this.renderHDMap(true);
    }

    public updateVisibleArea(visibleArea: Size): void {
        this.mapVisualizer.setVisibleArea(visibleArea);
    }

    public clear(): void {
        this.thumbnail.clear();
        this.mapVisualizer.clear();
    }
}
