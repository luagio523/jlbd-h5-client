import { Node, Vec2, tween, log, _decorator, Vec3, TiledMap, TransformBit, Size } from "cc";
import { GameMap } from "./GameMap";
import { MapVisualizer } from "./MapVisualizer";
import { TrackLookAt } from "./TrackLookAt";
import Thumbnail from "./Thumbnail";
import { ResPathUtil } from "./ResPathUtil";
const { ccclass, property } = _decorator;


export interface MapTweenOptions {
    time?: number;
    callback?: Function;
}

/**
 * 地图显示层
 * 显示地图缩略图、地图视野、地图视角跟踪
 * 行走时，人不动，让地图相反移动，所以地图节点的位置刚好和世界坐标相反
 */
export class MapDisplay extends Node {
	private gameMap: GameMap;
	private thumbnail: Thumbnail;
	private mapVisualizer: MapVisualizer;
	private trackLookAt: TrackLookAt;
	private lastLookAt:Vec2 = new Vec2(0,0);
	private mapNode: Node = new Node("mapNode");
	
	    /**
     * 初始化地图层
     */
    public initialize(gameMap: GameMap) {
		this.gameMap = gameMap;
        this.addChild(this.mapNode = new Node());
		this.mapNode.addComponent(TiledMap)
		this.mapNode.active = false;

		this.thumbnail = new Thumbnail();
		this.addChild(this.thumbnail);
		this.thumbnail.onLoad = this.onThumbnailComplete.bind(this);

        this.addChild(this.mapVisualizer = new MapVisualizer());
        this.trackLookAt = new TrackLookAt(0.2); // 每0.2秒检测下跟踪player

		this.updateVisibleArea(gameMap.getVisibleArea())

		this.on(Node.EventType.TRANSFORM_CHANGED, this.onTransformChanged.bind(this));
    }
	

	private onTransformChanged(type:number): void {
		if (type & TransformBit.POSITION) {
			this.renderHDMap();
		}
	}

	private setupThumbnail(mapName: string,width: number, height: number): void {
		this.thumbnail.setSize(width, height);
		this.thumbnail.setPosition(width / 2, height / 2);
		this.thumbnail.source = ResPathUtil.getMapThumbnailPath(mapName);
	}

	public getTiledMap():TiledMap{
		return this.mapNode.getComponent(TiledMap);
	}
	
	public takeLookAt(position: Vec2, option?: MapTweenOptions): void {
        if (this.lastLookAt.equals(position)) return;
        this.lastLookAt.set(position);
        const transPoint = this.gameMap.worldToMapNodePosition(position);
        const targetPosition = new Vec3(transPoint.x, transPoint.y, 0);
        this.moveTo(targetPosition, option);
    }

    private moveTo(targetPosition: Vec3, option?: MapTweenOptions): void {
        if (option) {
            tween(<Node>this)
                .to(option.time ?? 0.2, { position: targetPosition })
                .call(option.callback ?? (() => {}))
                .start();
        } else {
            this.setPosition(targetPosition);
        }
	}

	public trackLookAtTarget(target: Node): void {
		// this.trackLookAt.lookAt(target, (callback) => this.syncViewWithTarget(target, 0.2, callback));
	}

	/**
	 * 开启一张新图
	 * @param position 视野点，可选，默认看向地图中心 
	 */
	public setupMap(position?: Vec2): void {
		log("setup map:", this.gameMap.getFileName(),position);
		this.lastLookAt.set(Vec2.NEG_ONE);
		this.updateMap(this.gameMap.getFileName());
		if (position) {
			this.takeLookAt(position);//用户视野定位到指定位置
		} else {
			this.centerViewOnMap(); // 看向地图中心
		}
	}
	
	/**
	 * 注视世界地图中心
	 */
	private centerViewOnMap(): void {
		this.takeLookAt(new Vec2(this.gameMap.maxWidth / 2, this.gameMap.maxHeight / 2));
	}

	private updateMap(mapName: string,width: number = 0, height: number = 0): void {
		this.thumbnail.clear();
		this.setupThumbnail(this.gameMap.getFileName(),this.gameMap.maxWidth, this.gameMap.maxHeight);
		this.mapVisualizer.setupHDMap(mapName,width, height, GameMap.IMG_SIZE, );
	}

	/**
	 * 渲染高清地图
	 * @param force 
	 */
	private renderHDMap(force: boolean = false): void {
		if (force || this.lastLookAt.equals(Vec2.NEG_ONE)) {
			let position = this.position //当前地图位置和世界坐标刚好相反。取反。  
			this.mapVisualizer.renderHDMap(-position.x,-position.y);
		}
	}

	private onThumbnailComplete(url: string): void {
		log("thumbnail complete:", url);
		this.renderHDMap(true);
    }

	public updateVisibleArea(visibleArea: Size): void {
        this.mapVisualizer.setVisibleArea(visibleArea);
    }

	public clear(){
		this.thumbnail.clear();
		this.mapVisualizer.clear()
	}
}

