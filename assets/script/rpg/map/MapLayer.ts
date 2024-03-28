import display from "../../core/common/utils/display";
import { MapRender } from "./MapRender";
import { Color, Component, Graphics, Node, Rect, Sprite, TiledMap, Tween, Vec2, Vec3, _decorator, log, tween } from "cc";
import EntityLayer from "./EntityLayer";
import { GameMap, MapType } from "./GameMap";

const { ccclass, property } = _decorator;

class TrackLookAt{
	private fixedDeltaTime: number; // 固定的时间步长
    private accumulatedTime: number = 0; // 时间累积器

	protected target:Node 
	protected lastPos:Vec3
	protected syncViewWithTarget:(callback:Function)=>Tween<Node> 
	protected isTweening:boolean
	protected tween:Tween<Node>
	
	public constructor(fixedDeltaTime:number = 0.2){
		this.fixedDeltaTime = fixedDeltaTime
	}

	public update(dt:number){
		if(!this.target) return 
		if(this.isTweening) return 
		this.accumulatedTime += dt;
		if(this.accumulatedTime < this.fixedDeltaTime){
			return 
		}
		this.accumulatedTime = 0 
		if(!this.lastPos.equals(this.target.position)){
			this.syncOnce()
		}
	}

	private syncOnce(){
		this.isTweening = true 
		this.tween = this.syncViewWithTarget(()=>{
			this.isTweening = false 
		})
	}

	public lookAt(target:Node,sync:(callback:Function)=>Tween<Node>){
		this.target = target 
		this.lastPos = Vec3.ZERO
		this.syncViewWithTarget = sync 
		this.syncOnce() //直接触发一次
	}

}

/**
 * 地图显示
 */
export class MapLayer extends Node {
	protected gameMap: GameMap
	public constructor(gameMap: GameMap) {
		super();
		this.gameMap = gameMap
	}

	private _mapNode: Node;
	private _mapImage: MapRender;
	private _entityLayer: EntityLayer;

	private offset: Vec2 = new Vec2(0, 0) //由于图片的切割 可能有不足切割大小的 图。

	private lastLookX:number = Number.MAX_VALUE
	private lastLookY:number = Number.MAX_VALUE 

	protected trackLookAt:TrackLookAt


	public init() {
		this.addChild(this._mapNode = new Node)
		this._mapNode.addComponent(TiledMap)

		this.addChild(this._mapImage = new MapRender)
		

		this.trackLookAt = new TrackLookAt(0.2) //每0.2秒检测下跟踪player
	};

	public get tileMap() {
		return this._mapNode.getComponent(TiledMap)
	}

	// 在update方法中更新摄像机/视图位置
	public update(dt: number): void {

	}

	public trackLookAtTarget(target: Node): void {
		this.trackLookAt.lookAt(target,(callback)=>
			this.syncViewWithTarget(target,0.2,callback)
		)
	}

	public lookAtTargetWithTween(target: Node, duration: number = 0.2): void {
		if (!target || duration <= 0) return;
		if (!target.isValid) return;
		this.syncViewWithTarget(target,duration)
	}

	public lookAtPoint(tx: number, ty: number): void {
		if(tx == this.lastLookX && ty == this.lastLookY){
			return 
		}
		this.lastLookX = tx 
		this.lastLookY  =ty

		let p = new Vec2(tx,ty)
		this.translateToMapCoordinates(p)
		this.setPosition(p.x,p.y)
	}
	

	public syncViewWithTarget(target:Node,time:number = 0.1,callback?:Function):Tween<Node>{
		if(!target.isValid) return 

		if(target.position.x == this.lastLookX && target.position.y == this.lastLookY){
			return 
		}
		this.lastLookX =  target.position.x 
		this.lastLookY  = target.position.y

		let p = target.position
		this.translateToMapCoordinates(new Vec2(target.position.x ,target.position.y))

		return tween(<Node>this)
			.to(time, { position: p })
			.call(callback)
			.start();
	}

	private translateToMapCoordinates(point: Vec2): void {
		point.x = -Math.min(Math.max(point.x - (display.adaptWidth >> 1), 0), this.gameMap.maxWidth - display.adaptWidth);
		point.y = -Math.min(Math.max(point.y - (display.adaptHeight >> 1), 0), this.gameMap.maxHeight - display.adaptHeight);
	}

	public changeMap() {
		log("Change map for");
		this.off(Node.EventType.TRANSFORM_CHANGED)
		// 提早返回的策略减少条件嵌套
		if (this.gameMap.mapType !== MapType.SLICE) {
			this.updateTileMap();
			this.centerViewOnMap();
			return;
		} else { //对于地图切块的
			this.calculateOffset(); // 计算偏移的函数
			this.adjustMapView(); // 调整地图视图的函数
			this.updateMapImage(this.gameMap.getFileName());
			this.centerViewOnMap(); // 中心视图到地图的函数
		}
	};

	private calculateOffset() {
		// 计算偏移值的逻辑
		const remainderX = this.gameMap.maxWidth % GameMap.IMG_SIZE;
		const remainderY = this.gameMap.maxHeight % GameMap.IMG_SIZE;
		this.offset.x = remainderX > 0 ? GameMap.IMG_SIZE - remainderX : 0;
		this.offset.y = remainderY > 0 ? GameMap.IMG_SIZE - remainderY : 0;
	}

	private adjustMapView() {
		// 调整地图视图
		this._mapImage.setPosition(this._mapImage.position.x, -this.offset.y); //切图导致的偏移 不满256的图 视觉上对y轴有影响（多出的黑块区）。不会影响地图本身
	}

	private centerViewOnMap() {
		// 首次加载地图时的视图定位
		this.lookAtPoint(this.gameMap.mapX, this.gameMap.mapY);
	}

	/**
	 * 直接更新tileMap地图
	 */
	private updateTileMap() {
		this._mapImage.active = false
		this._mapNode.active = true
		this._mapNode.setPosition(this.gameMap.maxWidth >> 1, this.gameMap.maxHeight >> 1)
	}

	/**
	 * 更新切片地图
	 * @param mapName 
	 */
	private updateMapImage(mapName: string) {
		this._mapNode.active = false
		this._mapImage.active = true
		this.on(Node.EventType.TRANSFORM_CHANGED, () => {
			this.updateHDMap();
		})
		this._mapImage.lastUpdateX = this.position.x
		this._mapImage.lastUpdateY = this.position.y
		this._mapImage.render(this.gameMap.maxWidth, this.gameMap.maxHeight, mapName);
		this.updateHDMap();
	}

	private updateHDMap(force: boolean = false) {
		if (this._mapImage != null) {
			this._mapImage.updateHDMap(this, force);
		}
	}

}