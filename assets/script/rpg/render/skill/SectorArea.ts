// SectorArea.ts
import { SkillAreaBase, SkillAreaParams } from './SkillArea';
import { Node, Vec2, misc } from 'cc';

export class SectorArea extends SkillAreaBase {
    private radius: number;
    private angle: number;

    constructor(node: Node, params: SectorAreaParams) {
        super(node, params);
        this.radius = params.radius;
        this.angle = params.angle;
    }

    drawArea() {
        if (this.useAnimation) {
            this.scaleToFit(this.radius * 2, this.radius * 2);
        } else if (this.graphics) {
            this.graphics.moveTo(0, 0);
            for (let i = 0; i <= this.angle; i++) {
                let rad = misc.degreesToRadians(i);
                let x = Math.cos(rad) * this.radius;
                let y = Math.sin(rad) * this.radius;
                this.graphics.lineTo(x, y);
            }
            this.graphics.close();
            this.graphics.fill();
        }
    }

    updateShapeParameters(params: any) {
        if (params.radius !== undefined) {
            this.radius = params.radius;
        }
        if (params.angle !== undefined) {
            this.angle = params.angle;
        }
        if (!this.useAnimation && this.graphics) {
            this.graphics.clear();
            this.drawArea();
        } else if (this.useAnimation) {
            this.scaleToFit(this.radius * 2, this.radius * 2);
        }
    }
}

export interface SectorAreaParams extends SkillAreaParams {
    radius: number;
    angle: number;
}
