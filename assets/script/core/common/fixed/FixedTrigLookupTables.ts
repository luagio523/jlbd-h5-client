import { FixedPoint } from "./FixedPoint";
import { FixedLookupTable } from "./FixedLookupTable";

export class FixedTrigLookupTables {
    private static instance: FixedTrigLookupTables;
    public static readonly PI = new FixedPoint(Math.PI);

    private static readonly TABLE_SIZE = 1024;
    private readonly sinTable: FixedLookupTable;
    private readonly tanTable: FixedLookupTable;
    private readonly asinTable: FixedLookupTable;
    private readonly atanTable: FixedLookupTable;
    private readonly atan2Table: FixedLookupTable;
    private readonly atan2QuadrantTable: FixedLookupTable;

    private constructor() {
        this.sinTable = new FixedLookupTable(
            FixedTrigLookupTables.TABLE_SIZE,
            FixedPoint.ZERO,
            FixedPoint.TWO_PI,
            (angle) => FixedPoint.fromNumber(Math.sin(angle.toNumber()))
        );

        this.tanTable = new FixedLookupTable(
            FixedTrigLookupTables.TABLE_SIZE,
            FixedPoint.ZERO,
            FixedPoint.TWO_PI,
            (angle) => FixedPoint.fromNumber(Math.tan(angle.toNumber()))
        );

        this.asinTable = new FixedLookupTable(
            FixedTrigLookupTables.TABLE_SIZE,
            FixedPoint.fromNumber(-1),
            FixedPoint.fromNumber(1),
            (value) => FixedPoint.fromNumber(Math.asin(value.toNumber()))
        );

        this.atanTable = new FixedLookupTable(
            FixedTrigLookupTables.TABLE_SIZE,
            FixedPoint.fromNumber(-10),
            FixedPoint.fromNumber(10),
            (value) => FixedPoint.fromNumber(Math.atan(value.toNumber()))
        );


        
        this.atan2Table = new FixedLookupTable(
            FixedTrigLookupTables.TABLE_SIZE,
            FixedPoint.ZERO,
            FixedPoint.fromNumber(1),
            (value) => FixedPoint.fromNumber(Math.atan(value.toNumber()))
        );

        this.atan2QuadrantTable = new FixedLookupTable(
            4,
            FixedPoint.ZERO,
            FixedPoint.fromNumber(3),
            (value) => FixedPoint.fromNumber(value.toNumber() * Math.PI / 2)
        );
        
    }

    public static getInstance(): FixedTrigLookupTables {
        if (!FixedTrigLookupTables.instance) {
            FixedTrigLookupTables.instance = new FixedTrigLookupTables();
        }
        return FixedTrigLookupTables.instance;
    }

    public sin(angle: FixedPoint): FixedPoint {
        return this.sinTable.lookupInterpolated(angle);
    }

    public cos(angle: FixedPoint): FixedPoint {
        const halfPi = FixedPoint.PI.div(FixedPoint.fromNumber(2));
        return this.sin(angle.add(halfPi));
    }

    public tan(angle: FixedPoint): FixedPoint {
        return this.tanTable.lookupInterpolated(angle);
    }

    // public sin(angle: FixedPoint): FixedPoint {
    //     // 确保角度在 [0, 2π) 范围内
    //     const normalizedAngle = angle.sub(FixedPoint.TWO_PI.mul(FixedPoint.floor(angle.div(FixedPoint.TWO_PI))));
    //     return this.sinTable.lookupInterpolated(normalizedAngle);
    // }

    // public cos(angle: FixedPoint): FixedPoint {
    //     const halfPi = FixedPoint.PI.div(FixedPoint.fromNumber(2));
    //     return this.sin(angle.add(halfPi));
    // }

    // public tan(angle: FixedPoint): FixedPoint {
    //     // 确保角度在 [0, 2π) 范围内
    //     const normalizedAngle = angle.sub(FixedPoint.TWO_PI.mul(FixedPoint.floor(angle.div(FixedPoint.TWO_PI))));
    //     return this.tanTable.lookupInterpolated(normalizedAngle);
    // }

   

    public asin(value: FixedPoint): FixedPoint {
        return this.asinTable.lookupInterpolated(value);
    }

    public acos(value: FixedPoint): FixedPoint {
        const halfPi = FixedPoint.PI.div(FixedPoint.fromNumber(2));
        return halfPi.sub(this.asin(value));
    }

    public atan(value: FixedPoint): FixedPoint {
        return this.atanTable.lookupInterpolated(value);
    }

    // public atan2(y: FixedPoint, x: FixedPoint): FixedPoint {
    //     if (x.rawValue === 0) {
    //         return y.rawValue > 0 ? FixedPoint.PI.div(FixedPoint.fromNumber(2))
    //             : y.rawValue < 0 ? FixedPoint.PI.div(FixedPoint.fromNumber(-2))
    //             : FixedPoint.ZERO;
    //     }

    //     const abs_y = y.abs();
    //     let angle: FixedPoint;

    //     if (x.rawValue >= 0) {
    //         const r = x.sub(abs_y).div(x.add(abs_y));
    //         // angle = FixedPoint.PI.div(FixedPoint.fromNumber(4)).sub(
    //         //     r.mul(FixedPoint.fromNumber(0.98279372324732906))
    //         // );
    //         angle = this.atan(r);
    //     } else {
    //         const r = x.add(abs_y).div(abs_y.sub(x));
    //         // angle = FixedPoint.PI.mul(FixedPoint.fromNumber(3/4)).sub(
    //         //     r.mul(FixedPoint.fromNumber(0.98279372324732906))
    //         // );
    //         angle = this.atan(r);
    //         angle = FixedTrigLookupTables.PI.sub(angle);
    //     }

    //     return y.rawValue < 0 ? angle.negate() : angle;
    // }


    public atan2(y: FixedPoint, x: FixedPoint): FixedPoint {
        if(x.equals(FixedPoint.ZERO) && y.equals(FixedPoint.ZERO)) {
            return FixedPoint.ZERO; // 未定义，但通常返回0
        }
    
        const absX = x.abs();
        const absY = y.abs();
    
        let r: FixedPoint;
        let quadrant: number;
    
        if (absX.gte(absY)) {
            r = absY.div(absX);
            quadrant = x.isNegative() ? 2 : 0;
        } else {
            r = absX.div(absY);
            quadrant = 1;
        }
    
        if (y.isNegative()) {
            quadrant = 3 - quadrant;
        }
    
        let angle = this.atan2Table.lookupInterpolated(r);
    
        if (quadrant & 1) {
            angle = FixedTrigLookupTables.PI.div(FixedPoint.fromNumber(2)).sub(angle);
        }
    
        const quadrantAngle = this.atan2QuadrantTable.lookup(FixedPoint.fromNumber(quadrant));
        angle = angle.add(quadrantAngle);
    
        if (angle.gt(FixedTrigLookupTables.PI)) {
            angle = angle.sub(FixedPoint.TWO_PI);
        }
    
        return angle;
    }
    
}
