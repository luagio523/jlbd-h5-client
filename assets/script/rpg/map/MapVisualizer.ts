
import { Node, Vec2, Size } from "cc";
import { ResPathUtil } from "./ResPathUtil";
import Thumbnail from "./Thumbnail";
import TileImage from "./TileImage";
import app from "../../App";


export class MapVisualizer extends Node {
	private thumbnail: Thumbnail;
	private tileImages: Map<string, TileImage>;
	private mapName: string;
	private maxImageX: number;
	private maxImageY: number;
	private imgSize: number;
	private lastUpdatePosition: Vec2 = new Vec2();

	constructor() {
		super();
		this.thumbnail = new Thumbnail();
		this.addChild(this.thumbnail);
		this.thumbnail.onLoad = this.onThumbnailComplete.bind(this);
		this.tileImages = new Map();
	}

  //     // 在缩略图加载完成之后开始显示高清图
    public onThumbnailComplete(url: string): void {

        this.updateHDMap(this.lastUpdatePosition, true);
        // 显示遮罩
    }

	public setLastUpdate(x: number, y: number): void {
		this.lastUpdatePosition.x = x;
		this.lastUpdatePosition.y = y;
	}

	public initialize(width: number, height: number, imgSize: number, mapName: string): void {
		app.log.logView({mapName,width, height,imgSize}, ``);
		this.clear();
		this.setupThumbnail(mapName,width, height);
		this.setupTileImages(mapName,width, height, imgSize);
	}

	public updateHDMap(viewPosition: Vec2, force: boolean = false): void {
		if (!force && this.lastUpdatePosition.equals(viewPosition)) return;

		this.lastUpdatePosition.set(viewPosition);

		const visibleTiles = this.getVisibleTiles(viewPosition);
		this.updateVisibleTiles(visibleTiles);
		this.removeInvisibleTiles(visibleTiles);
	}

	private setupThumbnail(mapName: string,width: number, height: number): void {
		
		this.thumbnail.setSize(width, height);
		this.thumbnail.setPosition(width / 2, height / 2);
		this.thumbnail.source = ResPathUtil.getMapThumbnailPath(mapName);
	}

	private setupTileImages(mapName:string,width: number, height: number, imgSize: number): void {
		this.mapName = mapName;
		this.imgSize = imgSize;
		this.maxImageX = Math.ceil(width / imgSize);
		this.maxImageY = Math.ceil(height / imgSize);
	}

	private getVisibleTiles(viewPosition: Vec2): Set<string> {
		// console.log("getVisibleTiles", viewPosition);
		const visibleTiles = new Set<string>();
		const { x, y } = viewPosition;
		const screenSize =   this.getScreenSize();

		const startX = Math.max(Math.floor(-x / this.imgSize), 0);
		const startY = Math.max(Math.floor(-y / this.imgSize), 0);
		const endX = Math.min(startX + Math.ceil(screenSize.width / this.imgSize) + 1, this.maxImageX);
		const endY = Math.min(startY + Math.ceil(screenSize.height / this.imgSize) + 1, this.maxImageY);

		for (let i = startX; i < endX; i++) {
			for (let j = startY; j < endY; j++) {
				visibleTiles.add(`${i},${j}`);
			}
		}

		return visibleTiles;
	}

	private updateVisibleTiles(visibleTiles: Set<string>): void {
		visibleTiles.forEach((tileKey) => {
			if (!this.tileImages.has(tileKey)) {
				const [i, j] = tileKey.split(',').map(Number);
				const tileImage = new TileImage();
				tileImage.setAnchor(0, 0);
				tileImage.source = ResPathUtil.getTileImagePath(this.mapName, i, this.maxImageY - j - 1);
				tileImage.setPosition(i * this.imgSize, j * this.imgSize);
				this.addChild(tileImage);
				this.tileImages.set(tileKey, tileImage);
			}
		});
	}

	private removeInvisibleTiles(visibleTiles: Set<string>): void {
		this.tileImages.forEach((tileImage, key) => {
			if (!visibleTiles.has(key)) {
				tileImage.removeFromParent();
				this.tileImages.delete(key);
			}
		});
	}

	private clear(): void {
		this.thumbnail.clear()
		this.tileImages.forEach(tileImage => tileImage.removeFromParent());
		this.tileImages.clear();
	}

	private getScreenSize(): Size {
		return app.adaption.getSafeSize();	
	}
  
}

