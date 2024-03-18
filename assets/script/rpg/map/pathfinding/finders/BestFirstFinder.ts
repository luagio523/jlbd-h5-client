
/**
 * Best-First-Search path-finder.
 * @constructor
 * @extends AStarFinder
 * @param {Object} opt
 * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed.
 *     Deprecated, use diagonalMovement instead.
 * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching
 *     block corners. Deprecated, use diagonalMovement instead.
 * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
 * @param {function} opt.heuristic Heuristic function to estimate the distance
 *     (defaults to manhattan).
 */

import AStarFinder from "./AStarFinder";

export default class BestFirstFinder extends AStarFinder{
    constructor(opt:any) {
        super(opt)
        var orig = this.heuristic;
        this.heuristic = function(dx:number, dy:number) {
            return orig(dx, dy) * 1000000;
        };
    }
}