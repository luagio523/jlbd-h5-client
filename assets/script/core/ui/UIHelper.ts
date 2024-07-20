import { GButton, GComponent, GObject } from "fairygui-cc"
import { Constructor, Node } from "cc";


export class FGUIHelper {
    /**
     * 根据路径查找子节点
     * @param root 根节点
     * @param path 子节点路径，以 '/' 分隔
     * @returns 找到的子节点或 null
     */
    static findChild(root: GComponent, path: string): GObject | null {
        if (!root || !path) {
            return null;
        }

        const pathParts = path.split('/').filter(part => part !== '');
        let currentNode: GObject | null = root;

        for (const part of pathParts) {
            if (!currentNode) {
                return null;
            }
            if (currentNode instanceof GComponent) {
                currentNode = currentNode.getChild(part);
            } else {
                return null;
            }
        }

        return currentNode;
    }

    /**
     * 递归查找子节点
     * @param root 根节点
     * @param name 子节点名称
     * @returns 找到的子节点或 null
     */
    static seekChild(root: GComponent, name: string): GObject | null {
        if (!root || !name) {
            return null;
        }

        if (root.name === name) {
            return root;
        }

        for (let i = 0; i < root.numChildren; i++) {
            const child = root.getChildAt(i);
            if (child.name === name) {
                return child;
            }
            if (child instanceof GComponent) {
                const result = this.seekChild(child, name);
                if (result) {
                    return result;
                }
            }
        }

        return null;
    }

    /**
     * 根据名称查找子节点
     * @param root 根节点
     * @param name 子节点名称
     * @returns 找到的子节点或 null
     */
    static getUIChild(root: GComponent, name: string): GObject | null {
        return this.seekChild(root, name);
    }

    /**
     * 安全地注册点击事件
     * @param target 目标按钮或按钮名称
     * @param callback 点击事件回调
     * @param thisArg 回调函数的上下文
     */
    static safeClick(target: string | GObject, root: GComponent, callback: Function, thisArg?: any): void {
        let button: GObject | null;

        if (typeof target === 'string') {
            button = this.getUIChild(root, target);
        } else {
            button = target;
        }

        if (button && button instanceof GButton) {
            // 先移除所有已存在的点击事件
            button.clearClick();
            // 注册新的点击事件
            button.onClick(callback, thisArg || this);
        } else {
            console.warn(`Button not found or invalid: ${target}`);
        }
    }
}





export class CreatorHelper {
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
