
import { Node,  log } from "cc";
import { GameMap } from "./GameMap";
import Thumbnail from "./Thumbnail";
import { ResPathUtil } from "./ResPathUtil";
import display from "../../core/common/utils/display";
import GameImage from "./GameImage";

export class MapRender extends Node {
	_shape: Node;
	lastUpdateX: number;
	lastUpdateY: number;
	thumbnail: Thumbnail;
	_imageList: Array<any>;
	showMap: any;

	isThumbnailComplete: boolean;
	mapName: string
	maxImagX: number;
	maxImagY: number;

	public constructor() {
		super();

		this._shape = new Node;
		this.lastUpdateX = 0;
		this.lastUpdateY = 0;

		this.thumbnail = new Thumbnail;
		this.addChild(this.thumbnail)
		this.thumbnail.addEventListener("Complete", this.onThumbnailComplete.bind(this));
		this._imageList = [];
		this.showMap = {};
	}


	public destroy():boolean{
		super.destroy()
		this.thumbnail.removeEventListener("Complete");

		this.removeAllChildren();
		this._imageList.length = 0;

		return true
	};


	public onThumbnailComplete(e) {
		this.isThumbnailComplete = true;
		this.updateHDMap({ x: this.lastUpdateX, y: this.lastUpdateY }, true);
		//显示遮罩
	};

	public initThumbnail(w, h, mapName) {
		if (this.mapName != mapName) {
			this.isThumbnailComplete = false;
			this.clearHDMap();
		}
		this.mapName = mapName;

		// this.isThumbnailComplete = true

		log("mapname :",this.mapName)

		this.thumbnail.setSize(w,h)

		this.thumbnail.setPosition(w>>1,h>>1)

		// // 清除图片显示
		for (let key1 in this._imageList) {
			let array = this._imageList[key1]
			for (let key2 in array) {
				let img = array[key2]
				if (img) {
					img.source = ""
				}
			}
		}
		var imgSize = GameMap.IMG_SIZE;
		this.maxImagX = Math.ceil(w / imgSize);
		this.maxImagY = Math.ceil(h / imgSize);
	
		this.thumbnail.source = ResPathUtil.GetMapThumbnailPath(this.mapName)

	};


	public clearHDMap() {
		for (const key in this.showMap) {
			const image = this.showMap[key];
			image.clear()
		}
	};

	

	public updateHDMap(point: any, force: boolean = false) {
		var IMG_SIZE = GameMap.IMG_SIZE;
		if (force || Math.abs(this.lastUpdateX - point.x) > IMG_SIZE / 4 || Math.abs(this.lastUpdateY - point.y) > IMG_SIZE / 4 ) {
			this.lastUpdateX = point.x;
			this.lastUpdateY = point.y;
			if (!this.isThumbnailComplete)
				return;
			var ww = display.adaptWidth;
			var hh = display.adaptHeight;

			var imgX = Math.max(Math.floor(-point.x / IMG_SIZE), 0);
			var imgY = Math.max(Math.floor(-point.y / IMG_SIZE), 0);

			var imgXCount = imgX + Math.ceil(ww / IMG_SIZE) + 1;
			var imgYCount = imgY + Math.ceil(hh / IMG_SIZE) + 1;

			imgX = Math.min(imgX,this.maxImagX)
			imgY = Math.min(imgY ,this.maxImagY)
		
			var tempMap = {};
			for (var i = imgX; i <= imgXCount && i < this.maxImagX; i++) {
				for (var j = imgY; j <= imgYCount && j < this.maxImagY; j++) {
					let sourceName = ResPathUtil.GetTileImagePath(this.mapName, i, this.maxImagY -j -1)  //地图切割是按左上角坐标系
					this._imageList[j] = this._imageList[j] || [];
					var s:GameImage = this._imageList[j][i] || new GameImage;
					s.setAnchor(0,0)
					s.source = sourceName;
					s.setPosition(i*IMG_SIZE,j*IMG_SIZE)
				
					if (!s.parent)
						this.addChild(s);
					this._imageList[j][i] = s;

					tempMap[sourceName] = s
				}
			}

			for (const key in this.showMap) {
				const image = this.showMap[key];
				if(!tempMap[key]){
					image.parent = null
					delete this.showMap[key]
				}
			}
			this.showMap = tempMap
		}
	};


}