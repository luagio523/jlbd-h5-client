
/**
 * Dijkstra path-finder.
 * @constructor
 * @extends AStarFinder
 * @param {Object} opt
 * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed.
 *     Deprecated, use diagonalMovement instead.
 * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching
 *     block corners. Deprecated, use diagonalMovement instead.
 * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
 */

import AStarFinder from "./AStarFinder";


export default class DijkstraFinder extends AStarFinder{
    public constructor(opt) {
        super(opt);
        this.heuristic = function(dx:number, dy:number) {
            return 0;
        };
    }
}
