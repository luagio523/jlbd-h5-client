import { GComponent, GObject } from "fairygui-cc"
import { Node } from "cc";

export class Finder {
    static findChild(root: GComponent|Node, path: string): GObject | Node | null {
        if (!root) return null;

        if (root instanceof GComponent) {
            return GObjectFinder.findChild(root, path);
        } else if (root instanceof Node) {
            return NodeFinder.findChild(root, path);
        }

        return null;
    }

    static getUIChild(root: GComponent|Node, name: string): GObject | Node | null {
        if (!root) return null;

        if (root instanceof GComponent) {
            return GObjectFinder.getUIChild(root, name);
        } else if (root instanceof Node) {
            return NodeFinder.getUIChild(root, name);
        }

        return null;
    }
}



class GObjectFinder {
    static findChild(root: GComponent, path: string): GObject | null {
        if (!root || !path) {
            return null;
        }

        const pathParts = path.split('/').filter(part => part !== '');
        let currentNode: GComponent | null = root;

        for (const part of pathParts) {
            if (!currentNode) {
                return null;
            }
            currentNode = currentNode.getChild(part);
        }

        return currentNode;
    }

    static seekChild(root: GComponent, name: string): GObject | null {
        if (!root || !name) {
            return null;
        }

        if (root.name === name) {
            return root;
        }

        for (let i = 0; i < root.numChildren; i++) {
            const child = root.getChildAt(i);
            const result = this.seekChild(child as GComponent, name);
            if (result) {
                return result;
            }
        }

        return null;
    }

    static getUIChild(root: GComponent, name: string): GObject | null {
        return this.seekChild(root, name);
    }
}




class NodeFinder {
    static findChild(root: Node, path: string): Node | null {
        if (!root || !path) {
            return null;
        }

        const pathParts = path.split('/').filter(part => part !== '');
        let currentNode: Node | null = root;

        for (const part of pathParts) {
            if (!currentNode) {
                return null;
            }
            currentNode = currentNode.getChildByName(part);
        }

        return currentNode;
    }

    static seekChild(root: Node, name: string): Node | null {
        if (!root || !name) {
            return null;
        }

        if (root.name === name) {
            return root;
        }

        for (const child of root.children) {
            const result = this.seekChild(child, name);
            if (result) {
                return result;
            }
        }

        return null;
    }

    static getUIChild(root: Node, name: string): Node | null {
        return this.seekChild(root, name);
    }
}
