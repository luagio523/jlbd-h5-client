import Grid from "../core/Grid";

export default interface IPathFinder{
    findPath(startX:number, startY:number, endX:number, endY:number, grid:Grid):Array<any>
}