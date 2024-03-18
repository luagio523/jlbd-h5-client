import { Rect, Texture2D, TiledLayer, TiledMap, TiledMapAsset, Vec2, log, resources, v2 } from "cc";
import MapGrid from "./MapGrid";

export enum  MapType{
    NONE = 0,
    SLICE  = 1,//切片地图
}

/**
 * 地图数据
 */
export class GameMap {

    static compFuncs = [];
    static mapType:MapType = MapType.NONE
    static MAP_PATH:""
    static mapID: string = "map005";
    static mapX: number = 0;
    static mapY: number = 0;

    static CELL_SIZE: number; //格子大小
    static MAX_WIDTH: number; //地图的最大宽度
    static MAX_HEIGHT: number; //地图的最大高度
    static COL: number;
    static ROW: number;
   
    static IMG_SIZE:number  = 256 //地图切割大小


    /** 初始化 */
    public static init(mapType:MapType = MapType.NONE) {
        this.mapType = mapType

        this.compFuncs = this.compFuncs || [];
    };

    public static tileMap:TiledMap




    /** 更新数据 */
    public static async loadMap(mapID:string) {
        this.mapID = mapID;
        const mapPath = `${GameMap.MAP_PATH}${this.mapID}`;
        try {
            resources.load(mapPath, TiledMapAsset, (err, tiledMapAsset) => {
                if (err) {
                    console.error(err);
                    return;
                }
                GameMap.tileMap.tmxAsset = tiledMapAsset;
                for (let frame of GameMap.tileMap.tmxAsset.spriteFrames) {
                    frame.texture.setFilters(Texture2D.Filter.NEAREST, Texture2D.Filter.NEAREST);
                }
                GameMap.handleMap(GameMap.tileMap);
              });
            
        } catch (err) {
            console.error(err);
        }
    };
    
    /** 解析流 */
    public static handleMap(tileMap:TiledMap) {
        let tileSize = tileMap.getTileSize()
        let mapSize = tileMap.getMapSize()
        this.CELL_SIZE = tileSize.width; //gridSize
        this.MAX_WIDTH = mapSize.width*this.CELL_SIZE; //sizeWidth
        this.MAX_HEIGHT = mapSize.height*this.CELL_SIZE; //sizeHeight
        this.COL = mapSize.width; //col
        this.ROW = mapSize.height; //row

        log(tileMap.getTileSize(),tileMap.getMapSize())

        if(this.mapType == MapType.NONE){

            let layers = GameMap.tileMap.getLayers()

           let collisionLayer = layers[layers.length - 1]

            MapGrid.ins().initGrid(this.ROW, this.COL, (x:number,y:number)=>{
                return collisionLayer.getTileGIDAt(x,this.ROW -y -1) //坐标系是左上角所以进行转换
            })

        }else{
            
            let collisionLayer:TiledLayer = tileMap.getLayer("road")
            MapGrid.ins().initGrid(this.ROW, this.COL, (x:number,y:number)=>{
                // return collisionLayer.getTileGIDAt(x,y) //坐标系是左上角所以进行转换
                return collisionLayer.getTileGIDAt(x,this.ROW -y -1) //坐标系是左上角所以进行转换
            })
            collisionLayer.node.parent = null 
            collisionLayer.node.destroy()
        }
        // GameLogic.ins().enterMap();// logic进入地图
        log("real enter map")
        this.onComplete()
    };


    private static onComplete(){
        var func;
        for (var i = 0; i < this.compFuncs.length; i++) {
            func = this.compFuncs[i];
            func.func.call(func.obj);
        }
        this.compFuncs.length = 0;
    }

    /**
     * 获取格子点
     * @param x 
     * @param y 
     * @returns 
     */
    public static getGridPoint(x,y){
        let tx = Math.floor(x/GameMap.CELL_SIZE)
        let ty = Math.floor(y/GameMap.CELL_SIZE)
        // return v2(tx,GameMap.ROW - ty -1) //纵坐标  地图和creator相反
        return v2(tx,ty)
    }

    /**
     * 转换左上角坐标系
     * @param x 
     * @param y 
     * @returns 
     */
    public static transLPPoint(p:Vec2){
        p.y = GameMap.MAX_HEIGHT - p.y
        return 
    }


    /**
     * 获取坐标像素点
     * @param gridX 
     * @param gridY 
     * @returns 
     */
    public static getPixelPoint(gridX:number,gridY:number){
        let x = gridX * GameMap.CELL_SIZE

        let y = gridY*GameMap.CELL_SIZE
        return v2(x,y)
    }



     // 地图坐标到像素坐标的转换
    public static posToPixel(val: number): number {
        return val * GameMap.CELL_SIZE
    }

    public static pixelToPos(val: number): number {
        return Math.floor(val / GameMap.CELL_SIZE)
    }


      /**
     * 像素矩形转换为格子矩形
     * @param rect 
     */
    public static  convertGDRect(rect:Rect){
        let left = rect.x 
        let right = rect.x + rect.width
        let up = rect.y + rect.height
        let bottom = rect.y 

        left = Math.round(left/GameMap.CELL_SIZE) //  math.round 可能好点
        right = Math.floor((right)/GameMap.CELL_SIZE)
        up = Math.floor((up)/GameMap.CELL_SIZE)
        bottom = Math.round((bottom)/GameMap.CELL_SIZE)


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
    public static isWalkable(x:number,y:number){
        var sx = Math.floor(x / GameMap.CELL_SIZE);
		var sy = Math.floor(y / GameMap.CELL_SIZE);
		return GameMap.checkWalkable(sx, sy)
    }
    

    /** 检查是否不可移动 */
    public static checkWalkable(x, y) {
        let node = MapGrid.ins().getNodeAt(x,y)
        if(node){
            return node.walkable 
        } 
        return false
    };


    /** 检查是否需要透明 */
    public static checkAlpha(x, y) {
        let node = MapGrid.ins().getNodeAt(x,y)
        if(node){
            return node.hidden 
        } 
        return false
    }

   

    /** 地图数据初始化完毕后调用 */
    public static addCompFunc(func, funcObj) {
        this.compFuncs.push({ func: func, obj: funcObj });
    }

    public static getFileName() {
        return this.mapID
    };



}