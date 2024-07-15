import { Rect, Texture2D, TiledLayer, TiledMap, TiledMapAsset, Vec2, log, resources, v2 } from "cc";
import MapGrid from "./MapGrid";
import { EventDispatcher } from "../../core/common/event/EventDispatcher";
import { ListenerFunc } from "../../core/common/event/EventMessage";
import { Event } from "./Event";
import { ResPathUtil } from "./ResPathUtil";
import display from "../../core/common/utils/display";

export enum MapType {
    NONE = 0,
    SLICE = 1, // 切片地图
}

/**
 * 地图数据
 */
export class GameMap extends EventDispatcher {
    public static IMG_SIZE = 256; // 地图切割大小
    public mapType: MapType = MapType.NONE; // 地图类型，默认为NONE
    public MAP_PATH: string = "";
    public mapID: string = "map005"; // 地图ID，默认为map005
    public mapX: number = 0; // 地图X坐标
    public mapY: number = 0; // 地图Y坐标
    public cellSize: number; // 格子大小
    public maxWidth: number; // 地图的最大宽度
    public maxHeight: number; // 地图的最大高度
    public col: number; // 地图的列数
    public row: number; // 地图的行数

    private static inst: GameMap;

    private constructor() {
        super();
    }

    static ins(): GameMap {
        if (!this.inst) {
            this.inst = new GameMap();
        }
        return this.inst;
    }

    /** 初始化 */
    public init(mapType: MapType = MapType.NONE): void {
        this.mapType = mapType;
    }

    public tileMap: TiledMap;

    /** 更新数据 */
    public async loadMap(mapID: string): Promise<void> {
        this.mapID = mapID;
        const mapPath = ResPathUtil.GetMap(mapID);
        try {
            resources.load(mapPath, TiledMapAsset, (err, tiledMapAsset) => {
                if (err) {
                    console.error(err);
                    return;
                }
                this.tileMap.tmxAsset = tiledMapAsset;
                for (let frame of this.tileMap.tmxAsset.spriteFrames) {
                    frame.texture.setFilters(Texture2D.Filter.NEAREST, Texture2D.Filter.NEAREST);
                }
                this.handleMap(this.tileMap);
            });
        } catch (err) {
            console.error(err);
        }
    }

    /** 解析流 */
    public handleMap(tileMap: TiledMap): void {
        const tileSize = tileMap.getTileSize();
        const mapSize = tileMap.getMapSize();
        this.cellSize = tileSize.width; // gridSize
        this.maxWidth = mapSize.width * this.cellSize; // sizeWidth
        this.maxHeight = mapSize.height * this.cellSize; // sizeHeight
        this.col = mapSize.width; // col
        this.row = mapSize.height; // row
        log(tileSize, mapSize);

        let layers = this.tileMap.getLayers();
        let collisionLayer: TiledLayer;

        if (this.mapType === MapType.NONE) {
            collisionLayer = layers[layers.length - 1];
        } else {
            collisionLayer = tileMap.getLayer("road");
            collisionLayer.node.parent = null;
            collisionLayer.node.destroy();
        }

        MapGrid.ins().initGrid(this.row, this.col, (x: number, y: number) => {
            return collisionLayer.getTileGIDAt(x, this.row - y - 1); // 坐标系是左上角所以进行转换
        });

        log("real enter map");
        this.onComplete();
    }

    protected onComplete(): void {
        this.dispatchEvent(Event.MAP_DATA_INIT);
    }


    public mapWorldToMapNodePosition(worldPoint: Vec2, out: Vec2 = new Vec2()): Vec2 {
        const halfWidth = display.adaptWidth * 0.5;
        const halfHeight = display.adaptHeight * 0.5;
        
        out.x = Math.max(Math.min(halfWidth - worldPoint.x, 0), display.adaptWidth - this.maxWidth);
        out.y = Math.max(Math.min(halfHeight - worldPoint.y, 0), display.adaptHeight - this.maxHeight);
        
        return out;
    }


    /**
     * 获取格子点
     * @param x 
     * @param y 
     * @returns 
     */
    public getGridPoint(x: number, y: number): Vec2 {
        const tx = Math.floor(x / this.cellSize);
        const ty = Math.floor(y / this.cellSize);
        return v2(tx, ty);
    }

    /**
     * 转换左上角坐标系
     * @param p 
     */
    public transLPPoint(p: Vec2): void {
        p.y = this.maxHeight - p.y;
    }

    /**
     * 获取坐标像素点
     * @param gridX 
     * @param gridY 
     * @returns 
     */
    public getPixelPoint(gridX: number, gridY: number): Vec2 {
        const x = gridX * this.cellSize;
        const y = gridY * this.cellSize;
        return v2(x, y);
    }

    // 地图坐标到像素坐标的转换
    public posToPixel(val: number): number {
        return val * this.cellSize;
    }

    public pixelToPos(val: number): number {
        return Math.floor(val / this.cellSize);
    }

    /**
     * 像素矩形转换为格子矩形
     * @param rect 
     */
    public convertGDRect(rect: Rect): void {
        const left = Math.round(rect.x / this.cellSize);
        const right = Math.floor((rect.x + rect.width) / this.cellSize);
        const up = Math.floor((rect.y + rect.height) / this.cellSize);
        const bottom = Math.round(rect.y / this.cellSize);

        rect.xMin = left;
        rect.xMax = right;
        rect.yMin = bottom;
        rect.yMax = up;
    }

    /**
     * 检查格子是否可走
     * @param x X坐标
     * @param y Y坐标
     * @returns 返回是否可走
     */
    public isWalkable(x: number, y: number): boolean {
        const sx = Math.floor(x / this.cellSize);
        const sy = Math.floor(y / this.cellSize);
        return this.checkWalkable(sx, sy);
    }

    /**
     * 检查格子是否不可移动
     * @param gx x格子
     * @param gy y格子
     * @returns 返回是否可移动
     */
    public checkWalkable(gx: number, gy: number): boolean {
        const node = MapGrid.ins().getNodeAt(gx, gy);
        return node ? node.walkable : false;
    }

    public getFileName(): string {
        return this.mapID;
    }
}
