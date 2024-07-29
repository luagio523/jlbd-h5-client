import { Node, UITransform, Vec3, Color, resources, Asset, UIOpacity } from 'cc';

export abstract class UIElement {
    protected node: Node;
    protected transform: UITransform;

    protected constructor(name: string, width: number, height: number) {
        this.node = new Node(name);
        this.transform = this.node.addComponent(UITransform);
        this.transform.setContentSize(width, height);
    }

    public abstract setup(...args: any): Promise<void>; // setup UI element 用于加载配置等
    public abstract reset(): void;

    public setPosition(x: number, y: number, z: number = 0): void {
        this.node.setPosition(new Vec3(x, y, z));
    }

    public setSize(width: number, height: number): void {
        this.transform.setContentSize(width, height);
    }

    public getNode(): Node {
        return this.node;
    }

    

    protected async loadResource<T>(path: string, type: typeof Asset): Promise<T> {
        return new Promise((resolve, reject) => {
            resources.load(path, type, (err, resource) => {
                if (err) {
                    console.error(`Failed to load resource: ${path}`, err);
                    reject(err);
                } else {
                    resolve(resource as T);
                }
            });
        });
    }

    public update(dt:number):void{

    }
}
