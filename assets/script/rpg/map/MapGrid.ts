import Grid from "./pathfinding/core/Grid"

/**
 * 可以限定区域 
 */
export class PartGrid extends Grid {

    protected minX:number = 0  //限定区域左边
    protected maxX:number = 0   //限定区域右边
    protected minY:number = 0  //限定区域上
    protected maxY:number = 0 //限定区域下

    constructor() {
        super()
    }

    /**
     * 初始化地图格子数据
     * @param width_or_matrix 
     * @param height 
     * @param matrix 
     */
    public init(width_or_matrix:number|any, height?:number, matrix?:Array<Array<number|boolean>>){
        super.init(width_or_matrix,height,matrix)
        this.updateRegion(0,this.width,0,this.height)


        

    }
     /**
     * Determine whether the position is inside the grid.
     * XXX: `grid.isInside(x, y)` is wierd to read.
     * It should be `(x, y) is inside grid`, but I failed to find a better
     * name for this method.
     * @param {number} x
     * @param {number} y
     * @return {boolean}
     */
    public isInside(x:number, y:number):boolean {
        return (x >= this.minX && x < this.maxX) && (y >= this.minY && y < this.maxY);
    };


    /**
     * Determine whether the node at the given position is walkable.
     * (Also returns false if the position is outside the grid.)
     * @param {number} x - The x coordinate of the node.
     * @param {number} y - The y coordinate of the node.
     * @return {boolean} - The walkability of the node.
     */
    public isWalkableAt(x:number, y:number):boolean {
        // return this.isInside(x, y) && this.nodes[y][x].walkable;
        return this.isInside(x, y) && !this.nodes[y][x].blocked;
    };
    

    /**
     * 更新限定区域
     * @param minX 
     * @param maxX 
     * @param minY 
     * @param maxY 
     */
    public updateRegion(minX:number,maxX:number,minY:number,maxY:number){
        this.minX = Math.max(0,minX)
        this.maxX = Math.min(maxX,this.width)
        this.minY = Math.max(0,minY)
        this.maxY = Math.min(maxY,this.height)
    }


    /**
     * 恢复
     */
    public recover(){
        this.updateRegion(0,this.width,0,this.height) //恢复区域
        this.clear() //恢复范围内格子状态
    }


    /**
     * 重写清理 
     */
    public clear(){
        var i:number, j:number,
        thisNodes = this.nodes
        for (i = this.minY; i < this.maxY; ++i) {
            for (j = this.minX; j < this.maxX; ++j) {
                thisNodes[i][j].clear()
            }
        }
    }
   
} 


export default  class MapGrid extends PartGrid{

    public constructor(){
        super()
    }

      /**
     * 初始化网格
     * 这里可以使用对象池技术进行优化
     * @param rows 行数
     * @param cols 列数
     * @param data 节点数据字节流

     */
    public  initGrid(rows:number, cols:number, getTileGIDAt:Function) {
        this.init(cols,rows)
        for (var i = 0; i < cols; i++) {
            for (var j = 0; j < rows; j++) {
                let node = this.getNodeAt(i,j)
                node.val = getTileGIDAt(i,j);
            }
        }
    };


   

     ///////////////////////////////////////////////

     static ins():MapGrid
     {
         if(!this.inst)
         {
             this.inst = new MapGrid();
         }
         return this.inst;
     }
 
     private static inst:MapGrid
}