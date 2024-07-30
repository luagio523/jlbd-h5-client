import { Vec2 } from "cc";
import { MathUtil } from "../../core/common/utils/MathUtil";

export enum DirectionType {
    North = 0,
    NorthEast = 1,
    East = 2,
    SouthEast = 3,
    South = 4,
    SouthWest = 5,
    West = 6,
    NorthWest = 7,
}

export class Direction {
    private static readonly _directions = ["北", "东北", "东", "东南", "南", "西南", "西", "西北"];
    private static readonly _sides = ["上", "右上", "右", "右下", "下", "左下", "左", "左上"];
    private static readonly _directionRotations = [0, 45, 90, 135, 180, -135, -90, -45];
    private static readonly _dirXTurns = [-1, 4, 3, 2, -1, 8, 7, 6];
    private static readonly _dirYTurns = [1, 8, -1, 6, 5, 4, -1, 2];
    private static readonly _angleDirections: Record<number, DirectionType> = {};

    public static initAngelDir(): void {
        for (let angle = -180; angle <= 180; angle++) {
            this._angleDirections[angle] = this.angle2dir(angle);
        }
    }

    public static directionToVec2(direction: DirectionType): Vec2 {
        switch (direction) {
            case DirectionType.North:
                return new Vec2(0, 1);
            case DirectionType.NorthEast:
                return new Vec2(1, 1);
            case DirectionType.East:
                return new Vec2(1, 0);
            case DirectionType.SouthEast:
                return new Vec2(1, -1);
            case DirectionType.South:
                return new Vec2(0, -1);
            case DirectionType.SouthWest:
                return new Vec2(-1, -1);
            case DirectionType.West:
                return new Vec2(-1, 0);
            case DirectionType.NorthWest:
                return new Vec2(-1, 1);
            default:
                return new Vec2(0, 0); // 默认返回值
        }
    }

    public static isPositive(direction: DirectionType): boolean {
        return direction > DirectionType.South || direction < DirectionType.West;
    }

    public static getDirectionString(direction: DirectionType): string {
        return this._directions[direction];
    }

    public static getSide(direction: DirectionType): string {
        return this._sides[direction];
    }

    public static getRotation(direction: DirectionType): number {
        return this._directionRotations[direction];
    }

    public static getXTurnDir(direction: DirectionType): number {
        return this._dirXTurns[direction];
    }

    public static getYTurnDir(direction: DirectionType): number {
        return this._dirYTurns[direction];
    }

    public static turnLeft(direction: DirectionType): DirectionType {
        return (direction + 1) % 8;
    }

    public static turnRight(direction: DirectionType): DirectionType {
        return (direction + 7) % 8;
    }

    public static get8DirBy2Point(p1: { x: number; y: number }, p2: { x: number; y: number }): DirectionType {
        const angle = MathUtil.getAngle(Math.atan2(p2.y - p1.y, p2.x - p1.x));
        return this.angle2dir(angle);
    }

    public static dir2angle(dir: DirectionType): number {
        return dir * 45 - 90;
    }

    public static angle2dir(angle: number): DirectionType {
        if (angle < -90) {
            angle += 360;
        }
        return Math.round((angle + 90) / 45) % 8 as DirectionType;
    }

    public static dirOpposit(dir: DirectionType): DirectionType {
        return (dir + 4) % 8;
    }

    public static get5DirBy8Dir(dir8: DirectionType): DirectionType {
        return (dir8 - 2 * Math.floor((dir8 - 4) / 2)) as DirectionType;
    }

    // 压缩角度到 0-254 范围
    public static compressAngle(angle: number): number {
        if (angle < -90) {
            angle += 360;
        }
        return Math.round((angle + 90) * 254 / 360);
    }

    // 从压缩角度还原到正常角度
    public static decompressAngle(compressedAngle: number): number | null {
        if (compressedAngle === 255) {
            return null; // 或者返回 0，表示中心位置
        }
        return Math.round((compressedAngle / 254) * 360) - 90;
    }

    public static decompressAngleToVec2(compressedAngle: number): Vec2 | null {
        if (compressedAngle === 255) {
            return new Vec2(0, 0); // 返回中心位置
        }

        const angle = (compressedAngle / 254) * 360;
        const radians = angle * (Math.PI / 180);

        const x = Math.cos(radians);
        const y = Math.sin(radians);

        return new Vec2(x, y).normalize();
    }
}
