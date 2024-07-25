import { Component, Node } from "cc";

export class ComponentUtil {

    public static getComponentFromChild<T extends Component>(node:Node,childName: string, componentType: new () => T): T {
        const childNode = node.getChildByName(childName);
        if (!childNode) {
            throw new Error(`Child node ${childName} not found.`);
        }
        const component = childNode.getComponent(componentType);
        component.node = childNode;
        if (!component) {
            throw new Error(`Component ${componentType.name} not found on ${childName}.`);
        }
        return component;
    }


}