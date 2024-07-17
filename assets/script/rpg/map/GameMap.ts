import { Rect, Texture2D,  TiledMap, Vec2, log, v2 } from "cc";
import { ResPathUtil } from "./ResPathUtil";
import TerrainMatrix from "./TerrainMatrix";
import app from "../../App";

export enum MapType {
    NONE = 0,
    SLICE = 1, // 切片地图
}



/**
 * 地图数据
 */
export class GameMap  {

    public static IMG_SIZE = 256;

    public MAP_PATH: string = "";
    public mapID: string = "map004";
    public mapX: number = 0;
    public mapY: number = 0;


    //-----------------地图数据-----------------------------------
    public cellSize: number;
    public maxWidth: number;
    public maxHeight: number;
    public col: number;
    public row: number;

    public terrainMatrix:TerrainMatrix

    public constructor() {
        this.terrainMatrix = new TerrainMatrix();
    }

    public getMapPath(): string {
        return ResPathUtil.GetMap( this.mapID);
    }


    private setTextureFilters(tileMap:TiledMap): void {
        for (let frame of tileMap.tmxAsset?.spriteFrames ?? []) {
            frame.texture.setFilters(Texture2D.Filter.NEAREST, Texture2D.Filter.NEAREST);
        }
    }

    public changeMap(mapID: string): void {
        this.terrainMatrix.clear();     
        this.mapID = mapID;
    }

    public initWithTiledMap(tiledMap: TiledMap): void {

        this.setTextureFilters(tiledMap);

        const tileSize = tiledMap.getTileSize();
        const mapSize = tiledMap.getMapSize();

        log("initWithTiledMap",tileSize, mapSize);

        this.cellSize = tileSize.width;
        this.maxWidth = mapSize.width * this.cellSize;
        this.maxHeight = mapSize.height * this.cellSize;
        this.col = mapSize.width;
        this.row = mapSize.height;

        if(!this.terrainMatrix){
            this.terrainMatrix = new TerrainMatrix();
        }

        // const layers = tiledMap.getLayers();
        const roadLayer = tiledMap.getLayer("road");
        if (roadLayer) {
            roadLayer.node.parent = null;
            roadLayer.node.destroy();
        }
  
        this.terrainMatrix.initMatrix(this.row, this.col, (x: number, y: number) => {
            return roadLayer.getTileGIDAt(x, this.row - y - 1);
        });
       
    }

    // private getCollisionLayer(layers: TiledLayer[]): TiledLayer {
    //     if (this.mapType === MapType.NONE) {
    //         return layers[layers.length - 1];
    //     } else {
    //         const roadLayer = this.tileMap.getLayer("road");
    //         if (roadLayer) {
    //             roadLayer.node.parent = null;
    //             roadLayer.node.destroy();
    //         }
    //         return roadLayer;
    //     }
    // }

    public mapWorldToMapNodePosition(worldPoint: Vec2, out: Vec2 = new Vec2()): Vec2 {
        const area = app.adaption.getSafeSize();
        const halfWidth = area.width * 0.5;
        const halfHeight = area.height * 0.5;
        
        out.x = Math.max(Math.min(halfWidth - worldPoint.x, 0), area.width - this.maxWidth);
        out.y = Math.max(Math.min(halfHeight - worldPoint.y, 0), area.height - this.maxHeight);
        
        return out;
    }


    public getGridPoint(x: number, y: number): Vec2 {
        const tx = Math.floor(x / this.cellSize);
        const ty = Math.floor(y / this.cellSize);
        return v2(tx, ty);
    }

    public transLPPoint(p: Vec2): void {
        p.y = this.maxHeight - p.y;
    }

    public getPixelPoint(gridX: number, gridY: number): Vec2 {
        const x = gridX * this.cellSize;
        const y = gridY * this.cellSize;
        return v2(x, y);
    }

    public posToPixel(val: number): number {
        return val * this.cellSize;
    }

    public pixelToPos(val: number): number {
        return Math.floor(val / this.cellSize);
    }

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

    public isWalkable(x: number, y: number): boolean {
        const sx = Math.floor(x / this.cellSize);
        const sy = Math.floor(y / this.cellSize);
        return this.checkWalkable(sx, sy);
    }

    public checkWalkable(gx: number, gy: number): boolean {
        const node = this.terrainMatrix.getNodeAt(gx, gy);
        return node?.walkable ?? false;
    }

    public getFileName(): string {
        return this.mapID;
    }
}