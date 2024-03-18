
import {   Node,  log } from "cc";
import { GameMap } from "./GameMap";
import Thumbnail from "./Thumbnail";
import { ResPathUtil } from "./ResPathUtil";
import display from "../../core/common/utils/display";
import TileImage from "./TileImage";

export class MapRender extends Node {
	lastUpdateX: number; //上一次更新的指定X
	lastUpdateY: number; //上一次更新的指定Y
	thumbnail: Thumbnail; //缩略图
	_imageList: Array<Array<TileImage>>; //地图切片列表
	_showMap: {[key:string]:TileImage};
	isThumbnailComplete: boolean; //是否已经加载完缩略图
	mapName: string  //地图名字
	maxImagX: number; //地图最大的宽
	maxImagY: number; //地图最大的高
	imgSize:number // 切片尺寸

	public constructor() {
		super();
		this.lastUpdateX = 0;
		this.lastUpdateY = 0;
		this._imageList = [];
		this._showMap = {};
		this.thumbnail = new Thumbnail;
		this.addChild(this.thumbnail)
		this.thumbnail.addEventListener("Complete", this.onThumbnailComplete.bind(this));
	}


	public destroy():boolean{
		super.destroy()
		this.thumbnail.removeEventListener("Complete");
		this.removeAllChildren();
		this._imageList.length = 0;
		this._showMap ={}
		return true
	};

	//在缩略图加载完成之后开始显示高清图
	public onThumbnailComplete(e) {
		this.isThumbnailComplete = true;
		this.updateHDMap({ x: this.lastUpdateX, y: this.lastUpdateY }, true);
		//显示遮罩
	};

	public render(w:number, h:number, mapName:string) {
		if (this.mapName != mapName) {
			this.isThumbnailComplete = false;
			this.clearHDMap();
		}
		log("mapName :",this.mapName)
		this.mapName = mapName;
		this.thumbnail.setSize(w,h)
		this.thumbnail.setPosition(w>>1,h>>1)

		// // 清除图片显示
		// 清除图片显示
		for (let i = 0; i < this._imageList.length; i++) {
			let row = this._imageList[i];
			if (Array.isArray(row)) {
				for (let j = 0; j < row.length; j++) {
					let img = row[j];
					if (img instanceof TileImage) { // 确保img确实是GameImage的实例
						img.clear()
					}
				}
			}
		}
		var imgSize = this.imgSize;
		this.maxImagX = Math.ceil(w / imgSize);
		this.maxImagY = Math.ceil(h / imgSize);
		this.thumbnail.source = ResPathUtil.GetMapThumbnailPath(this.mapName)
	};


	public clearHDMap() {
		for (const key in this._showMap) {
			const image = this._showMap[key];
			image.clear()
		}
	};


	public updateHDMap(point: any, force: boolean = false) {
		var IMG_SIZE = this.imgSize;
		var threshold = IMG_SIZE / 4;
		if (force || Math.abs(this.lastUpdateX - point.x) > threshold || Math.abs(this.lastUpdateY - point.y) > threshold) {
			this.lastUpdateX = point.x;
			this.lastUpdateY = point.y;
			
			if (!this.isThumbnailComplete) return;
	
			var ww = display.adaptWidth;
			var hh = display.adaptHeight;
	
			var imgX = Math.max(Math.floor(-point.x / IMG_SIZE), 0);
			var imgY = Math.max(Math.floor(-point.y / IMG_SIZE), 0);
	
			var imgXCount = Math.min(imgX + Math.ceil(ww / IMG_SIZE) + 1, this.maxImagX);
			var imgYCount = Math.min(imgY + Math.ceil(hh / IMG_SIZE) + 1, this.maxImagY);



			var imgX = Math.max(Math.floor(-point.x / IMG_SIZE), 0);
			var imgY = Math.max(Math.floor(-point.y / IMG_SIZE), 0);

			var imgXCount = imgX + Math.ceil(ww / IMG_SIZE) + 1;
			var imgYCount = imgY + Math.ceil(hh / IMG_SIZE) + 1;

			imgX = Math.min(imgX,this.maxImagX)
			imgY = Math.min(imgY ,this.maxImagY)

	
			var furtureMap = {};
			for (var i = imgX; i < imgXCount; i++) {
				for (var j = imgY; j < imgYCount; j++) {
					let sourceName = ResPathUtil.GetTileImagePath(this.mapName, i, this.maxImagY - j - 1); // 地图切割是按左上角坐标系
					this._imageList[j] = this._imageList[j] || [];
	
					var s = this._imageList[j][i] || new TileImage();
					s.setAnchor(0, 0);
					s.source = sourceName;
					s.setPosition(i * IMG_SIZE, j * IMG_SIZE);
					
					s.addTo(this)
					
					
					this._imageList[j][i] = s;
					furtureMap[sourceName] = s;
				}
			}
	
			// 删除不再可视的图片并从dom中移除
			Object.keys(this._showMap)
				.filter(key => !furtureMap[key])
				.forEach(key => {
					var image = this._showMap[key];
					image.removeFromParent()
					delete this._showMap[key];
				});
			this._showMap = furtureMap;
		}
	};
	



}



































// public updateHDMap(point: any, force: boolean = false) {
// 	var IMG_SIZE = this.imgSize;
// 	if (force || Math.abs(this.lastUpdateX - point.x) > IMG_SIZE / 4 || Math.abs(this.lastUpdateY - point.y) > IMG_SIZE / 4 ) {
// 		this.lastUpdateX = point.x;
// 		this.lastUpdateY = point.y;
// 		if (!this.isThumbnailComplete)
// 			return;
// 		var ww = display.adaptWidth;
// 		var hh = display.adaptHeight;

// 		var imgX = Math.max(Math.floor(-point.x / IMG_SIZE), 0);
// 		var imgY = Math.max(Math.floor(-point.y / IMG_SIZE), 0);

// 		var imgXCount = imgX + Math.ceil(ww / IMG_SIZE) + 1;
// 		var imgYCount = imgY + Math.ceil(hh / IMG_SIZE) + 1;

// 		imgX = Math.min(imgX,this.maxImagX)
// 		imgY = Math.min(imgY ,this.maxImagY)
	
// 		var tempMap = {};
// 		for (var i = imgX; i <= imgXCount && i < this.maxImagX; i++) {
// 			for (var j = imgY; j <= imgYCount && j < this.maxImagY; j++) {
// 				let sourceName = ResPathUtil.GetTileImagePath(this.mapName, i, this.maxImagY -j -1)  //地图切割是按左上角坐标系
// 				this._imageList[j] = this._imageList[j] || [];
// 				var s:GameImage = this._imageList[j][i] || new GameImage;
// 				s.setAnchor(0,0)
// 				s.source = sourceName;
// 				s.setPosition(i*IMG_SIZE,j*IMG_SIZE)
			
// 				if (!s.parent)
// 					this.addChild(s);
// 				this._imageList[j][i] = s;

// 				tempMap[sourceName] = s
// 			}
// 		}

// 		for (const key in this._showMap) {
// 			const image = this._showMap[key];
// 			if(!tempMap[key]){
// 				image.parent = null
// 				delete this._showMap[key]
// 			}
// 		}
// 		this._showMap = tempMap
// 	}
// };