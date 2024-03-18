

/**
 * A node in grid. 
 * This class holds some basic information about a node and custom 
 * attributes may be added, depending on the algorithms' needs.
 * @constructor
 * @param {number} x - The x coordinate of the node on the grid.
 * @param {number} y - The y coordinate of the node on the grid.
 * @param {boolean} [walkable] - Whether this node is walkable.
 */
export default class GridNode{

	/**
	 * 阻碍
	 */
	public static FLAG_OBSTACLE = 0x1;

    /**
     * 遮挡标记位
     */
	public static FLAG_HIDDEN = 0x2


    /**
     * 动态阻挡标记位
     */
	public static FLAG_DYNAMIC_OBSTACLE = 0x4

    public x:number  
    public y:number  
    // public walkable:boolean 

    public val:number

    public g:number
    public f:number
    public h:number


    public opened:boolean

    public by:number

    public parent:GridNode

    public closed:boolean

    public tested:Boolean

    /**
     * clear 
     * 
     * 
     */
     public clear(){
        this.opened = undefined  // when re find ,so need reset
        this.closed = undefined   
        this.parent = undefined
        // this.by = undefined   BiAStarFinder  should set 

        // this.h = undefined
        // this.g = undefined 
        // this.f = undefined 
       
        // this.tested = undefined
    }
   

    constructor(x:number, y:number, val?:number){
        /**
         * The x coordinate of the node on the grid.
         * @type number
         */
        this.x = x;
        /**
         * The y coordinate of the node on the grid.
         * @type number
         */
        this.y = y;
        /**
         * Whether this node can be walked through.
         * @type boolean
         */
        // this.walkable = (walkable === undefined ? true : walkable);
        this.val = (val === undefined ? 0 : val);
    }


    public get walkable():boolean{
        return (this.val & GridNode.FLAG_OBSTACLE) == 0 
    }

    

    public get hidden():boolean{
        return (this.val & GridNode.FLAG_HIDDEN) == GridNode.FLAG_HIDDEN 
    }
    

    public get blocked():boolean{
        return  (this.val & GridNode.FLAG_OBSTACLE) != 0  ||  (this.val & GridNode.FLAG_DYNAMIC_OBSTACLE) != 0 
    }
}
