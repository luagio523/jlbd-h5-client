import TimeFrame from "../../core/common/timer/TimerFrame";
import display from "../../core/common/utils/display";
import scheduler from "../../utils/scheduler";
import { GameMap, MapType } from "./GameMap";
import { MapRender } from "./MapRender";
import { Color, Graphics, Node, Rect, TiledMap, Vec2, log, tween } from "cc";
/**
 * 地图显示
 */
export class MapView extends Node {
	public constructor() {
		super();
	}

	_mapImage: MapRender;
	_downEffectLayer: Node;
	_entityLayer: Node;
	_plotLayer: Node;
	_shapeContainer:Node;
	_shape: Node;

	_mapNode:Node;


	_followTimer:TimeFrame


	public init() {
		

		this.addChild(this._mapNode = new Node)
		this._mapNode .addComponent(TiledMap)

		this.addChild(this._mapImage = new MapRender)
		
		this._downEffectLayer = new Node();
		this.addChild(this._downEffectLayer);

		this._entityLayer = new Node;
		this.addChild(this._entityLayer);

	

		this._plotLayer = new Node();
		this.addChild(this._plotLayer);
				
		// //定时排序实体层
		scheduler.scheduleGlobal(this.sortEntity.bind(this),1)
		
	};



	public sortEntity() {
		this._entityLayer.children.sort(this.sortF);
	};

	public sortF(d1, d2) {
		return d2.y - d1.y
	};

	public get tileMap(){
		return this._mapNode.getComponent(TiledMap)
	}


	private _lookAtTarget:Node = null //跟随对象


	public update(dt:number){
		
	}
	
	public follow(role:Node): void {
		this._lookAtTarget = role 
		if(!this._followTimer){
			this._followTimer = new TimeFrame(24)
			this._followTimer.addTimer((dt:number)=>{
				this.syncTween(this._lookAtTarget,0.4)
			})
		}
		if(!this._lookAtTarget){
			this._followTimer.stop()
		}else{
			this._followTimer.play()
		}

	};

	private lastLookX:number = Number.MAX_VALUE
	private lastLookY:number = Number.MAX_VALUE 

	public lookPoint(tx:number,ty:number){

		if(tx == this.lastLookX && ty == this.lastLookY){
			return 
		}
		this.lastLookX = tx 
		this.lastLookY  =ty

		let p = new Vec2(tx,ty)
		this.transH2MXY(p)
		this.setPosition(p.x,p.y)
	
		// log(this.x,this.y,"lookpoint")

		// this.x = -Math.min(Math.max(tx - (display.adaptWidth >> 1), 0), GameMap.MAX_WIDTH - display.adaptWidth -this.offset.x);
		// this.y = -Math.min(Math.max(ty -  (display.adaptHeight >> 1), this.offset.y), GameMap.MAX_HEIGHT - display.adaptHeight);
	}

	/**
	 * 转换look位置到地图相对移动位置
	 * @param p 
	 */
	private transH2MXY(p:Vec2){
		p.x = -Math.min(Math.max(p.x - (display.adaptWidth >> 1), 0), GameMap.MAX_WIDTH - display.adaptWidth  );
		p.y = -Math.min(Math.max(p.y -  (display.adaptHeight >> 1), 0), GameMap.MAX_HEIGHT - display.adaptHeight);
	}

	private offset:Vec2 = new Vec2(0,0) //由于图片的切割 可能有不足切割大小的 图。

	public syncTween(role:Node,time:number = 0.1){
		if(!role.isValid) return 

		if(role.position.x == this.lastLookX && role.position.y == this.lastLookY){
			return 
		}
		this.lastLookX =  role.position.x 
		this.lastLookY  = role.position.y

		let p = role.position
		this.transH2MXY(new Vec2(role.position.x ,role.position.y))

		tween(<Node>this).to(time,{position:p}).start()
	}




	public looAtTween(role:Node,time:number = 300): void {
		if (role == null)
			return;  
		this.follow(null) //清空跟随
		
		this.syncTween(role)
	};
	

    /**
     * 切换地图会清除场景上的所有显示
     */
	public changeMap() {

		log("change map for")
		// // 移除震屏动画

		if(GameMap.mapType == MapType.SLICE){
			if(GameMap.MAX_WIDTH%GameMap.IMG_SIZE > 0){
				this.offset.x = GameMap.IMG_SIZE - GameMap.MAX_WIDTH%GameMap.IMG_SIZE
			}
			
			if(GameMap.MAX_HEIGHT%GameMap.IMG_SIZE > 0){
				//切图导致的偏移 不满256的图 视觉上对y轴有影响（多出的黑块区）。不会影响地图本身
				this.offset.y =  GameMap.IMG_SIZE - GameMap.MAX_HEIGHT%GameMap.IMG_SIZE 
			}
			this._mapImage.setPosition(this._mapImage.position.x,-this.offset.y)

			let mapName = GameMap.getFileName()
			this.updateMapImage(mapName)
		}else{
			this.updateTileMap()
		}
		
		this.lookPoint(GameMap.mapX,GameMap.mapY)  //首次加载
	};

	private updateTileMap(){
		this._mapImage.active = false
		this.off(Node.EventType.TRANSFORM_CHANGED)

		this._mapNode.active = true

		this._mapNode.setPosition(GameMap.MAX_WIDTH >> 1,GameMap.MAX_HEIGHT >> 1)
	}

	private updateMapImage(mapName:string){
		this._mapNode.active = false
		this._mapImage.active = true
		this.on(Node.EventType.TRANSFORM_CHANGED,()=>{
			this.updateHDMap();
		})

		this._mapImage.lastUpdateX = this.position.x
		this._mapImage.lastUpdateY = this.position.y
		this._mapImage.render(GameMap.MAX_WIDTH, GameMap.MAX_HEIGHT, mapName);
		this.updateHDMap();

		// if (GameMap.IsNoramlLevel()) {
		// 	this._mapImage.ClearOtherNormalRes(mapName)
		// }
	}


	private updateHDMap(force:boolean = false){
		if(this._mapImage != null){
			this._mapImage.updateHDMap(this,force);
		}
	}
	
	///////////////////////////////////////////////////////////

	protected getDrawGraphics(){
		if(this.graphics){
			return this.graphics
		}
		let node = new Node()
		this.addChild(node)
		node.setSiblingIndex(1)
		this.graphics = node.addComponent(Graphics)
		return this.graphics
	}
	
	protected graphics:Graphics

	public draw(points:Array<Vec2>,color:Color = Color.GREEN){

		let graphics = this.getDrawGraphics()
		graphics.clear()

		graphics.strokeColor = color
        graphics.lineWidth = 6

		for (let index = 0; index < points.length; index++) {
			const element = points[index];
			if(index == 0){
				graphics.moveTo(element.x,element.y)
			}else{
				graphics.lineTo(element.x,element.y)

			}
		}
		graphics.stroke()
	}

	public draw3(rect:Rect,color:Color = Color.GREEN){
		let graphics = this.getDrawGraphics()
		graphics.clear()

		graphics.strokeColor = color
        graphics.lineWidth = 4
		
		graphics.rect(rect.x,rect.y,rect.width,rect.height)

		
		graphics.stroke()
	}
}