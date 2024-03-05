import { MathUtil } from "./MathUtil";

/**
 * 方向工具类
 */
export class DirUtil {
	/**
     * 通过2点，获取8方向值
     */
	public static get8DirBy2Point(p1, p2) {
		//计算方向
		var angle = MathUtil.getAngle(MathUtil.getRadian2(p1.x, p1.y, p2.x, p2.y));
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
	// /** 获取方向格子坐标后几格的坐标 */
	// public static getGridByDir(dir, pos: number = 1, p: any = null) {
	// 	var angle = this.dir2angle(this.dirOpposit(dir));
	// 	var tp = p || cc.v2();
	// 	MathUtil.getDirMove(angle, pos * GameMap.CELL_SIZE, tp);
	// 	return tp;
	// };

	
}