// export class MapVisualizer extends Node {
//     private lastUpdateX: number; // 上一次更新的指定X
//     private lastUpdateY: number; // 上一次更新的指定Y
//     private thumbnail: Thumbnail; // 缩略图
//     private imageList: Array<Array<TileImage>>; // 地图切片列表
//     private showMap: { [key: string]: TileImage };
//     private isThumbnailComplete: boolean; // 是否已经加载完缩略图
//     private mapName: string; // 地图名字
//     private maxImagX: number; // 地图最大的宽
//     private maxImagY: number; // 地图最大的高
//     private imgSize: number; // 切片尺寸


//     public constructor() {
//         super();
//         this.lastUpdateX = 0;
//         this.lastUpdateY = 0;
//         this.imageList = [];
//         this.showMap = {};
//         this.thumbnail = new Thumbnail();
//         this.addChild(this.thumbnail);
//         this.thumbnail.addEventListener("Complete", this.onThumbnailComplete.bind(this));
//     }

//     public setLastUpdate(x: number, y: number): void {
//         this.lastUpdateX = x;
//         this.lastUpdateY = y;
//     }

//     public destroy(): boolean {
//         super.destroy();
//         this.thumbnail.removeEventListener("Complete");
//         this.removeAllChildren();
//         this.imageList = [];
//         this.showMap = {};
//         return true;
//     }

//     // 在缩略图加载完成之后开始显示高清图
//     public onThumbnailComplete(e: any): void {
//         this.isThumbnailComplete = true;
//         this.updateHDMap({ x: this.lastUpdateX, y: this.lastUpdateY }, true);
//         // 显示遮罩
//     }

//     public render(w: number, h: number, imgSize: number, mapName: string): void {
//         if (this.mapName !== mapName) {
//             this.isThumbnailComplete = false;
//             this.clearHDMap();
//         }
//         log("mapName :", this.mapName);
//         this.mapName = mapName;
//         this.thumbnail.setSize(w, h);
//         this.thumbnail.setPosition(w >> 1, h >> 1);

//         // 清除图片显示
//         for (let i = 0; i < this.imageList.length; i++) {
//             let row = this.imageList[i];
//             if (Array.isArray(row)) {
//                 for (let j = 0; j < row.length; j++) {
//                     let img = row[j];
//                     if (img instanceof TileImage) { // 确保img确实是TileImage的实例
//                         img.clear();
//                     }
//                 }
//             }
//         }

//         this.imgSize = imgSize; // 假设切片尺寸为256
//         this.maxImagX = Math.ceil(w / this.imgSize);
//         this.maxImagY = Math.ceil(h / this.imgSize);
//         this.thumbnail.source = ResPathUtil.GetMapThumbnailPath(this.mapName);
//     }

//     public clearHDMap(): void {
//         for (const key in this.showMap) {
//             const image = this.showMap[key];
//             image.clear();
//         }
//         this.showMap = {};
//     }

//     public updateHDMap(point: { x: number, y: number }, force: boolean = false): void {
//         const imgSize = this.imgSize;
//         const threshold = imgSize / 4;
//         if (force || Math.abs(this.lastUpdateX - point.x) > threshold || Math.abs(this.lastUpdateY - point.y) > threshold) {
//             this.lastUpdateX = point.x;
//             this.lastUpdateY = point.y;

//             if (!this.isThumbnailComplete) return;

//             const ww = display.adaptWidth;
//             const hh = display.adaptHeight;

//             let imgX = Math.max(Math.floor(-point.x / imgSize), 0);
//             let imgY = Math.max(Math.floor(-point.y / imgSize), 0);

//             let imgXCount = Math.min(imgX + Math.ceil(ww / imgSize) + 1, this.maxImagX);
//             let imgYCount = Math.min(imgY + Math.ceil(hh / imgSize) + 1, this.maxImagY);

//             const futureMap: { [key: string]: TileImage } = {};
//             for (let i = imgX; i < imgXCount; i++) {
//                 for (let j = imgY; j < imgYCount; j++) {
//                     const sourceName = ResPathUtil.GetTileImagePath(this.mapName, i, this.maxImagY - j - 1); // 地图切割是按左上角坐标系
//                     this.imageList[j] = this.imageList[j] || [];

//                     let s = this.imageList[j][i] || new TileImage();
//                     s.setAnchor(0, 0);
//                     s.source = sourceName;
//                     s.setPosition(i * imgSize, j * imgSize);

//                     s.addTo(this);

//                     this.imageList[j][i] = s;
//                     futureMap[sourceName] = s;
//                 }
//             }

//             // 删除不再可视的图片并从dom中移除
//             Object.keys(this.showMap)
//                 .filter(key => !futureMap[key])
//                 .forEach(key => {
//                     const image = this.showMap[key];
//                     image.removeFromParent();
//                     delete this.showMap[key];
//                 });
//             this.showMap = futureMap;
//         }
//     }
// }
