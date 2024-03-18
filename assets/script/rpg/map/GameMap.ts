import { Rect, Texture2D, TiledLayer, TiledMap, TiledMapAsset, Vec2, log, resources, v2 } from "cc";
import MapGrid from "./MapGrid";
import { EventDispatcher } from "../../core/common/event/EventDispatcher";
import { ListenerFunc } from "../../core/common/event/EventMessage";
import { Event } from "./Event";
import { ResPathUtil } from "./ResPathUtil";

export enum MapType {
    NONE = 0,
    SLICE = 1,//切片地图
}



/**
 * 地图数据
 */
export class GameMap extends EventDispatcher{
    public static IMG_SIZE = 256 //地图切割大小
    public mapType: MapType = MapType.NONE
    public MAP_PATH: ""
    public mapID: string = "map005";
    public mapX: number = 0;
    public mapY: number = 0;
    public cellSize: number; //格子大小
    public maxWidth: number; //地图的最大宽度
    public maxHeight: number; //地图的最大高度
    public col: number;
    public row: number;

    private static inst:GameMap;

    static ins():GameMap
    {
        if(!this.inst)
        {
            this.inst = new GameMap();
        }
        return this.inst;
    }

    /** 初始化 */
    public init(mapType: MapType = MapType.NONE) {
        this.mapType = mapType

    };

    public tileMap: TiledMap


    /** 更新数据 */
    public async loadMap(mapID: string) {
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
    };

    /** 解析流 */
    public handleMap(tileMap: TiledMap) {
        let tileSize = tileMap.getTileSize()
        let mapSize = tileMap.getMapSize()
        this.cellSize = tileSize.width; //gridSize
        this.maxWidth = mapSize.width * this.cellSize; //sizeWidth
        this.maxHeight = mapSize.height * this.cellSize; //sizeHeight
        this.col = mapSize.width; //col
        this.row = mapSize.height; //row
        log(tileMap.getTileSize(), tileMap.getMapSize())

        if (this.mapType == MapType.NONE) {
            let layers = this.tileMap.getLayers()
            let collisionLayer = layers[layers.length - 1]
            MapGrid.ins().initGrid(this.row, this.col, (x: number, y: number) => {
                return collisionLayer.getTileGIDAt(x, this.row - y - 1) //坐标系是左上角所以进行转换
            })

        } else {
            let collisionLayer: TiledLayer = tileMap.getLayer("road")
            MapGrid.ins().initGrid(this.row, this.col, (x: number, y: number) => {
                return collisionLayer.getTileGIDAt(x, this.row - y - 1) //坐标系是左上角所以进行转换
            })
            collisionLayer.node.parent = null
            collisionLayer.node.destroy()
        }
        log("real enter map")
        this.onComplete()
    };

    protected onComplete():void{
        this.dispatchEvent(Event.MAP_DATA_INIT)
    }


    /**
     * 获取格子点
     * @param x 
     * @param y 
     * @returns 
     */
    public getGridPoint(x, y) {
        let tx = Math.floor(x / this.cellSize)
        let ty = Math.floor(y / this.cellSize)
        return v2(tx, ty)
    }

    /**
     * 转换左上角坐标系
     * @param x 
     * @param y 
     * @returns 
     */
    public transLPPoint(p: Vec2) {
        p.y = this.maxHeight - p.y
        return
    }

    /**
     * 获取坐标像素点
     * @param gridX 
     * @param gridY 
     * @returns 
     */
    public getPixelPoint(gridX: number, gridY: number) {
        let x = gridX * this.cellSize

        let y = gridY * this.cellSize
        return v2(x, y)
    }



    // 地图坐标到像素坐标的转换
    public posToPixel(val: number): number {
        return val * this.cellSize
    }

    public pixelToPos(val: number): number {
        return Math.floor(val / this.cellSize)
    }


    /**
   * 像素矩形转换为格子矩形
   * @param rect 
   */
    public convertGDRect(rect: Rect) {
        let left = rect.x
        let right = rect.x + rect.width
        let up = rect.y + rect.height
        let bottom = rect.y

        left = Math.round(left / this.cellSize) //  math.round 可能好点
        right = Math.floor((right) / this.cellSize)
        up = Math.floor((up) / this.cellSize)
        bottom = Math.round((bottom) / this.cellSize)


        rect.xMin = left
        rect.xMax = right
        rect.yMin = bottom
        rect.yMax = up
    }

    /**
   * 判断格子是否能走
   * @param x 
   * @param y 
   * @returns 
   */
    public isWalkable(x: number, y: number) {
        var sx = Math.floor(x / this.cellSize);
        var sy = Math.floor(y / this.cellSize);
        return this.checkWalkable(sx, sy)
    }


    /** 检查是否不可移动 */
    public checkWalkable(x, y) {
        let node = MapGrid.ins().getNodeAt(x, y)
        if (node) {
            return node.walkable
        }
        return false
    };


    /** 检查是否需要透明 */
    public checkAlpha(x, y) {
        let node = MapGrid.ins().getNodeAt(x, y)
        if (node) {
            return node.hidden
        }
        return false
    }


    public getFileName() {
        return this.mapID
    };

}