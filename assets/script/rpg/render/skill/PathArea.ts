// PathArea.ts
import { SkillAreaBase, SkillAreaParams } from './SkillArea';
import { Node, Vec2 } from 'cc';

export class PathArea extends SkillAreaBase {
    private path: Vec2[];

    constructor(node: Node, params: PathAreaParams) {
        super(node, params);
        this.path = params.path;
    }

    drawArea() {
        if (this.useAnimation) {
            // 计算路径的边界框，并缩放动画
            let minX = Number.MAX_VALUE, minY = Number.MAX_VALUE, maxX = Number.MIN_VALUE, maxY = Number.MIN_VALUE;
            this.path.forEach(point => {
                if (point.x < minX) minX = point.x;
                if (point.y < minY) minY = point.y;
                if (point.x > maxX) maxX = point.x;
                if (point.y > maxY) maxY = point.y;
            });
            const width = maxX - minX;
            const height = maxY - minY;
            this.scaleToFit(width, height);
        } else if (this.graphics) {
            this.graphics.moveTo(this.path[0].x, this.path[0].y);
            for (let i = 1; i < this.path.length; i++) {
                this.graphics.lineTo(this.path[i].x, this.path[i].y);
            }
            this.graphics.stroke();
        }
    }

    updateShapeParameters(params: any) {
        if (params.path !== undefined) {
            this.path = params.path;
        }
        if (!this.useAnimation && this.graphics) {
            this.graphics.clear();
            this.drawArea();
        } else if (this.useAnimation) {
            // 计算路径的边界框，并缩放动画
            let minX = Number.MAX_VALUE, minY = Number.MAX_VALUE, maxX = Number.MIN_VALUE, maxY = Number.MIN_VALUE;
            this.path.forEach(point => {
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

export interface PathAreaParams extends SkillAreaParams {
    path: Vec2[];
}
