/**
 * 方向
 */

import { v2 } from "cc"
import { MathUtil } from "../../core/common/utils/MathUtil"


export enum DirectionType {
    North = 0,
    NorthEast = 1,
    East = 2,
    SouthEast = 3,
    South = 4,
    SouthWest = 5,
    West = 6,
    NorthWest = 7 ,
}


export class Direction {
    static DefaultDir = 0
    private static _directions = ["北","东北","东","东南","南","西南","西","西北"]
    private static _sides = ["上","右上","右","右下","下","左下","左","左上"]
    private static _directionRotations = [0,45,90,135,180,-135,-90,-45]
    // private static _directionNexts = [v2(0,1),v2(1,1),v2(1,0),v2(1,-1),v2(0,-1),v2(-1,-1),v2(-1,0),v2(-1,1)]
    private static _dirXTurns = [-1,4,3,2,-1,8,7,6]
    private static _dirYTurns = [1,8,-1,6,5,4,-1,2]

    public static angleDirection:any = {}


    public static initAngelDir(){
        let dir = 0
        let rad = -180
        while(rad <= 180){
            if (rad>= -110 && rad <= -70) {
                dir = DirectionType.South
            }
            else if (rad > -70 && rad < -20) {
                dir = DirectionType.SouthEast
            }
            else if (rad >=-20 && rad <=20) {
                dir = DirectionType.East
            }
            else if (rad > 20 && rad < 70) {
                dir = DirectionType.NorthEast
            }
            else if (rad >=70 && rad <= 110) {
                dir = DirectionType.North
            }
            else if (rad > 110 && rad<160) {
                dir = DirectionType.NorthWest
            }
            else if (rad>160 || rad <= -160) {
                dir = DirectionType.West
            }
            else{
                dir = DirectionType.SouthWest
            }
            this.angleDirection[rad] = dir
            rad = rad + 1
        }
    }

    public static isPositive(direction){
        return direction >3 || direction < 7
    }

    public static getDirectionString(direction){
        this._directions[direction]
    }

    public static getSide(direction){
        return this._sides[direction]
    }

    public static getRotation(direction){
        return this._directionRotations[direction]
    }

    public static getXTurnDir(direction){
        return this._dirXTurns[direction]
    }

    public static getYTurnDir(direction){
        return this._dirYTurns[direction]
    }


    public static turnLeft(direction){
        direction = direction + 1
        if(direction > 8){
            direction = DirectionType.North
        }
        return direction
    }


    public static turnRight(direction){
        direction = direction -1
        if(direction <= 0){
            direction = DirectionType.NorthWest
        }
        return direction
    }



    /**
     * 通过2点，获取8方向值
     */
	public static get8DirBy2Point(p1, p2) {
		//计算方向
        let angle = MathUtil.getAngle(MathUtil.getRadian2(p1.x, p1.y, p2.x, p2.y))

        //Direction.angleDirection[angle]

		return this.angle2dir(angle);
	};
	/** 方向转角度 */
	public static dir2angle(dir) {
		dir *= 45;
		dir -= 90;
		return dir;
	};
	/** 角度转方向 */
	public static angle2dir(angle) {
		if (angle < -90)
			angle += 360;
		return Math.round((angle + 90) / 45) % 8;
	};
	/** 反方向 */
	public static dirOpposit(dir) {
		// 7 == 3
		// 6 == 2
		// 5 == 1
		// 4 == 0
		return dir < 4 ? dir + 4 : dir - 4;
	};
	/** 8方向转5方向资源方向 */
	public static get5DirBy8Dir(dir8) {
		var td = 2 * (dir8 - 4);
		if (td < 0)
			td = 0;
		return dir8 - td;
	};
}

