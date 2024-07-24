import { Rect, Size, Texture2D,  TiledMap, Vec2, log, v2 } from "cc";
import { ResPathUtil } from "../util/ResPathUtil";
import TerrainMatrix from "./TerrainMatrix";

export enum MapType {
    NONE = 0,
    SLICE = 1, // 切片地图
}

/**
 * 地图数据
 * 基于左上角坐标系
 */
export class GameMap {
    public static readonly IMG_SIZE = 256;
    public static readonly CELL_SIZE_BITS = 8; // 表示 cellSize 的位数
    public static readonly CELL_SIZE = 1 << GameMap.CELL_SIZE_BITS; // 256

    public MAP_PATH: string = "";
    public mapID: string = "map004";

    public cellSize: number; // 格子大小
    public col: number; // 格子列数
    public row: number; // 格子行数
    public maxWidth: number; // 最大宽度
    public maxHeight: number; // 最大高度

    public terrainMatrix: TerrainMatrix; // 地形数据

    private offset: Vec2 = new Vec2(0, 0); // padding偏移量
    private cachedVisibleArea: Size | null = null; // 可视区域
    private cachedBoundaryArea: Rect | null = null; // 边界区域

    /**
     * 创建一个新的 GameMap 实例
     */
    public constructor() {
        this.terrainMatrix = new TerrainMatrix();
        this.cellSize = GameMap.CELL_SIZE;
        this.col = 0;
        this.row = 0;
        this.maxWidth = 0;
        this.maxHeight = 0;
    }

    /**
     * 获取地图路径
     * @returns {string} 地图路径
     */
    public getMapPath(): string {
        return ResPathUtil.getMap(this.mapID);
    }

    /**
     * 设置纹理过滤器
     * @param {TiledMap} tileMap - TiledMap 实例
     */
    private setTextureFilters(tileMap: TiledMap): void {
        const spriteFrames = tileMap.tmxAsset?.spriteFrames ?? [];
        for (let frame of spriteFrames) {
            frame.texture.setFilters(Texture2D.Filter.NEAREST, Texture2D.Filter.NEAREST);
        }
    }

    /**
     * 更改地图
     * @param {string} mapID - 新的地图ID
     */
    public changeMap(mapID: string): void {
        this.terrainMatrix.clear();     
        this.mapID = mapID;
    }

    /**
     * 使用 TiledMap 初始化地图
     * @param {TiledMap} tiledMap - TiledMap 实例
     * @throws {Error} 如果初始化失败
     */
    public initWithTiledMap(mapID: string, tiledMap: TiledMap): void {
        try {
            const tileSize = tiledMap.getTileSize();
            const mapSize = tiledMap.getMapSize();
            if (!tileSize || !mapSize) {
                throw new Error("Failed to get tile size or map size");
            }
            log(`initWithTiledMap tileSize: ${tileSize.width}, mapSize: ${mapSize.width}, ${mapSize.height}`);
           
            this.mapID = mapID;
            this.setTextureFilters(tiledMap);
            this.cellSize = tileSize.width;
            this.maxWidth = mapSize.width * this.cellSize;
            this.maxHeight = mapSize.height * this.cellSize;
            this.col = mapSize.width;
            this.row = mapSize.height;

            this.calculateOffset();
            this.calculateBoundaryArea(this.cachedVisibleArea ?? new Size(0, 0));

            const roadLayer = tiledMap.getLayer("road");
            if (roadLayer) {
                roadLayer.node.parent = null;
                roadLayer.node.destroy();
            }

            if (!this.terrainMatrix) {
                this.terrainMatrix = new TerrainMatrix();
            }else{
                this.terrainMatrix.clear();
            }
  
            this.terrainMatrix.initMatrix(this.row, this.col, (x: number, y: number) => {
                return roadLayer?.getTileGIDAt(x, y) ?? 0;
            });
        } catch (error) {
            console.error("Failed to initialize map:", error);
            throw error;
        }
    }

    /**
     * 获取可视区域
     * @returns {Size} 可视区域大小
     */
    public getVisibleArea(): Size {
        return this.cachedVisibleArea ?? new Size(0, 0);
    }

    /**
     * 获取边界区域
     * @returns {Rect} 边界区域
     */
    private getBoundaryArea(): Rect {
        if (!this.cachedBoundaryArea) {
            const visibleArea = this.getVisibleArea();
            this.cachedBoundaryArea = this.calculateBoundaryArea(visibleArea);
        }
        return this.cachedBoundaryArea;
    }

    /**
     * 计算边界区域
     * @param {Size} screenSize - 屏幕大小
     * @returns {Rect} 计算后的边界区域
     */
    private calculateBoundaryArea(screenSize: Size): Rect {
        const halfScreenWidth = screenSize.width * 0.5;
        const halfScreenHeight = screenSize.height * 0.5;
        
        const minX = Math.max(halfScreenWidth, 0);
        const minY = Math.max(halfScreenHeight, 0);
        const maxX = Math.min(this.maxWidth - halfScreenWidth - this.offset.x, this.maxWidth - this.offset.x);
        const maxY = Math.min(this.maxHeight - halfScreenHeight - this.offset.y, this.maxHeight - this.offset.y);
     
        return new Rect(
            minX,
            minY,
            Math.max(maxX - minX, 0),
            Math.max(maxY - minY, 0)
        );
    }

