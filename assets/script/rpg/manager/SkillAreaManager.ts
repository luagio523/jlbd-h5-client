import { Node } from 'cc';
import { CircleAreaParams, SkillAreaCircle } from '../render/SkillAreaCircle';

export class SkillAreaManager {
    private static instance: SkillAreaManager;

    private constructor() {}

    public static getInstance(): SkillAreaManager {
        if (!SkillAreaManager.instance) {
            SkillAreaManager.instance = new SkillAreaManager();
        }
        return SkillAreaManager.instance;
    }

    createCircleArea(parentNode: Node, params: CircleAreaParams) {
        const circleNode = new Node('CircleArea');
        parentNode.addChild(circleNode);
        circleNode.setPosition(params.position);
        new SkillAreaCircle(circleNode, params);
    }

}
