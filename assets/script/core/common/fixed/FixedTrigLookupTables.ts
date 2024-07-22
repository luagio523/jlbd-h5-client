import { FixedPoint } from "./FixedPoint";
import { FixedLookupTable } from "./FixedLookupTable";

export class FixedTrigLookupTables {
    private static instance: TrigLookupTables;
    private static readonly TABLE_SIZE = 1024;
    private readonly sinTable: FixedLookupTable;
    private readonly tanTable: FixedLookupTable;
    private readonly asinTable: FixedLookupTable;
    private readonly atanTable: FixedLookupTable;

    private constructor() {
        this.sinTable = new FixedLookupTable(
            TrigLookupTables.TABLE_SIZE,
            FixedPoint.ZERO,
            FixedPoint.TWO_PI,
            (angle) => FixedPoint.fromNumber(Math.sin(angle.toNumber()))
        );

        this.tanTable = new FixedLookupTable(
            TrigLookupTables.TABLE_SIZE,
            FixedPoint.ZERO,
            FixedPoint.TWO_PI,
            (angle) => FixedPoint.fromNumber(Math.tan(angle.toNumber()))
        );

        this.asinTable = new FixedLookupTable(
            TrigLookupTables.TABLE_SIZE,
            FixedPoint.fromNumber(-1),
            FixedPoint.fromNumber(1),
            (value) => FixedPoint.fromNumber(Math.asin(value.toNumber()))
        );

        this.atanTable = new FixedLookupTable(
            TrigLookupTables.TABLE_SIZE,
            FixedPoint.fromNumber(-10),
            FixedPoint.fromNumber(10),
            (value) => FixedPoint.fromNumber(Math.atan(value.toNumber()))
        );
    }

    public static getInstance(): TrigLookupTables {
        if (!TrigLookupTables.instance) {
            TrigLookupTables.instance = new TrigLookupTables();
        }
        return TrigLookupTables.instance;
    }

    public sin(angle: FixedPoint): FixedPoint {
        return this.sinTable.lookupInterpolated(angle);
    }

    public cos(angle: FixedPoint): FixedPoint {
        const halfPi = FixedPoint.div(FixedPoint.PI, FixedPoint.fromNumber(2));
        return this.sin(FixedPoint.add(angle, halfPi));
    }

    public tan(angle: FixedPoint): FixedPoint {
        return this.tanTable.lookupInterpolated(angle);
    }

    public asin(value: FixedPoint): FixedPoint {
        return this.asinTable.lookupInterpolated(value);
    }

    public acos(value: FixedPoint): FixedPoint {
        const halfPi = FixedPoint.div(FixedPoint.PI, FixedPoint.fromNumber(2));
        return FixedPoint.sub(halfPi, this.asin(value));
    }

    public atan(value: FixedPoint): FixedPoint {
        return this.atanTable.lookupInterpolated(value);
    }

    public atan2(y: FixedPoint, x: FixedPoint): FixedPoint {
        if (x.rawValue === 0) {
            return y.rawValue > 0 ? FixedPoint.PI.div(FixedPoint.fromNumber(2))
                : y.rawValue < 0 ? FixedPoint.PI.div(FixedPoint.fromNumber(-2))
                : FixedPoint.ZERO;
        }
    
        const abs_y = y.abs();
        let angle: FixedPoint;
    
        if (x.rawValue >= 0) {
            const r = x.sub(abs_y).div(x.add(abs_y));
            angle = FixedPoint.PI.div(FixedPoint.fromNumber(4)).sub(
                r.mul(FixedPoint.fromNumber(0.98279372324732906))
            );
        } else {
            const r = x.add(abs_y).div(abs_y.sub(x));
            angle = FixedPoint.PI.mul(FixedPoint.fromNumber(3/4)).sub(
                r.mul(FixedPoint.fromNumber(0.98279372324732906))
            );
        }
    
        return y.rawValue < 0 ? angle.negate() : angle;
    }
    
}
