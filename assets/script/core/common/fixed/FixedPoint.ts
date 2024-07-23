export class FixedPoint {
    private static readonly FRACTION_BITS = 16;
    private static readonly ONE = 1 << FixedPoint.FRACTION_BITS;
    private static readonly HALF = FixedPoint.ONE >> 1;
    private static readonly MASK = FixedPoint.ONE - 1;

    public static readonly NaN = new FixedPoint(Number.MAX_SAFE_INTEGER);

    public static readonly ZERO = new FixedPoint(0);
    public static readonly ONE_FIXED = new FixedPoint(FixedPoint.ONE);
    public static readonly PI = new FixedPoint(Math.PI * FixedPoint.ONE);
    public static readonly TWO_PI = new FixedPoint(2 * Math.PI * FixedPoint.ONE);
    public static readonly HALF_PI = FixedPoint.PI.div(FixedPoint.fromNumber(2));

    public static EPSILON = FixedPoint.fromNumber(0.01);
    public static THREE_HALF_PI = FixedPoint.HALF_PI.mul(FixedPoint.fromNumber(3));


    constructor(public rawValue: number) {
        this.rawValue = rawValue | 0;
    }

    public isNaN(): boolean {
        return this.rawValue === FixedPoint.NaN.rawValue;
    }

    static fromNumber(n: number): FixedPoint {
        return new FixedPoint((n * FixedPoint.ONE) | 0);
    }

    toNumber(): number {
        return this.rawValue / FixedPoint.ONE;
    }

    toString(): string {
        return (this.rawValue / FixedPoint.ONE).toFixed(4);
    }
    isZero(): boolean {
        return this.rawValue === 0;
    }
    


    public mod(other: FixedPoint): FixedPoint {
        if (other.isZero()) {
            throw new Error("Division by zero in mod operation");
        }

        let result = this.rawValue % other.rawValue;

        // 处理负数情况
        if (result < 0) {
            result += Math.abs(other.rawValue);
        }

        return new FixedPoint(result);
    }

    isOne(): boolean {
        return this.rawValue === FixedPoint.ONE;
    }

    isNegative(): boolean {
        return this.rawValue <0;
    }

    clone(): FixedPoint {
        return new FixedPoint(this.rawValue);
    }

    equals(other: FixedPoint): boolean {
        return this.rawValue === other.rawValue;
    }

    lt(other: FixedPoint): boolean {
        return this.rawValue < other.rawValue;
    }

    gt(other: FixedPoint): boolean {
        return this.rawValue > other.rawValue;
    }

    lte(other: FixedPoint): boolean {
        return this.rawValue <= other.rawValue;
    }

    gte(other: FixedPoint): boolean {
        return this.rawValue >= other.rawValue;
    }

    abs(): FixedPoint {
        const mask = this.rawValue >> 31;
        return new FixedPoint(((this.rawValue + mask) ^ mask) | 0);
    }

    negate(): FixedPoint {
        return new FixedPoint((-this.rawValue) | 0);
    }

    add(other: FixedPoint): FixedPoint {
        return new FixedPoint((this.rawValue + other.rawValue) | 0);
    }

    sub(other: FixedPoint): FixedPoint {
        return new FixedPoint((this.rawValue - other.rawValue) | 0);
    }

    mul(other: FixedPoint): FixedPoint {
        let positiveSign: boolean = true;
        let aRawValue: number = this.rawValue;
        let bRawValue: number = other.rawValue;
        if (aRawValue < 0) {
            aRawValue *= -1;
            positiveSign = !positiveSign;
        }
        if (bRawValue < 0) {
            bRawValue *= -1;
            positiveSign = !positiveSign;
        }
        let aHi: number = aRawValue >> FixedPoint.FRACTION_BITS;
        let aLo: number = aRawValue & 0x0000FFFF;
        let bHi: number = bRawValue >> FixedPoint.FRACTION_BITS;
        let bLo: number = bRawValue & 0x0000FFFF;
        let sum: number = ((
            ((Math.imul(aLo, bLo)) >>> FixedPoint.FRACTION_BITS) +
            (Math.imul(aLo, bHi) | 0) +
            (Math.imul(bLo, aHi) | 0) +
            ((Math.imul(aHi, bHi)) << FixedPoint.FRACTION_BITS)
        ) | 0);
        if (!positiveSign) {
            sum *= -1;
        }
        return new FixedPoint(sum);
    }

    div(other: FixedPoint): FixedPoint {
        let positiveSign: boolean = true;
        let aRawValue: number = this.rawValue;
        let bRawValue: number = other.rawValue;
        if (aRawValue < 0) {
            aRawValue *= -1;
            positiveSign = !positiveSign;
        }
        if (bRawValue < 0) {
            bRawValue *= -1;
            positiveSign = !positiveSign;
        }
        let remainder: number = aRawValue >>> 0;
        let divisor: number = bRawValue >>> 0;
        let leftShift: number = FixedPoint.FRACTION_BITS;
        let quotient: number = 0 >>> 0;
        while (remainder > 0 && leftShift >= 0) {
            let remainderShift: number = Math.clz32(remainder);
            remainderShift = Math.min(remainderShift, leftShift);
            remainder <<= remainderShift;
            leftShift -= remainderShift;

            let res: number = ((remainder >>> 0) / (divisor >>> 0)) >>> 0;
            remainder = ((remainder >>> 0) % (divisor >>> 0)) >>> 0;
            quotient += res << leftShift;

            remainder <<= 1;
            leftShift--;
        }
        quotient = quotient | 0;
        if (!positiveSign) {
            quotient *= -1;
        }
        return new FixedPoint(quotient | 0);
    }

    sqrt(): FixedPoint {
        let n: number = this.rawValue | 0;
        let x: number = n | 0;
        let c: number = 0 | 0;
        let d: number = 1 << 30;
        while ((d | 0) > (n | 0)) {
            d >>= 2;
        }
        while ((d | 0) != 0) {
            if ((x | 0) >= (((c | 0) + (d | 0)) | 0)) {
                x = (x - (((c | 0) + (d | 0)) | 0)) | 0;
                c = ((c >> 1) + (d | 0)) | 0;
            } else {
                c >>= 1;
            }
            d >>= 2;
        }
        return new FixedPoint(c << (FixedPoint.FRACTION_BITS >> 1));
    }

    floor(): FixedPoint {
        return new FixedPoint(this.rawValue & ~FixedPoint.MASK);
    }

    ceil(): FixedPoint {
        return new FixedPoint((this.rawValue + FixedPoint.MASK) & ~FixedPoint.MASK);
    }

    round(): FixedPoint {
        return new FixedPoint((this.rawValue + FixedPoint.HALF) & ~FixedPoint.MASK);
    }

    // Static methods for convenience
    static add(a: FixedPoint, b: FixedPoint): FixedPoint {
        return a.add(b);
    }

    static sub(a: FixedPoint, b: FixedPoint): FixedPoint {
        return a.sub(b);
    }

    static mul(a: FixedPoint, b: FixedPoint): FixedPoint {
        return a.mul(b);
    }

    static div(a: FixedPoint, b: FixedPoint): FixedPoint {
        return a.div(b);
    }

    static sqrt(a: FixedPoint): FixedPoint {
        return a.sqrt();
    }

    static floor(a: FixedPoint): FixedPoint {
        return a.floor();
    }

    static ceil(a: FixedPoint): FixedPoint {
        return a.ceil();
    }

    static round(a: FixedPoint): FixedPoint {
        return a.round();
    }

     // 最小值和最大值
     static min(a: FixedPoint, b: FixedPoint): FixedPoint {
        return a.lt(b) ? a : b;
    }

    static max(a: FixedPoint, b: FixedPoint): FixedPoint {
        return a.gt(b) ? a : b;
    }

     // 限制值在指定范围内
    static clamp(value: FixedPoint, min: FixedPoint, max: FixedPoint): FixedPoint {
        return FixedPoint.min(FixedPoint.max(value, min), max);
    }

    // 从字符串创建 FixedPoint
    static fromString(s: string): FixedPoint {
        return FixedPoint.fromNumber(parseFloat(s));
    }
}
