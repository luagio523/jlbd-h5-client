// 定义纹理类型
type Texture = {
    id: number; // 纹理的唯一标识符
    name: string; // 纹理名称
};

// 定义地形单元
class TerrainTile {
    textures: Texture[]; // 当前地形单元的纹理
    corners: number; // 角点索引

    constructor() {
        this.textures = [];
        this.corners = 0;
    }

    // 添加纹理
    addTexture(texture: Texture) {
        this.textures.push(texture);
    }

    // 计算角点索引
    calculateCorners() {
        this.corners = 0;
        for (let i = 0; i < this.textures.length; i++) {
            this.corners |= (1 << i); // 更新角点索引
        }
    }
}

// 定义地形生成器
class TerrainGenerator {
    tiles: TerrainTile[][]; // 地形单元网格

    constructor(size: number) {
        this.tiles = Array.from({ length: size }, () => Array.from({ length: size }, () => new TerrainTile()));
    }

    // 设置纹理
    setTexture(x: number, y: number, texture: Texture) {
        const tile = this.tiles[y][x];
        tile.addTexture(texture);
        tile.calculateCorners();
    }

    // 获取拼接后的纹理
    getMergedTexture(x: number, y: number): Texture | null {
        const tile = this.tiles[y][x];
        // 根据角点索引选择合适的纹理
        const index = tile.corners;
        // 这里可以根据索引选择具体的纹理
        // 示例：简单返回第一个纹理
        return tile.textures[0] || null;
    }
}

// 示例用法
const terrainGen = new TerrainGenerator(10); // 创建10x10的地形

// 定义一些纹理
const grass: Texture = { id: 1, name: "Grass" };
const dirt: Texture = { id: 2, name: "Dirt" };

// 设置纹理
terrainGen.setTexture(0, 0, grass);
terrainGen.setTexture(0, 1, dirt);
terrainGen.setTexture(1, 0, grass);
terrainGen.setTexture(1, 1, dirt);

// 获取拼接后的纹理
const mergedTexture = terrainGen.getMergedTexture(0, 0);
console.log(mergedTexture);
