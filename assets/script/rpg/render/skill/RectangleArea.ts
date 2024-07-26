// RectangleArea.ts
import { Node, Vec2 } from 'cc';
import { SkillAreaBase, SkillAreaParams } from './SkillArea';

export class RectangleArea extends SkillAreaBase {
    private width: number;
    private height: number;

    constructor(node: Node, params: RectangleAreaParams) {
        super(node, params);
        this.width = params.width;
        this.height = params.height;
    }

    drawArea() {
        if (this.useAnimation) {
            this.scaleToFit(this.width, this.height);
        } else if (this.graphics) {
            this.graphics.rect(-this.width / 2, -this.height / 2, this.width, this.height);
            this.graphics.fill();
        }
    }

    updateShapeParameters(params: any) {
        if (params.width !== undefined) {
            this.width = params.width;
        }
        if (params.height !== undefined) {
            this.height = params.height;
        }
        if (!this.useAnimation && this.graphics) {
            this.graphics.clear();
            this.drawArea();
        } else if (this.useAnimation) {
            this.scaleToFit(this.width, this.height);
        }
    }
}

export interface RectangleAreaParams extends SkillAreaParams {
    width: number;
    height: number;
}
