/**
 * @author imor / https://github.com/imor
 */

import { Heuristic } from "../core/Heuristic"
import Util from "../core/Util"
import Heap from "../core/Heap"
import Grid from "../core/Grid"
import GridNode from "../core/GridNode"

export default class JumpPointFinderBase{
    protected allowDiagonal:boolean
    protected dontCrossCorners:boolean
    protected heuristic:any 
    protected weight:number 
    protected diagonalMovement:boolean
    protected trackJumpRecursion:boolean
    protected openList:Heap

    protected startNode:GridNode
    protected endNode:GridNode 
    protected grid:Grid 



    /**
     * Search recursively in the direction (parent -> child), stopping only when a
     * jump point is found.
     * @protected
     * @return {Array<Array<number>>} The x, y coordinate of the jump point
     *     found, or null if not found
     */
    protected  _jump(x, y, px, py) {
        return null 
    };

     /**
     * Find the neighbors for the given node. If the node has a parent,
     * prune the neighbors based on the jump point search algorithm, otherwise
     * return all available neighbors.
     * @return {Array<Array<number>>} The neighbors found.
     */
    protected _findNeighbors(node) {
        return 
    };
        
    /**
     * Base class for the Jump Point Search algorithm
     * @param {object} opt
     * @param {function} opt.heuristic Heuristic function to estimate the distance
     *     (defaults to manhattan).
     */
    public constructor(opt) {
        opt = opt || {};
        this.heuristic = opt.heuristic || Heuristic.manhattan;
        this.trackJumpRecursion = opt.trackJumpRecursion || false;
    }

    /**
     * Find and return the path.
     * @return {Array<Array<number>>} The path, including both start and
     *     end positions.
     */
    public findPath(startX:number, startY:number, endX:number, endY:number, grid:Grid):Array<any>  {
        var openList = this.openList = new Heap(function(nodeA, nodeB) {
                return nodeA.f - nodeB.f;
            }),
            startNode = this.startNode = grid.getNodeAt(startX, startY),
            endNode = this.endNode = grid.getNodeAt(endX, endY), node;

        this.grid = grid;
        // set the `g` and `f` value of the start node to be 0
        startNode.g = 0;
        startNode.f = 0;

        // push the start node into the open list
        openList.push(startNode);
        startNode.opened = true;

        // while the open list is not empty
        while (!openList.empty()) {
            // pop the position of node which has the minimum `f` value.
            node = openList.pop();
            node.closed = true;

            if (node === endNode) {
                return Util.expandPath(Util.backtrace(endNode));
            }

            this._identifySuccessors(node);
        }

        // fail to find the path
        return [];
    };

    /**
     * Identify successors for the given node. Runs a jump point search in the
     * direction of each available neighbor, adding any points found to the open
     * list.
     * @protected
     */
    protected _identifySuccessors(node) {
        var grid = this.grid,
            heuristic = this.heuristic,
            openList = this.openList,
            endX = this.endNode.x,
            endY = this.endNode.y,
            neighbors, neighbor,
            jumpPoint, i, l,
            x = node.x, y = node.y,
            jx, jy, dx, dy, d, ng, jumpNode,
            abs = Math.abs, max = Math.max;

        neighbors = this._findNeighbors(node);
        for(i = 0, l = neighbors.length; i < l; ++i) {
            neighbor = neighbors[i];
            jumpPoint = this._jump(neighbor[0], neighbor[1], x, y);
            if (jumpPoint) {

                jx = jumpPoint[0];
                jy = jumpPoint[1];
                jumpNode = grid.getNodeAt(jx, jy);

                if (jumpNode.closed) {
                    continue;
                }

                // include distance, as parent may not be immediately adjacent:
                d = Heuristic.octile(abs(jx - x), abs(jy - y));
                ng = node.g + d; // next `g` value

                if (!jumpNode.opened || ng < jumpNode.g) {
                    jumpNode.g = ng;
                    jumpNode.h = jumpNode.h || heuristic(abs(jx - endX), abs(jy - endY));
                    jumpNode.f = jumpNode.g + jumpNode.h;
                    jumpNode.parent = node;

                    if (!jumpNode.opened) {
                        openList.push(jumpNode);
                        jumpNode.opened = true;
                    } else {
                        openList.updateItem(jumpNode);
                    }
                }
            }
        }
    };
}
