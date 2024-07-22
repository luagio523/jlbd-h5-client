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
   
    private static readonly ATAN2_TABLE_SIZE = 1024;
    private readonly atan2TableSmall: FixedLookupTable;
    private readonly atan2TableLarge: FixedLookupTable;

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
        
        this.atanTable = new FixedLookupTable(
            FixedTrigLookupTables.TABLE_SIZE,
            FixedPoint.HALF_PI.negate(),
            FixedPoint.HALF_PI,
            (value) => FixedPoint.fromNumber(Math.atan(value.toNumber()))
        );
        
        this.asinTable = new FixedLookupTable(
            FixedTrigLookupTables.TABLE_SIZE,
            FixedPoint.fromNumber(-1),
            FixedPoint.ONE_FIXED,
            (value) => FixedPoint.fromNumber(Math.asin(value.toNumber()))
        );

        this.atan2TableSmall = new FixedLookupTable(
            FixedTrigLookupTables.ATAN2_TABLE_SIZE,
            FixedPoint.ZERO,
            FixedPoint.ONE_FIXED,
            (value) => FixedPoint.fromNumber(Math.atan(value.toNumber()))
        );

        this.atan2TableLarge = new FixedLookupTable(
            FixedTrigLookupTables.ATAN2_TABLE_SIZE,
            FixedPoint.ONE_FIXED,
            FixedPoint.fromNumber(1e6),  // 使用一个很大的数作为上限
            (value) => FixedPoint.fromNumber(Math.PI / 2 - Math.atan(1 / value.toNumber()))
        );
        
    }

    public static getInstance(): FixedTrigLookupTables {
        if (!FixedTrigLookupTables.instance) {
            FixedTrigLookupTables.instance = new FixedTrigLookupTables();
        }
        return FixedTrigLookupTables.instance;
    }



    public sin(angle: FixedPoint): FixedPoint {
        // 归一化角度到 [0, 2π) 范围
        const normalizedAngle = angle.mod(FixedPoint.TWO_PI);
        return this.sinTable.lookupInterpolated(normalizedAngle);
    }
   

    public cos(angle: FixedPoint): FixedPoint {
        // 归一化角度到 [0, 2π) 范围
        const normalizedAngle = angle.mod(FixedPoint.TWO_PI);
        return this.sin(normalizedAngle.add(FixedPoint.HALF_PI));
    }

    public asin(value: FixedPoint): FixedPoint {
        // 检查输入范围
        if (value.lt(FixedPoint.fromNumber(-1)) || value.gt(FixedPoint.ONE_FIXED)) {
            throw new Error("asin input must be in range [-1, 1]");
        }
        return this.asinTable.lookupInterpolated(value);
    }

    public acos(value: FixedPoint): FixedPoint {
        // 检查输入范围
        if (value.lt(FixedPoint.fromNumber(-1)) || value.gt(FixedPoint.ONE_FIXED)) {
            throw new Error("acos input must be in range [-1, 1]");
        }
        const halfPi = FixedPoint.HALF_PI;
        return halfPi.sub(this.asin(value));
    }


    public tan(angle: FixedPoint): FixedPoint {
        const normalizedAngle = angle.mod(FixedPoint.TWO_PI);
        
        const halfPiDiff = normalizedAngle.sub(FixedPoint.HALF_PI).abs();
        const threeHalfPiDiff = normalizedAngle.sub(FixedPoint.THREE_HALF_PI).abs();
        
        if (halfPiDiff.lt(FixedPoint.EPSILON) || threeHalfPiDiff.lt(FixedPoint.EPSILON)) {
            return FixedPoint.NaN;  // 或者根据您的需求返回一个非常大的数
        }
        return this.tanTable.lookupInterpolated(normalizedAngle);
    }

    public atan(value: FixedPoint): FixedPoint {
        // 处理超出范围的情况
        if (value.gte(FixedPoint.fromNumber(10))) {
            return FixedPoint.HALF_PI;
        } else if (value.lte(FixedPoint.fromNumber(-10))) {
            return FixedPoint.HALF_PI.negate();
        }
        
        return this.atanTable.lookupInterpolated(value);
    }
  


    public atan2(y: FixedPoint, x: FixedPoint): FixedPoint {
        if (x.isZero() && y.isZero()) {
            return FixedPoint.ZERO;
        }
    
        const absX = x.abs();
        const absY = y.abs();
    
        let angle: FixedPoint;
        if (absX.gte(absY)) {
            const r = absY.div(absX);
            if (r.lte(FixedPoint.ONE_FIXED)) {
                angle = this.atan2TableSmall.lookupInterpolated(r);
            } else {
                angle = this.atan2TableLarge.lookupInterpolated(r);
            }
        } else {
            const r = absX.div(absY);
            if (r.lte(FixedPoint.ONE_FIXED)) {
                angle = FixedPoint.HALF_PI.sub(this.atan2TableSmall.lookupInterpolated(r));
            } else {
                angle = FixedPoint.HALF_PI.sub(this.atan2TableLarge.lookupInterpolated(r));
            }
        }
    
        if (x.isNegative()) {
            angle = FixedPoint.PI.sub(angle);
        }
        if (y.isNegative()) {
            angle = angle.negate();
        }
    
        return angle;
    }
}



// public sin(angle: FixedPoint): FixedPoint {
//     return this.sinTable.lookupInterpolated(angle);
// }

// public cos(angle: FixedPoint): FixedPoint {
//     const halfPi = FixedPoint.PI.div(FixedPoint.fromNumber(2));
//     return this.sin(angle.add(halfPi));
// }


// public asin(value: FixedPoint): FixedPoint {
//     return this.asinTable.lookupInterpolated(value);
// }

// public acos(value: FixedPoint): FixedPoint {
//     const halfPi = FixedPoint.PI.div(FixedPoint.fromNumber(2));
//     return halfPi.sub(this.asin(value));
// }

    // public tan(angle: FixedPoint): FixedPoint {
    //     return this.tanTable.lookupInterpolated(angle);
    // }

    // public atan(value: FixedPoint): FixedPoint {
    //     return this.atanTable.lookupInterpolated(value);
    // }


    // public atan2(y: FixedPoint, x: FixedPoint): FixedPoint {
    //     if (x.isZero() && y.isZero()) {
    //         return FixedPoint.ZERO;
    //     }

    //     const absX = x.abs();
    //     const absY = y.abs();

    //     let angle: FixedPoint;
    //     if (absX.gte(absY)) {
    //         const r = absY.div(absX);
    //         angle = this.atan2TableSmall.lookupInterpolated(r);
    //     } else {
    //         const r = absX.div(absY);
    //         angle = FixedPoint.PI_OVER_TWO.sub(this.atan2TableSmall.lookupInterpolated(r));
    //     }

    //     if (x.isNegative()) {
    //         angle = FixedTrigLookupTables.PI.sub(angle);
    //     }
    //     if (y.isNegative()) {
    //         angle = angle.negate();
    //     }

    //     return angle;
    // }