    /**
     * 计算偏移量
     */
    private calculateOffset(): void {
        const remainderX = this.maxWidth % GameMap.IMG_SIZE;
        const remainderY = this.maxHeight % GameMap.IMG_SIZE;
        this.offset.x = remainderX > 0 ? GameMap.IMG_SIZE - remainderX : 0;
        this.offset.y = remainderY > 0 ? GameMap.IMG_SIZE - remainderY : 0;
    }

    
    /**
     * 世界坐标转地图节点坐标
     * @param {Vec2} worldPoint - 世界坐标
     * @param {Vec2} [out] - 输出向量，如果不提供则创建新的
     * @returns {Vec2} 地图节点坐标
     */
    public worldToMapNodePosition(worldPoint: Vec2, out: Vec2 = new Vec2()): Vec2 {
        // 世界坐标的反向就是地图节点坐标
        out.x = -worldPoint.x;
        out.y = -worldPoint.y;

        // 获取边界区域和可视区域
        const boundaryArea = this.getBoundaryArea();
        const visibleArea = this.getVisibleArea();

        // 限制地图节点坐标在有效范围内
        const minX = visibleArea.width - boundaryArea.width;
        const minY = visibleArea.height - boundaryArea.height;
        
        out.x = Math.max(Math.min(out.x, 0), minX);
        out.y = Math.max(Math.min(out.y, 0), minY);

        return out;
    }



    /**
     * 更新可视区域
     * @param {Size} visibleArea - 新的可视区域大小
     */
    public updateVisibleArea(visibleArea: Size): void {
        this.cachedVisibleArea = visibleArea;
        this.cachedBoundaryArea = this.calculateBoundaryArea(visibleArea);
    }

    /**
     * 获取网格点
     * @param {number} x - x坐标
     * @param {number} y - y坐标
     * @returns {Vec2} 网格点坐标
     */
    public getGridPoint(x: number, y: number): Vec2 {
        const tx = x >> GameMap.CELL_SIZE_BITS;
        const ty = y >> GameMap.CELL_SIZE_BITS;
        return new Vec2(tx, ty);
    }

    /**
     * 获取像素点
     * @param {number} gridX - 网格X坐标
     * @param {number} gridY - 网格Y坐标
     * @returns {Vec2} 像素点坐标
     */
    public getPixelPoint(gridX: number, gridY: number): Vec2 {
        const x = gridX << GameMap.CELL_SIZE_BITS;
        const y = gridY << GameMap.CELL_SIZE_BITS;
        return new Vec2(x, y);
    }

    /**
     * 位置转像素
     * @param {number} val - 位置值
     * @returns {number} 像素值
     */
    public posToPixel(val: number): number {
        return val << GameMap.CELL_SIZE_BITS;
    }

    /**
     * 像素转位置
     * @param {number} val - 像素值
     * @returns {number} 位置值
     */
    public pixelToPos(val: number): number {
        return val >> GameMap.CELL_SIZE_BITS;
    }

    /**
     * 转换GD矩形
     * @param {Rect} rect - 要转换的矩形
     */
    public convertGDRect(rect: Rect): void {
        const left = Math.round(rect.x >> GameMap.CELL_SIZE_BITS);
        const right = (rect.x + rect.width) >> GameMap.CELL_SIZE_BITS;
        const up = (rect.y + rect.height) >> GameMap.CELL_SIZE_BITS;
        const bottom = Math.round(rect.y >> GameMap.CELL_SIZE_BITS);

        rect.xMin = left;
        rect.xMax = right;
        rect.yMin = bottom;
        rect.yMax = up;
    }

    /**
     * 检查指定位置是否可行走
     * @param {number} x - x坐标
     * @param {number} y - y坐标
     * @returns {boolean} 是否可行走
     */
    public isWalkable(x: number, y: number): boolean {
        const sx = x >> GameMap.CELL_SIZE_BITS;
        const sy = y >> GameMap.CELL_SIZE_BITS;
        return this.checkWalkable(sx, sy);
    }

    /**
     * 检查指定网格是否可行走
     * @param {number} gx - 网格X坐标
     * @param {number} gy - 网格Y坐标
     * @returns {boolean} 是否可行走
     */
    public checkWalkable(gx: number, gy: number): boolean {
        const node = this.terrainMatrix.getNodeAt(gx, gy);
        return node?.walkable ?? false;
    }

    /**
     * 获取地图文件名
     * @returns {string} 地图文件名
     */
    public getFileName(): string {
        return this.mapID;
    }

    /**
     * 将 Cocos Creator 左下角坐标系转换为左上角坐标系
     * @param {Vec2} position - Cocos Creator 坐标系中的位置
     * @returns {Vec2} 左上角坐标系中的位置
     */
    public convertToLeftTopCoordinate(position: Vec2): Vec2 {
        return new Vec2(position.x, this.maxHeight - position.y);
    }
}
