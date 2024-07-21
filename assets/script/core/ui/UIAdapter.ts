import { GButton, GComponent, GObject } from "fairygui-cc"
import {  Button, Node } from "cc";

export interface IUIAdapter<T = any> {
    injectUI(ui: T): void;
    findChild<U extends T>(path: string): U | null;
    getUIChild<U extends T>(name: string): U | null;
    safeClick(target: string | T, callback: Function, thisArg?: any): void;
}


// FairyGUI 实现
export class FairyUIAdapter implements IUIAdapter {
    private ui: GComponent;

    injectUI(ui: GComponent): void {
        this.ui = ui;
    }

    /**
     * 根据路径查找子节点
     * @param path 子节点路径，以 '/' 分隔
     * @returns 找到的子节点或 null
     */
    public findChild<T extends GObject>(path: string): T | null {
        const root = this.ui;
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

        return currentNode as T;
    }

    /**
     * 根据名称查找子节点
     * @param name 子节点名称
     * @returns 找到的子节点或 null
     */
    public getUIChild<T extends GObject>(name: string): T | null {
        return this.seekChild(this.ui, name) as T;
    }

    /**
     * 安全地注册点击事件
     * @param target 目标按钮或按钮名称
     * @param callback 点击事件回调
     * @param thisArg 回调函数的上下文
     */
    public safeClick(target: string | GObject, callback: Function, thisArg?: any): void {
        let button: GObject | null;

        if (typeof target === 'string') {
            button = this.getUIChild<GObject>(target);
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

    /**
     * 递归查找子节点
     * @param root 根节点
     * @param name 子节点名称
     * @returns 找到的子节点或 null
     */
    private seekChild(root: GComponent, name: string): GObject | null {
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
}



export class CreatorUIAdapter implements IUIAdapter {
    private ui: Node;

    injectUI(ui: Node): void {
        this.ui = ui;
    }

    /**
     * 根据路径查找子节点
     * @param path 子节点路径，以 '/' 分隔
     * @returns 找到的子节点或 null
     */
    public findChild<T extends Node>(path: string): T | null {
        if (!this.ui || !path) {
            return null;
        }
        const node = this.ui.getChildByPath(path);
        return node as T;
    }

    /**
     * 根据名称查找子节点
     * @param name 子节点名称
     * @returns 找到的子节点或 null
     */
    public getUIChild<T extends Node>(name: string): T | null {
        return this.ui.getChildByName(name) as T;
    }

    /**
         * 安全地注册点击事件
         * @param target 目标按钮或按钮名称
         * @param callback 点击事件回调
         * @param thisArg 回调函数的上下文
         */
    public safeClick(target: string | Node, callback: Function, thisArg?: any): void {
        const node = typeof target === 'string' ? this.getUIChild<Node>(target) : target;
        if (node) {
            const button = node.getComponent(Button);
            if (button) {
                // 移除已存在的 TOUCH_END 事件监听器
                button.node.off(Node.EventType.TOUCH_END);
                // 注册新的事件监听器
                button.node.on(Node.EventType.TOUCH_END, callback, thisArg);
            } else {
                // 移除已存在的 TOUCH_END 事件监听器
                node.off(Node.EventType.TOUCH_END);
                // 注册新的事件监听器
                node.on(Node.EventType.TOUCH_END, callback, thisArg);
            }
        } else {
            console.warn(`Node not found or invalid: ${target}`);
        }
    }
}






