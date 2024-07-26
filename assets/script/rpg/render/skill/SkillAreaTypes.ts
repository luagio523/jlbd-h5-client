// SkillAreaTypes.ts
import { Color, Vec3, Vec2, Node } from 'cc';
import { SkillAreaBase, SkillAreaParams } from './SkillArea';
import { CircleArea, CircleAreaParams } from './CircleArea';
import { RectangleArea, RectangleAreaParams } from './RectangleArea';
import { SectorArea, SectorAreaParams } from './SectorArea';
import { PolygonArea, PolygonAreaParams } from './PolygonArea';
import { PathArea, PathAreaParams } from './PathArea';

export enum SkillAreaType {
    Circle,
    Rectangle,
    Sector,
    Polygon,
    Path
}


export class SkillAreaFactory {
    static createArea(type: SkillAreaType, node: Node, params: SkillAreaParams): SkillAreaBase {
        switch (type) {
            case SkillAreaType.Circle:
                return new CircleArea(node, params as CircleAreaParams);
            case SkillAreaType.Rectangle:
                return new RectangleArea(node, params as RectangleAreaParams);
            case SkillAreaType.Sector:
                return new SectorArea(node, params as SectorAreaParams);
            case SkillAreaType.Polygon:
                return new PolygonArea(node, params as PolygonAreaParams);
            case SkillAreaType.Path:
                return new PathArea(node, params as PathAreaParams);
            default:
                throw new Error('Unknown SkillArea type');
        }
    }
}



