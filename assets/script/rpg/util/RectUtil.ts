import { Rect, Vec2 } from "cc";

export class RectUtil {
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
}