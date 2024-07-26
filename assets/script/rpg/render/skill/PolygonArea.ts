// PolygonArea.ts
import { SkillAreaBase, SkillAreaParams } from './SkillArea';
import { Node, Vec2 } from 'cc';

export class PolygonArea extends SkillAreaBase {
    private points: Vec2[];

    constructor(node: Node, params: PolygonAreaParams) {
        super(node, params);
        this.points = params.points;
    }

    drawArea() {
        if (this.useAnimation) {
            // 计算多边形的边界框，并缩放动画
            let minX = Number.MAX_VALUE, minY = Number.MAX_VALUE, maxX = Number.MIN_VALUE, maxY = Number.MIN_VALUE;
            this.points.forEach(point => {
                if (point.x < minX) minX = point.x;
                if (point.y < minY) minY = point.y;
                if (point.x > maxX) maxX = point.x;
                if (point.y > maxY) maxY = point.y;
            });
            const width = maxX - minX;
            const height = maxY - minY;
            this.scaleToFit(width, height);
        } else if (this.graphics) {
            this.graphics.moveTo(this.points[0].x, this.points[0].y);
            for (let i = 1; i < this.points.length; i++) {
                this.graphics.lineTo(this.points[i].x, this.points[i].y);
            }
            this.graphics.close();
            this.graphics.fill();
        }
    }

    updateShapeParameters(params: any) {
        if (params.points !== undefined) {
            this.points = params.points;
        }
        if (!this.useAnimation && this.graphics) {
            this.graphics.clear();
            this.drawArea();
        } else if (this.useAnimation) {
            // 计算多边形的边界框，并缩放动画
            let minX = Number.MAX_VALUE, minY = Number.MAX_VALUE, maxX = Number.MIN_VALUE, maxY = Number.MIN_VALUE;
            this.points.forEach(point => {
                if (point.x < minX) minX = point.x;
                if (point.y < minY) minY = point.y;
                if (point.x > maxX) maxX = point.x;
                if (point.y > maxY) maxY = point.y;
            });
            const width = maxX - minX;
            const height = maxY - minY;
            this.scaleToFit(width, height);
        }
    }
}

export interface PolygonAreaParams extends SkillAreaParams {
    points: Vec2[];
}
