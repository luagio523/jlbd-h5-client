import { LookupTable } from "./LookupTable";

export class TrigLookupTables {
    private static instance: TrigLookupTables;

    public static readonly TABLE_SIZE = 1024;
    public static readonly PI = Math.PI;
    public static readonly TWO_PI = 2 * Math.PI;

    public readonly sin: Readonly<LookupTable<number>>;
    public readonly cos: Readonly<LookupTable<number>>;
    public readonly tan: Readonly<LookupTable<number>>;
    public readonly asin: Readonly<LookupTable<number>>;
    public readonly acos: Readonly<LookupTable<number>>;
    public readonly atan: Readonly<LookupTable<number>>;

    private constructor() {
        this.sin = Object.freeze(new LookupTable(TrigLookupTables.TABLE_SIZE, 0, TrigLookupTables.TWO_PI, Math.sin));
        this.cos = Object.freeze(new LookupTable(TrigLookupTables.TABLE_SIZE, 0, TrigLookupTables.TWO_PI, Math.cos));
        this.tan = Object.freeze(new LookupTable(TrigLookupTables.TABLE_SIZE, 0, TrigLookupTables.TWO_PI, Math.tan));
        this.asin = Object.freeze(new LookupTable(TrigLookupTables.TABLE_SIZE, -1, 1, Math.asin));
        this.acos = Object.freeze(new LookupTable(TrigLookupTables.TABLE_SIZE, -1, 1, Math.acos));
        this.atan = Object.freeze(new LookupTable(TrigLookupTables.TABLE_SIZE, -10, 10, Math.atan));
    }

    public static getInstance(): TrigLookupTables {
        if (!TrigLookupTables.instance) {
            TrigLookupTables.instance = new TrigLookupTables();
        }
        return TrigLookupTables.instance;
    }

    public fastAtan2(y: number, x: number): number {
        if (x === 0) {
            return y > 0 ? TrigLookupTables.PI / 2 : -TrigLookupTables.PI / 2;
        }
        const abs_y = Math.abs(y);
        let angle: number;
        if (x >= 0) {
            const r = (x - abs_y) / (x + abs_y);
            angle = this.atan.lookupInterpolated(r);
        } else {
            const r = (x + abs_y) / (abs_y - x);
            angle = this.atan.lookupInterpolated(r);
            angle = TrigLookupTables.PI - angle;
        }
        return y < 0 ? -angle : angle;
    }
}
