export class FixedPoint {
    private  static readonly FRACTION_BITS = 16;
    private  static readonly ONE = 1 << FixedPoint.FRACTION_BITS;
    private  static readonly HALF = FixedPoint.ONE >> 1;
    private  static readonly MASK = FixedPoint.ONE - 1;

    public  static readonly ZERO = new FixedPoint(0);
    public  static readonly ONE_FIXED = new FixedPoint(FixedPoint.ONE);
    public  static readonly PI = new FixedPoint(Math.PI * FixedPoint.ONE);
    public  static readonly TWO_PI = new FixedPoint(2 * Math.PI * FixedPoint.ONE);

    constructor(public rawValue: number) {
        this.rawValue = rawValue | 0;
    }

    public static fromNumber(n: number): FixedPoint {
        return new FixedPoint((n * FixedPoint.ONE) | 0);
    }

    toNumber(): number {
        return this.rawValue / FixedPoint.ONE;
    }

    toString(): string {
        return (this.rawValue / FixedPoint.ONE).toFixed(4);
    }

    clone(): FixedPoint {
        return new FixedPoint(this.rawValue);
    }

    equals(other: FixedPoint): boolean {
        return this.rawValue === other.rawValue;
    }

    lessThan(other: FixedPoint): boolean {
        return this.rawValue < other.rawValue;
    }

    greaterThan(other: FixedPoint): boolean {
        return this.rawValue > other.rawValue;
    }

    lessThanOrEqual(other: FixedPoint): boolean {
        return this.rawValue <= other.rawValue;
    }

    greaterThanOrEqual(other: FixedPoint): boolean {
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
        const result = Math.imul(this.rawValue, other.rawValue);
        return new FixedPoint((result + FixedPoint.HALF) >> FixedPoint.FRACTION_BITS);
    }

    div(other: FixedPoint): FixedPoint {
        const result = (Math.abs(this.rawValue) << (FixedPoint.FRACTION_BITS + 1)) / Math.abs(other.rawValue);
        const sign = ((this.rawValue ^ other.rawValue) >= 0) ? 1 : -1;
        return new FixedPoint((result * sign) | 0);
    }

    sqrt(): FixedPoint {
        if (this.rawValue <= 0) {
            return FixedPoint.ZERO;
        }

        let x = this.rawValue;
        let y = (x + 1) >> 1;
        while (y < x) {
            x = y;
            y = (x + (this.rawValue / x)) >> 1;
        }

        return new FixedPoint(x << (FixedPoint.FRACTION_BITS >> 1));
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
    public static add(a: FixedPoint, b: FixedPoint): FixedPoint {
        return a.add(b);
    }

    public static sub(a: FixedPoint, b: FixedPoint): FixedPoint {
        return a.sub(b);
    }

    public static mul(a: FixedPoint, b: FixedPoint): FixedPoint {
        return a.mul(b);
    }

    public static div(a: FixedPoint, b: FixedPoint): FixedPoint {
        return a.div(b);
    }

    public static sqrt(a: FixedPoint): FixedPoint {
        return a.sqrt();
    }

    public static floor(a: FixedPoint): FixedPoint {
        return a.floor();
    }

    public static ceil(a: FixedPoint): FixedPoint {
        return a.ceil();
    }

    public static round(a: FixedPoint): FixedPoint {
        return a.round();
    }
}
