import { Node, log } from "cc";
import Thumbnail from "./Thumbnail";
import { ResPathUtil } from "./ResPathUtil";
import display from "../../core/common/utils/display";
import TileImage from "./TileImage";

export class MapVisualizer extends Node {
    private lastUpdateX: number; // 上一次更新的指定X
    private lastUpdateY: number; // 上一次更新的指定Y
    private thumbnail: Thumbnail; // 缩略图
    private imageList: Array<Array<TileImage>>; // 地图切片列表
    private showMap: { [key: string]: TileImage };
    private isThumbnailComplete: boolean; // 是否已经加载完缩略图
    private mapName: string; // 地图名字
    private maxImagX: number; // 地图最大的宽
    private maxImagY: number; // 地图最大的高
    private imgSize: number; // 切片尺寸


    public constructor() {
        super();
        this.lastUpdateX = 0;
        this.lastUpdateY = 0;
        this.imageList = [];
        this.showMap = {};
        this.thumbnail = new Thumbnail();
        this.addChild(this.thumbnail);
        this.thumbnail.addEventListener("Complete", this.onThumbnailComplete.bind(this));
    }

    public setLastUpdate(x: number, y: number): void {
        this.lastUpdateX = x;
        this.lastUpdateY = y;
    }

    public destroy(): boolean {
        super.destroy();
        this.thumbnail.removeEventListener("Complete");
        this.removeAllChildren();
        this.imageList = [];
        this.showMap = {};
        return true;
    }

    // 在缩略图加载完成之后开始显示高清图
    public onThumbnailComplete(e: any): void {
        this.isThumbnailComplete = true;
        this.updateHDMap({ x: this.lastUpdateX, y: this.lastUpdateY }, true);
        // 显示遮罩
    }

    public render(w: number, h: number, imgSize: number, mapName: string): void {
        if (this.mapName !== mapName) {
            this.isThumbnailComplete = false;
            this.clearHDMap();
        }
        log("mapName :", this.mapName);
        this.mapName = mapName;
        this.thumbnail.setSize(w, h);
        this.thumbnail.setPosition(w >> 1, h >> 1);

        // 清除图片显示
        for (let i = 0; i < this.imageList.length; i++) {
            let row = this.imageList[i];
            if (Array.isArray(row)) {
                for (let j = 0; j < row.length; j++) {
                    let img = row[j];
                    if (img instanceof TileImage) { // 确保img确实是TileImage的实例
                        img.clear();
                    }
                }
            }
        }

        this.imgSize = imgSize; // 假设切片尺寸为256
        this.maxImagX = Math.ceil(w / this.imgSize);
        this.maxImagY = Math.ceil(h / this.imgSize);
        this.thumbnail.source = ResPathUtil.GetMapThumbnailPath(this.mapName);
    }

    public clearHDMap(): void {
        for (const key in this.showMap) {
            const image = this.showMap[key];
            image.clear();
        }
        this.showMap = {};
    }

    public updateHDMap(point: { x: number, y: number }, force: boolean = false): void {
        const imgSize = this.imgSize;
        const threshold = imgSize / 4;
        if (force || Math.abs(this.lastUpdateX - point.x) > threshold || Math.abs(this.lastUpdateY - point.y) > threshold) {
            this.lastUpdateX = point.x;
            this.lastUpdateY = point.y;

            if (!this.isThumbnailComplete) return;

            const ww = display.adaptWidth;
            const hh = display.adaptHeight;

            let imgX = Math.max(Math.floor(-point.x / imgSize), 0);
            let imgY = Math.max(Math.floor(-point.y / imgSize), 0);

            let imgXCount = Math.min(imgX + Math.ceil(ww / imgSize) + 1, this.maxImagX);
            let imgYCount = Math.min(imgY + Math.ceil(hh / imgSize) + 1, this.maxImagY);

            const futureMap: { [key: string]: TileImage } = {};
            for (let i = imgX; i < imgXCount; i++) {
                for (let j = imgY; j < imgYCount; j++) {
                    const sourceName = ResPathUtil.GetTileImagePath(this.mapName, i, this.maxImagY - j - 1); // 地图切割是按左上角坐标系
                    this.imageList[j] = this.imageList[j] || [];

                    let s = this.imageList[j][i] || new TileImage();
                    s.setAnchor(0, 0);
                    s.source = sourceName;
                    s.setPosition(i * imgSize, j * imgSize);

                    s.addTo(this);

                    this.imageList[j][i] = s;
                    futureMap[sourceName] = s;
                }
            }

            // 删除不再可视的图片并从dom中移除
            Object.keys(this.showMap)
                .filter(key => !futureMap[key])
                .forEach(key => {
                    const image = this.showMap[key];
                    image.removeFromParent();
                    delete this.showMap[key];
                });
            this.showMap = futureMap;
        }
    }
}
