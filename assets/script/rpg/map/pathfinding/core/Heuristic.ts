/**
 * @namespace PF.Heuristic
 * @description A collection of heuristic functions.
 */
export const  Heuristic = {
        /**
     * Manhattan distance.
     * @param {number} dx - Difference in x.
     * @param {number} dy - Difference in y.
     * @return {number} dx + dy
     */
    manhattan: function(dx:number, dy:number):number {
        return dx + dy;
    },
    /**
     * Euclidean distance.
     * @param {number} dx - Difference in x.
     * @param {number} dy - Difference in y.
     * @return {number} sqrt(dx * dx + dy * dy)
     */
    euclidean: function(dx:number, dy:number):number {
        return Math.sqrt(dx * dx + dy * dy);
    },

    // Math.abs(targetX - nX) + Math.abs(targetY - nY) * 10

    /**
     * Octile distance.
     * @param {number} dx - Difference in x.
     * @param {number} dy - Difference in y.
     * @return {number} sqrt(dx * dx + dy * dy) for grids
     */
    octile: function(dx:number, dy:number):number {
        var F = Math.SQRT2 - 1;
        return (dx < dy) ? F * dx + dy : F * dy + dx;
    },

    /**
     * Chebyshev distance.
     * @param {number} dx - Difference in x.
     * @param {number} dy - Difference in y.
     * @return {number} max(dx, dy)
     */
    chebyshev: function(dx:number, dy:number):number {
        return Math.max(dx, dy);
    }

}



// 对于网格地图来说, 如果只能四方向(上下左右)移动, 曼哈顿距离(Manhattan distance) 是最合适的启发函数.

// function Manhattan(node) =
//     dx = abs(node.x - goal.x)
//     dy = abs(node.y - goal.y)
//     // 在最简单的情况下, D 可以取 1, 返回值即 dx + dy
//     return D * (dx + dy)
// 如果网格地图可以八方向(包括斜对角)移动, 使用 切比雪夫距离(Chebyshev distance) 作为启发函数比较合适.

// function Chebyshev(node) =
//     dx = abs(node.x - goal.x)
//     dy = abs(node.y - goal.y)
//     // max(dx, dy) 保证了斜对角的距离计算
//     return D * max(dx, dy)
// 如果地图中允许任意方向移动, 不太建议使用网格 (Grid) 来描述地图, 可以考虑使用 路点 (Way Points) 或者 导航网格 (Navigation Meshes) , 此时使用 欧式距离(Euclidean distance) 来作为启发函数比较合适.

// function heuristic(node) =
//     dx = abs(node.x - goal.x)
//     dy = abs(node.y - goal.y)
//     // 在最简单的情况下, D 可以取 1, 返回值即 sqrt(dx * dx + dy * dy)
//     return D * sqrt(dx * dx + dy * dy)
// 欧式距离因为有一个 sqrt() 运算, 计算开销会增大, 所以可以使用 Octile 距离 来优化(不知道怎么翻译), Octile 的核心思想就是假定只能做 45 度角转弯.

// function heuristic(node) =
//     dx = abs(node.x - goal.x)
//     dy = abs(node.y - goal.y)
//     k = sqrt(2) - 1
//     return max(dx, dy) + k * min(dx, dy)
