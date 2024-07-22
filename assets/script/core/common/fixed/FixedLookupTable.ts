import { FixedPoint } from "./FixedPoint";

export class FixedLookupTable {
    private table: FixedPoint[];
    private readonly size: number;
    private readonly minInput: FixedPoint;
    private readonly maxInput: FixedPoint;
    private readonly inputRange: FixedPoint;

    constructor(
        size: number,
        minInput: FixedPoint,
        maxInput: FixedPoint,
        mappingFunction: (input: FixedPoint) => FixedPoint
    ) {
        this.size = size;
        this.minInput = minInput;
        this.maxInput = maxInput;
        this.inputRange = maxInput.sub(minInput);
        this.table = new Array(size);

        for (let i = 0; i < size; i++) {
            const t = FixedPoint.fromNumber(i / (size - 1));
            const input = minInput.add(t.mul(this.inputRange));
            this.table[i] = mappingFunction(input);
        }
    }

    public lookup(input: FixedPoint): FixedPoint {
        if (input.lessThanOrEqual(this.minInput)) return this.table[0];
        if (input.greaterThanOrEqual(this.maxInput)) return this.table[this.size - 1];

        const normalizedInput = input.sub(this.minInput).div(this.inputRange);
        const index = Math.min(Math.floor(normalizedInput.toNumber() * this.size), this.size - 1);
        return this.table[index];
    }

    public lookupInterpolated(input: FixedPoint): FixedPoint {
        if (input.lessThanOrEqual(this.minInput)) return this.table[0];
        if (input.greaterThanOrEqual(this.maxInput)) return this.table[this.size - 1];

        const normalizedInput = input.sub(this.minInput).div(this.inputRange);
        const indexFloat = normalizedInput.toNumber() * (this.size - 1);
        const index1 = Math.floor(indexFloat);
        const index2 = Math.min(index1 + 1, this.size - 1);
        const fraction = FixedPoint.fromNumber(indexFloat - index1);

        const value1 = this.table[index1];
        const value2 = this.table[index2];

        // 插值
        return value1.mul(FixedPoint.ONE_FIXED.sub(fraction)).add(value2.mul(fraction));
    }
}

