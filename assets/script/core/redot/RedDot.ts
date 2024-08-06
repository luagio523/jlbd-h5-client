type RedDotCallback = (value: number) => void;

interface RedDotNode {
    key: string;
    value: number;
    children: Map<string, RedDotNode>;
    parent: RedDotNode | null;
    isDirty: boolean;
}

class RedDotTree {
    private root: RedDotNode;
    private dirtyNodes: Set<RedDotNode>;
    private listeners: Map<string, Set<RedDotCallback>>;
    private cache: Map<string, number>;
    private updateQueue: Set<string>;
    private isUpdating: boolean;

    constructor() {
        this.root = this.createNode('root');
        this.dirtyNodes = new Set();
        this.listeners = new Map();
        this.cache = new Map();
        this.updateQueue = new Set();
        this.isUpdating = false;
    }

    private createNode(key: string, parent: RedDotNode | null = null): RedDotNode {
        return {
            key,
            value: 0,
            children: new Map(),
            parent,
            isDirty: false
        };
    }

    updateNode(path: string, value: number): void {
        const parts = path.split('.');
        let node = this.root;

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (!node.children.has(part)) {
                node.children.set(part, this.createNode(part, node));
            }
            node = node.children.get(part)!;
        }

        if (node.value !== value) {
            node.value = value;
            this.markDirty(node);
            this.updateQueue.add(path);
            this.scheduleUpdate();
        }
    }

    private markDirty(node: RedDotNode): void {
        if (!node.isDirty) {
            node.isDirty = true;
            this.dirtyNodes.add(node);
            if (node.parent) {
                this.markDirty(node.parent);
            }
        }
    }

    private scheduleUpdate(): void {
        if (!this.isUpdating) {
            this.isUpdating = true;
            queueMicrotask(() => {
                this.processUpdates();
                this.isUpdating = false;
            });
        }
    }

    private processUpdates(): void {
        for (const path of this.updateQueue) {
            const node = this.getNode(path);
            if (node) {
                this.updateNodeValue(node);
                this.notifyListeners(node);
            }
        }
        this.updateQueue.clear();
        this.cache.clear();
    }

    private updateNodeValue(node: RedDotNode): void {
        let sum = node.value;
        for (const child of node.children.values()) {
            sum += child.value;
        }
        node.value = sum;
        node.isDirty = false;
    }

    getValue(path: string): number {
        if (this.cache.has(path)) {
            return this.cache.get(path)!;
        }
        const node = this.getNode(path);
        const value = node ? node.value : 0;
        this.cache.set(path, value);
        return value;
    }

    private getNode(path: string): RedDotNode | null {
        const parts = path.split('.');
        let node = this.root;

        for (const part of parts) {
            if (!node.children.has(part)) {
                return null;
            }
            node = node.children.get(part)!;
        }

        return node;
    }

    subscribe(path: string, callback: RedDotCallback): () => void {
        if (!this.listeners.has(path)) {
            this.listeners.set(path, new Set());
        }
        this.listeners.get(path)!.add(callback);

        return () => {
            this.listeners.get(path)?.delete(callback);
        };
    }

    private notifyListeners(node: RedDotNode): void {
        const path = this.getNodePath(node);
        const listeners = this.listeners.get(path);
        if (listeners) {
            for (const callback of listeners) {
                callback(node.value);
            }
        }
    }

    private getNodePath(node: RedDotNode): string {
        const path: string[] = [];
        let current: RedDotNode | null = node;
        while (current && current !== this.root) {
            path.unshift(current.key);
            current = current.parent;
        }
        return path.join('.');
    }

    clearNode(path: string): void {
        const node = this.getNode(path);
        if (node) {
            node.value = 0;
            node.isDirty = true;
            this.markDirty(node);
            this.updateQueue.add(path);
            this.scheduleUpdate();
        }
    }

    getAllValues(): Record<string, number> {
        const values: Record<string, number> = {};
        const traverse = (node: RedDotNode, path: string) => {
            values[path] = node.value;
            for (const [key, child] of node.children) {
                traverse(child, path ? `${path}.${key}` : key);
            }
        };
        traverse(this.root, '');
        return values;
    }

    reset(): void {
        this.root = this.createNode('root');
        this.dirtyNodes.clear();
        this.listeners.clear();
        this.cache.clear();
        this.updateQueue.clear();
        this.isUpdating = false;
    }

    getState(): string {
        return JSON.stringify(this.getAllValues());
    }

    loadState(state: string): void {
        const values = JSON.parse(state) as Record<string, number>;
        for (const path in values) {
            this.updateNode(path, values[path]);
        }
    }
}

