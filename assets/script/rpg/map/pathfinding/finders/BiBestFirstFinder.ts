
/**
 * Bi-direcitional Best-First-Search path-finder.
 * @constructor
 * @extends BiAStarFinder
 * @param {Object} opt
 * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed.
 *     Deprecated, use diagonalMovement instead.
 * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching
 *     block corners. Deprecated, use diagonalMovement instead.
 * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
 * @param {function} opt.heuristic Heuristic function to estimate the distance
 *     (defaults to manhattan).
 */

import BiAStarFinder from "./BiAStarFinder";

export default class BiBestFirstFinder extends BiAStarFinder{
    public constructor(opt) {
        super(opt);
        var orig = this.heuristic;
        this.heuristic = function(dx:number, dy:number) {
            return orig(dx, dy) * 1000000;
        };
    }
}
