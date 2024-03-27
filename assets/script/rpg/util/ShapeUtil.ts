import { Intersection2D, Rect, Vec2, v2 } from "cc";

export class ShapeUtil {
    public static getBoundingBoxOfOBB(rect:Rect){
        // 查询旋转矩形OBB范围内的实体
        //构造一个更大的矩形，中心与原矩形相同，边长为对角线长度
        let halfDiagonal = Math.sqrt(rect.width * rect.width + rect.height * rect.height) / 2;
        
        return  new Rect(rect.x + rect.width / 2 - halfDiagonal, rect.y + rect.height / 2 - halfDiagonal, 2 * halfDiagonal, 2 * halfDiagonal);
    }


        // 获取多边形的外接矩形
    public static getBoundingBoxOfPolygon(polygon:Array<Vec2>) {
        //找出多边形中所有点的最小和最大的x和y坐标，用于确定外接矩形的左下角和右上角
        let minX = Math.min(...polygon.map(point => point.x));
        let minY = Math.min(...polygon.map(point => point.y));
        let maxX = Math.max(...polygon.map(point => point.x));
        let maxY = Math.max(...polygon.map(point => point.y));
    
        //创建矩形并返回
        return new Rect(minX, minY, maxX - minX, maxY - minY);
    }

    // 获取射线的外接矩形
    public static  getBoundingBoxOfRay(start:Vec2, end:Vec2) {
        // 确定矩形的四个顶点坐标：
        let minX = Math.min(start.x, end.x);
        let minY = Math.min(start.y, end.y);
        let maxX = Math.max(start.x, end.x);
        let maxY = Math.max(start.y, end.y);
        //创建矩形并返回
        return new Rect(minX, minY, maxX - minX, maxY - minY);
    }

    // 获取射线的外接矩形
    public static  getBoundingBoxOfCircle(center:Vec2, radius:number) {
        //创建矩形并返回
        return  new Rect(center.x - radius, center.y - radius, 2 * radius, 2 * radius);;
    }

    //获取OBB矩形的多边形点组
    public static getPolygonOfOBB(rect:Rect,radian:number):Array<Vec2>{
        let c = v2(rect.x + rect.width >>1,rect.y + rect.height >> 1)
        let points = [
            v2(rect.x,rect.y),
            v2(rect.x + rect.width,rect.y),
            v2(rect.x + rect.width,rect.y + rect.height),
            v2(rect.x,rect.y + rect.height)
        ]

        let cosRadian = Math.cos(radian);
        let sinRadian = Math.sin(radian);

        points.forEach(p => { //旋转
            let newX = (p.x - c.x)*cosRadian - (p.y - c.y)*sinRadian + c.x ;
            let newY = (p.x - c.x)*sinRadian + (p.y - c.y)*cosRadian + c.y ;
            p.x = newX;
            p.y = newY;
        });

        return points
    }


    /**
     * 点是否位于 AABB矩形内
     * @param point 
     * @param rect 
     * @returns 
     */
    public static pointInAABB(point:Vec2, rect:Rect):boolean {
        return point.x >= rect.x &&
               point.x <= rect.x + rect.width &&
               point.y >= rect.y &&
               point.y <= rect.y + rect.height;
    }
    
    /**
     * 点是否位于圈内
     * @param point 
     * @param circleCenter 
     * @param radius 
     * @returns 
     */
    public static pointInCircle(point:Vec2,circleCenter:Vec2,radiusSqr:number){
        return Vec2.squaredDistance(circleCenter, point) < radiusSqr //只需要位于圈内
    }

    /**
     * 点是否位于多边形内
     * @param point 
     * @param polygon 
     * @returns 
     */
    public static pointInPolygon(point:Vec2,polygon:Array<Vec2>){
        return Intersection2D.pointInPolygon(point, polygon)
    }

    /**
     * 点是否在扇形内
     * @param point 
     * @param circleCenter 
     * @param radius 
     * @param angleStart 
     * @param angleEnd 
     * @returns 
     */
    public static pointInSector(point: Vec2,circleCenter: Vec2, radiusSqr: number, angleStart: number, angleEnd: number){
        let dx = point.x - circleCenter.x;
        let dy = point.y - circleCenter.y;
        let distanceSqr = dx * dx + dy * dy;  // 计算实体与中心点的距离
        let angle = Math.atan2(dy, dx);  // 计算实体相对于中心点的角度
        if (distanceSqr <= radiusSqr && angle >= angleStart && angle <= angleEnd) {
            return true;
        }
        return false;
    }

    /**
     * 矩形矩形相交
     * @param r1 
     * @param r2 
     * @returns 
     */
    public static rectRect(r1:Rect,r2:Rect):boolean{
        return Intersection2D.rectRect(r1,r2)
    }
    

    /**
     * 射线是否穿过矩形
     * @param start 
     * @param end 
     * @param rect 
     */
    public static rayRect(start:Vec2, end:Vec2, rect:Rect){
        return Intersection2D.lineRect(start,end,rect)
    }

    
    /**
     * 判断一个点是否靠近线段
     * @param P0 
     * @param P1 
     * @param P2 
     * @param radius 
     * @returns 
     */
    public static pointCloseToLineSegment(P0: Vec2, P1:Vec2, P2:Vec2, radiusSqr:number, lineSegmentLengthSqr:number):boolean{
        let dx = P2.x - P1.x;
        let dy = P2.y - P1.y;
      
        // 投影点在线段P1P2上，t表示比例
        let t = ((P0.x - P1.x) * dx + (P0.y - P1.y) * dy) / lineSegmentLengthSqr;
    
        if (t < 0 || t > 1){
            // 投影点在P1P2线段延长线上，返回false
            return false;
        }
    
        // 投影点在P1P2线段上，判断P0到投影点的距离平方是否小于半径平方
        let px = P1.x + t * dx; 
        let py = P1.y + t * dy;
        let dx0p = P0.x - px;
        let dy0p = P0.y - py;
    
        return dx0p*dx0p + dy0p*dy0p <= radiusSqr;
    }
    
}