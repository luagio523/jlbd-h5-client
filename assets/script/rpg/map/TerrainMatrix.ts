import Grid from "./pathfinding/core/Grid";

/**
 * 可以限定区域的网格
 */
export class RegionMatrix extends Grid {
    protected minX: number = 0;
    protected maxX: number = 0;
    protected minY: number = 0;
    protected maxY: number = 0;

    constructor() {
        super();
    }

    /**
     * 初始化地图格子数据
     */
    public init(width: number | any[][], height?: number, matrix?: (number | boolean)[][]): void {
        super.init(width, height, matrix);
        this.updateRegion(0, this.width, 0, this.height);
    }

    /**
     * 判断位置是否在网格内
     */
    public isInside(x: number, y: number): boolean {
        return x >= this.minX && x < this.maxX && y >= this.minY && y < this.maxY;
    }

    /**
     * 判断给定位置的节点是否可行走
     */
    public isWalkableAt(x: number, y: number): boolean {
        return this.isInside(x, y) && !this.nodes[y][x].blocked;
    }

    /**
     * 更新限定区域
     */
    public updateRegion(minX: number, maxX: number, minY: number, maxY: number): void {
        this.minX = Math.max(0, minX);
        this.maxX = Math.min(maxX, this.width);
        this.minY = Math.max(0, minY);
        this.maxY = Math.min(maxY, this.height);
    }

    /**
     * 恢复初始状态
     */
    public recover(): void {
        this.updateRegion(0, this.width, 0, this.height);
        this.clear();
    }

    /**
     * 清理指定区域内的格子状态
     */
    public clear(): void {
        for (let i = this.minY; i < this.maxY; ++i) {
            for (let j = this.minX; j < this.maxX; ++j) {
                this.nodes[i][j].clear();
            }
        }
    }
}

export default class TerrainMatrix extends RegionMatrix {

    /**
     * 初始化寻路网格
     * @param rows 行数
     * @param cols 列数
     * @param getTileGIDAt 获取瓦片GID的函数
     */
    public initMatrix(rows: number, cols: number, getTileGIDAt: (x: number, y: number) => number): void {
        this.init(cols, rows);
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const node = this.getNodeAt(i, j);
                node.val = getTileGIDAt(i, j);
            }
        }
    }
}