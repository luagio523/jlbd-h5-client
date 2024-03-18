
import Grid from "./core/Grid"
import { Heuristic } from "./core/Heuristic"
import Util from "./core/Util"
import AStarFinder from "./finders/AStarFinder"
import BestFirstFinder from "./finders/BestFirstFinder"
import BiAStarFinder from "./finders/BiAStarFinder"
import BiBestFirstFinder from "./finders/BiBestFirstFinder"
import BiBreadthFirstFinder from "./finders/BiBreadthFirstFinder"
import BiDijkstraFinder from "./finders/BiDijkstraFinder"
import BreadthFirstFinder from "./finders/BreadthFirstFinder"
import DijkstraFinder from "./finders/DijkstraFinder"
import IDAStarFinder from "./finders/IDAStarFinder"
import IPathFinder from "./finders/IPathFinder"
import { JumpPointFinder } from "./finders/JumpPointFinder"

export enum PathFinderType  {
    AStarFinder =0,        //A*算法
    BestFirstFinder = 1,    //最佳优先算法
    BreadthFirstFinder = 2,  //广度优先
    DijkstraFinder = 3,      //迪杰斯特拉算法
    BiAStarFinder = 4,       //双向A*
    BiBestFirstFinder = 5,    //双向最佳
    BiBreadthFirstFinder = 6,  //双向 广度优先
    BiDijkstraFinder = 7,    //双向dj
    IDAStarFinder = 8,      // 深度变种
    JumpPointFinder = 9,    // jps算法
    OrthogonalJumpPointFinder  = 10,
}

/**
 */
export default class PathFinding {

    public static test(){
        // var grid = new Grid(5, 3); //default be able to be walked through
        // grid.setWalkableAt(0, 1, false) //where 0 is the x coordinate (from left to right), and 1 is the y coordinate (from up to down):

        var matrix = [
            [0, 0, 0, 0, 0],
            [1, 1, 1, 0, 1],
            [0, 0, 0, 0, 0],     
            [0, 0, 1, 1, 1],   
            [0, 0, 1, 0, 0],   
            [0, 0, 0, 0, 0],                              
        ];
        var grid = new Grid(matrix)

        // var finder = new AStarFinder({
        //     allowDiagonal: true
        // });

        //Be aware that grid will be modified in each path-finding, and will not be usable afterwards. If you want to use a single grid multiple times, create a clone for it before calling findPath.
        // var gridBackup = grid.clone();

        // var finder = new AStarFinder({
        //     allowDiagonal: true,
        //     dontCrossCorners: true
        // });
        // var finder = new AStarFinder({
        //     heuristic: Heuristic.chebyshev
        // });
        // var finder = new BestFirstFinder({
        //     allowDiagonal: true,
        //     heuristic: function(dx, dy) {
        //         return Math.min(dx, dy);
        //     }
        // });
        // var finder = new BreadthFirstFinder({
        //     allowDiagonal: true,
        // });

        // var finder = new DijkstraFinder({
        //     allowDiagonal: true,
        // });

        // var finder = new BiAStarFinder({
        //     allowDiagonal: true,
        // });

        // var finder = new BiBestFirstFinder({   //for test 
        //     allowDiagonal: true,
        // });

        // var finder = new BiBreadthFirstFinder({
        //     allowDiagonal: true,
        // });

        // var finder = new BiDijkstraFinder({
        //     allowDiagonal: true,
        // });

        // var finder = new IDAStarFinder({
        //     allowDiagonal: true,
        // });

        var finder = JumpPointFinder({
            allowDiagonal: true,
        });

        // for (let index = 0; index <=9; index++) {
        //     var grid = new Grid(matrix)
        //     var path = this.getFinder(index,{
        //         allowDiagonal: true
        //     }).findPath(0, 0, 4, 5, grid)     
        //     cc.log(`====================${index}=============`)
        //     cc.log("find path",path)  
        //     cc.log("compress path",this.compressPath(path))
        //     // cc.log("soomth path",this.smoothenPath(path,grid))
        // }

        // cc.log(JSON.stringify(grid))

        var path = finder.findPath(0, 0, 4, 5, grid);
        cc.log(path)
       

        grid.clear()

        // grid = grid.clone()  somethings  clone is fast then clear ,but think about js garbage collect
        

        var path = finder.findPath(0, 0, 4, 5, grid);

        // cc.log("==find path",path)  
        // cc.log("==compress path",this.compressPath(path))
        // cc.log("==soomth path",this.smoothenPath(path,grid))
    }

    /**
     * Note that the new path will be compressed as well, i.e. if the original path is [[0, 1], [0, 2], [0, 3], [0, 4]], then the new path will be [[0, 1], [0, 4]].
     * @param path 
     * @returns 
     */
    public static compressPath(path){
        return Util.compressPath(path)
    }
    /**
     * To expand the compressed path like [[0, 1], [0, 4]] back to [[0, 1], [0, 2], [0, 3], [0, 4]], you may use PF.Util.expandPath.
     * @param path 
     * @returns 
     */
    public static expandPath(path){
        return Util.expandPath(path)
    }
    /**
     * 
     * To smoothen the path, you may use PF.Util.smoothenPath. This routine will return a new path with the original one unmodified.
     * @param path 
     * @returns 
     */
    public static smoothenPath(grid,path){
        return Util.smoothenPath(grid,path)
    }

    public static getFinder(pf:PathFinderType,opt?:any):IPathFinder{
        switch(pf){
            case PathFinderType.AStarFinder:
                return new AStarFinder(opt)
            case PathFinderType.BestFirstFinder:
                return new BestFirstFinder(opt)
            case PathFinderType.BreadthFirstFinder:
                return new BreadthFirstFinder(opt)
            case PathFinderType.DijkstraFinder:
                return new DijkstraFinder(opt)
            case PathFinderType.BiAStarFinder:
                return new BiAStarFinder(opt)
            case PathFinderType.BiBestFirstFinder:
                return new BiBestFirstFinder(opt)
            case PathFinderType.BiBreadthFirstFinder:
                return new BiBreadthFirstFinder(opt)
            case PathFinderType.BiDijkstraFinder:
                return new BiDijkstraFinder(opt)
            case PathFinderType.IDAStarFinder:
                return new IDAStarFinder(opt)
            case PathFinderType.JumpPointFinder:
                return  JumpPointFinder(opt)
            default:
                return new AStarFinder(opt)
        }
    }
}