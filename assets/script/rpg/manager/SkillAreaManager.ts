import { Node, Vec3 } from 'cc';
import { SkillAreaBase, SkillAreaParams } from '../render/skill/SkillArea';
import { SkillAreaFactory, SkillAreaType } from '../render/skill/SkillAreaTypes';

export class SkillAreaManager {
    private static instance: SkillAreaManager;
    private activeAreas: Map<string, SkillAreaBase> = new Map();

    private constructor() {}

    public static getInstance(): SkillAreaManager {
        if (!SkillAreaManager.instance) {
            SkillAreaManager.instance = new SkillAreaManager();
        }
        return SkillAreaManager.instance;
    }

    createArea(parentNode: Node, type: SkillAreaType, params: SkillAreaParams): string {
        const id = this.generateUniqueId();
        const areaNode = new Node(`SkillArea_${id}`);
        parentNode.addChild(areaNode);
        areaNode.setPosition(params.position);

        const area = SkillAreaFactory.createArea(type, areaNode, params);
        this.activeAreas.set(id, area);
        return id;
    }

    removeArea(id: string): boolean {
        const area = this.activeAreas.get(id);
        if (area) {
            area.removeArea();
            this.activeAreas.delete(id);
            return true;
        }
        return false;
    }

    removeAllAreas(): void {
        this.activeAreas.forEach(area => area.removeArea());
        this.activeAreas.clear();
    }

    updateAreaPosition(id: string, position: Vec3): boolean {
        const area = this.activeAreas.get(id);
        if (area) {
            area.updatePosition(position);
            return true;
        }
        return false;
    }

    updateAreaParameters(id: string, params: Partial<SkillAreaParams>): boolean {
        const area = this.activeAreas.get(id);
        if (area) {
            area.updateShapeParameters(params);
            return true;
        }
        return false;
    }

    getArea(id: string): SkillAreaBase | undefined {
        return this.activeAreas.get(id);
    }

    getAllAreas(): SkillAreaBase[] {
        return Array.from(this.activeAreas.values());
    }

    private generateUniqueId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}
