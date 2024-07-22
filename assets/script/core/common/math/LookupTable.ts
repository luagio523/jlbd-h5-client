/**
 * 提供一个抽象的查表类，可以根据输入值查表得到输出值。
 */
export class LookupTable<T> {
    private table: T[];
    private readonly size: number;
    private readonly minInput: number;
    private readonly maxInput: number;
    private readonly inputRange: number;

    constructor(
        size: number,
        minInput: number,
        maxInput: number,
        mappingFunction: (input: number) => T
    ) {
        this.size = size;
        this.minInput = minInput;
        this.maxInput = maxInput;
        this.inputRange = maxInput - minInput;
        this.table = new Array(size);

        for (let i = 0; i < size; i++) {
            const input = this.minInput + (i / (size - 1)) * this.inputRange;
            this.table[i] = mappingFunction(input);
        }
    }

    public lookup(input: number): T {
        if (input <= this.minInput) return this.table[0];
        if (input >= this.maxInput) return this.table[this.size - 1];

        const normalizedInput = (input - this.minInput) / this.inputRange;
        const index = Math.min(Math.floor(normalizedInput * this.size), this.size - 1);
        return this.table[index];
    }

    public lookupInterpolated(input: number): T {
        if (input <= this.minInput) return this.table[0];
        if (input >= this.maxInput) return this.table[this.size - 1];

        const normalizedInput = (input - this.minInput) / this.inputRange;
        const indexFloat = normalizedInput * (this.size - 1);
        const index1 = Math.floor(indexFloat);
        const index2 = Math.min(index1 + 1, this.size - 1);
        const fraction = indexFloat - index1;

        const value1 = this.table[index1];
        const value2 = this.table[index2];

        // 如果 T 是数字类型，我们可以进行插值
        if (typeof value1 === 'number' && typeof value2 === 'number') {
            return (value1 * (1 - fraction) + value2 * fraction) as T;
        }

        // 如果不是数字类型，我们就返回最近的值
        return fraction < 0.5 ? value1 : value2;
    }

    public getSize(): number {
        return this.size;
    }

    public getMinInput(): number {
        return this.minInput;
    }

    public getMaxInput(): number {
        return this.maxInput;
    }
}



// // 创建一个角度压缩查找表
// const angleCompressLUT = new LookupTable<number>(
//     256,  // 表的大小
//     0,    // 最小输入值（弧度）
//     2 * Math.PI,  // 最大输入值（弧度）
//     (angle) => Math.round((angle * 180 / Math.PI) * 254 / 360)  // 映射函数
// );

// // 在 Joystick 类中使用
// export class Joystick extends FairyUIAdapter {
//     // ... 其他代码 ...

//     private static readonly angleCompressLUT = new LookupTable<number>(
//         256,
//         0,
//         2 * Math.PI,
//         (angle) => Math.round((angle * 180 / Math.PI) * 254 / 360)
//     );

//     private getCompressedAngle(): number {
//         if (this.direction.x === 0 && this.direction.y === 0) {
//             return 255; // 特殊值表示中心位置
//         }
//         const angle = Math.atan2(this.direction.y, this.direction.x);
//         const normalizedAngle = angle < 0 ? angle + 2 * Math.PI : angle;
//         return Joystick.angleCompressLUT.lookup(normalizedAngle);
//     }

//     // ... 其他代码 ...
// }
