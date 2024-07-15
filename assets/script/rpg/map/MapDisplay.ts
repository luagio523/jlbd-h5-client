import { Node, Vec2, tween, log, _decorator, Vec3, TiledMap } from "cc";
import { GameMap } from "./GameMap";
import { MapVisualizer } from "./MapVisualizer";
import { TrackLookAt } from "./TrackLookAt";
const { ccclass, property } = _decorator;


export interface MapTweenOptions {
    time?: number;
    callback?: Function;
}


export class MapDisplay extends Node {
	private gameMap: GameMap;
	private mapVisualizer: MapVisualizer;
	private trackLookAt: TrackLookAt;
	private lastLookAt:Vec2 = new Vec2(0,0);
	private offset:Vec2 = new Vec2(0,0);
	private mapNode: Node = new Node("mapNode");
	
	    /**
     * 初始化地图层
     */
    public init(gameMap: GameMap) {
		this.gameMap = gameMap;
        this.addChild(this.mapNode = new Node());
		this.mapNode.addComponent(TiledMap)
        this.addChild(this.mapVisualizer = new MapVisualizer());
        this.trackLookAt = new TrackLookAt(0.2); // 每0.2秒检测下跟踪player
    }

	public getTiledMap():TiledMap{
		return this.mapNode.getComponent(TiledMap);
	}
	
	public takeLookAt(position:Vec2,option?:MapTweenOptions): void {
		if (this.lastLookAt.equals(position)) return ;
		this.lastLookAt.set(position);
		const transPoint = this.gameMap.mapWorldToMapNodePosition(position);
		if(option){
			tween(<Node>this)
			.to(option.time || 0.2, { position: new Vec3(transPoint.x, transPoint.y, 0) })
			.call(() => {
				if(option.callback){
					option.callback();
				}
			})
			.start();
		}else{
			this.setPosition(transPoint.x, transPoint.y);
		}
	}
	

	public trackLookAtTarget(target: Node): void {
		// this.trackLookAt.lookAt(target, (callback) => this.syncViewWithTarget(target, 0.2, callback));
	}

	public changeMap(): void {
		log("Change map for");
		this.off(Node.EventType.TRANSFORM_CHANGED);
	
		this.mapVisualizer.active = true;
		this.mapNode.active = false;

		this.on(Node.EventType.TRANSFORM_CHANGED, () => {
			this.updateHDMap();
		});
		
		this.calculateOffset();
		this.adjustMapView();
		this.updateMapImage(this.gameMap.getFileName());
		this.centerViewOnMap();
	}

	private calculateOffset(): void {
		const remainderX = this.gameMap.maxWidth % GameMap.IMG_SIZE;
		const remainderY = this.gameMap.maxHeight % GameMap.IMG_SIZE;
		this.offset.x = remainderX > 0 ? GameMap.IMG_SIZE - remainderX : 0;
		this.offset.y = remainderY > 0 ? GameMap.IMG_SIZE - remainderY : 0;
	}

	private adjustMapView(): void {
		if (this.mapVisualizer != null) {
			this.mapVisualizer.setPosition(this.mapVisualizer.position.x, -this.offset.y);
		}
	}

	private centerViewOnMap(): void {
		this.takeLookAt(new Vec2(this.gameMap.maxWidth / 2, this.gameMap.maxHeight / 2));
	}


	private updateMapImage(mapName: string): void {
		this.mapVisualizer.setLastUpdate(this.position.x, this.position.y);
		this.mapVisualizer.render(this.gameMap.maxWidth, this.gameMap.maxHeight, GameMap.IMG_SIZE, mapName);
		this.updateHDMap();
	}

	private updateHDMap(force: boolean = false): void {
		if (this.mapVisualizer != null) {
			this.mapVisualizer.updateHDMap(new Vec2(this.position.x, this.position.y), force);
		}
	}
}

