import { Node, Vec2 } from 'cc';
import { SkillAreaBase, SkillAreaParams } from './SkillArea';

export class CircleArea extends SkillAreaBase {
    private radius: number;

    constructor(node: Node, params: CircleAreaParams) {
        super(node, params);
        this.radius = params.radius;
    }

    drawArea() {
        if (this.useAnimation) {
            this.scaleToFit(this.radius * 2, this.radius * 2);
        } else if (this.graphics) {
            this.graphics.circle(0, 0, this.radius);
            this.graphics.fill();
        }
    }

    updateShapeParameters(params: any) {
        if (params.radius !== undefined) {
            this.radius = params.radius;
            if (this.useAnimation) {
                this.scaleToFit(this.radius * 2, this.radius * 2);
            } else {
                this.graphics!.clear();
                this.drawArea();
            }
        }
    }
}

export interface CircleAreaParams extends SkillAreaParams {
    radius: number;
}