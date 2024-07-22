import { FixedPoint } from "./FixedPoint";
import { FixedTrigLookupTables } from "./FixedTrigLookupTables";


export function testFixedPoint() {
// 使用定点数示例
console.log("=== FixedPoint Results ===");

const fp1 = FixedPoint.fromNumber(3.14);
const fp2 = FixedPoint.fromNumber(2.5);
const fp3 = FixedPoint.fromNumber(-1.5);
const fp4 = FixedPoint.fromNumber(0.5);
const fp5 = FixedPoint.fromNumber(4.0);

console.log("FixedPoint Addition:", fp1.add(fp2).toString());
console.log("FixedPoint Subtraction:", fp1.sub(fp2).toString());
console.log("FixedPoint Multiplication:", fp1.mul(fp2).toString());
console.log("FixedPoint Division:", fp1.div(fp2).toString());
console.log("FixedPoint Absolute:", fp3.abs().toString());
console.log("FixedPoint Negate:", fp3.negate().toString());
console.log("FixedPoint Square Root:", fp5.sqrt().toString());

const trigTables = FixedTrigLookupTables.getInstance();

console.log("FixedPoint Sine:", trigTables.sin(fp4).toString());
console.log("FixedPoint Cosine:", trigTables.cos(fp4).toString());
console.log("FixedPoint Tangent:", trigTables.tan(fp4).toString());
console.log("FixedPoint Arc Sine:", trigTables.asin(fp4).toString());
console.log("FixedPoint Arc Cosine:", trigTables.acos(fp4).toString());
console.log("FixedPoint Arc Tangent:", trigTables.atan(fp4).toString());
console.log("FixedPoint Arc Tangent 2:", trigTables.atan2(fp4, fp1).toString());

// 使用浮点数示例
console.log("\n=== Floating-point Results ===");

const n1 = 3.14;
const n2 = 2.5;
const n3 = -1.5;
const n4 = 0.5;
const n5 = 4.0;

console.log("Floating-point Addition:", (n1 + n2).toFixed(4));
console.log("Floating-point Subtraction:", (n1 - n2).toFixed(4));
console.log("Floating-point Multiplication:", (n1 * n2).toFixed(4));
console.log("Floating-point Division:", (n1 / n2).toFixed(4));
console.log("Floating-point Absolute:", Math.abs(n3).toFixed(4));
console.log("Floating-point Negate:", (-n3).toFixed(4));
console.log("Floating-point Square Root:", Math.sqrt(n5).toFixed(4));

console.log("Floating-point Sine:", Math.sin(n4).toFixed(4));
console.log("Floating-point Cosine:", Math.cos(n4).toFixed(4));
console.log("Floating-point Tangent:", Math.tan(n4).toFixed(4));
console.log("Floating-point Arc Sine:", Math.asin(n4).toFixed(4));
console.log("Floating-point Arc Cosine:", Math.acos(n4).toFixed(4));
console.log("Floating-point Arc Tangent:", Math.atan(n4).toFixed(4));
console.log("Floating-point Arc Tangent 2:", Math.atan2(n4, n1).toFixed(4));

}