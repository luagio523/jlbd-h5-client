
// Tile.ts

// 定义牌的类型
export enum TileType {
    Man = "Man",    // 万子
    Pin = "Pin",    // 筒子
    Sou = "Sou",    // 索子
    Wind = "Wind",  // 风牌
    Dragon = "Dragon" // 三元牌
}

// 定义风牌的类型
export enum WindType {
    East = "East",   // 东
    South = "South", // 南
    West = "West",   // 西
    North = "North"  // 北
}

// 定义三元牌的类型
export enum DragonType {
    White = "White", // 白
    Green = "Green", // 发
    Red = "Red"      // 中
}

export class Tile {
    // 有效的数字牌值（1-9）
    private static readonly validNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    constructor(
        public readonly type: TileType,
        public readonly value: number | WindType | DragonType
    ) {
        this.validateTile();
    }

    // 验证牌的合法性
    private validateTile(): void {
        switch (this.type) {
            case TileType.Man:
            case TileType.Pin:
            case TileType.Sou:
                if (!Tile.validNumbers.includes(this.value as number)) {
                    throw new Error(`无效的${this.type}牌值: ${this.value}`);
                }
                break;
            case TileType.Wind:
                if (!Object.values(WindType).includes(this.value as WindType)) {
                    throw new Error(`无效的风牌类型: ${this.value}`);
                }
                break;
            case TileType.Dragon:
                if (!Object.values(DragonType).includes(this.value as DragonType)) {
                    throw new Error(`无效的三元牌类型: ${this.value}`);
                }
                break;
        }
    }

    // 将牌转换为字符串表示
    public toString(): string {
        switch (this.type) {
            case TileType.Man:
                return `${this.value}m`; // 万
            case TileType.Pin:
                return `${this.value}p`; // 筒
            case TileType.Sou:
                return `${this.value}s`; // 索
            case TileType.Wind:
                return `${this.value}`; // 风牌
            case TileType.Dragon:
                return `${this.value}`; // 三元牌
        }
    }

    // 判断是否为字牌（风牌或三元牌）
    public isHonor(): boolean {
        return this.type === TileType.Wind || this.type === TileType.Dragon;
    }

    // 判断是否为幺九牌（数字牌的1和9）
    public isTerminal(): boolean {
        return (this.type === TileType.Man || this.type === TileType.Pin || this.type === TileType.Sou)
            && (this.value === 1 || this.value === 9);
    }

    // 判断是否为中张牌（非字牌且非幺九牌）
    public isSimple(): boolean {
        return !this.isHonor() && !this.isTerminal();
    }

    // 创建万子
    public static createMan(value: number): Tile {
        return new Tile(TileType.Man, value);
    }

    // 创建筒子
    public static createPin(value: number): Tile {
        return new Tile(TileType.Pin, value);
    }

    // 创建索子
    public static createSou(value: number): Tile {
        return new Tile(TileType.Sou, value);
    }

    // 创建风牌
    public static createWind(wind: WindType): Tile {
        return new Tile(TileType.Wind, wind);
    }

    // 创建三元牌
    public static createDragon(dragon: DragonType): Tile {
        return new Tile(TileType.Dragon, dragon);
    }

    // 创建一整副麻将牌（共136张）
    public static createFullSet(): Tile[] {
        const tiles: Tile[] = [];

        // 创建数字牌（万、筒、索）
        [TileType.Man, TileType.Pin, TileType.Sou].forEach(type => {
            Tile.validNumbers.forEach(value => {
                for (let i = 0; i < 4; i++) { // 每种牌有4张
                    tiles.push(new Tile(type, value));
                }
            });
        });

        // 创建风牌
        Object.values(WindType).forEach(wind => {
            for (let i = 0; i < 4; i++) { // 每种风牌有4张
                tiles.push(new Tile(TileType.Wind, wind));
            }
        });

        // 创建三元牌
        Object.values(DragonType).forEach(dragon => {
            for (let i = 0; i < 4; i++) { // 每种三元牌有4张
                tiles.push(new Tile(TileType.Dragon, dragon));
            }
        });

        return tiles;
    }
}

// 日本麻将有三种数字牌（万子、筒子、索子），每种从1到9，每个数字4张。
// 有四种风牌（东、南、西、北），每种4张。
// 有三种三元牌（中、发、白），每种4张。
// 字牌包括风牌和三元牌。
// 幺九牌是指数字牌中的1和9。
// 中张牌是指除了字牌和幺九牌之外的牌。


// // 创建五万
// const fiveMan = Tile.createMan(5);
// // 创建东风
// const eastWind = Tile.createWind(WindType.East);
// // 创建白板
// const whiteDragon = Tile.createDragon(DragonType.White);

// console.log(fiveMan.toString());  // 输出: 5m
// console.log(eastWind.toString()); // 输出: East
// console.log(whiteDragon.toString()); // 输出: White

// console.log(fiveMan.isSimple());  // 输出: true（五万是中张）
// console.log(eastWind.isHonor());  // 输出: true（东风是字牌）

// // 创建一整副麻将牌
// const fullSet = Tile.createFullSet();
// console.log(fullSet.length);  // 输出: 136（一整副麻将牌的数量）
