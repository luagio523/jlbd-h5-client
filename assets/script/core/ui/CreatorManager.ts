import { Node, Prefab, assetManager, instantiate, resources, sys } from "cc";
import { ILayerManager, UILayer } from "./UILayer";
import { IResManager, UIResBase } from "./UIRes";
import { IUIConfig } from "./UIConfig";
import scheduler from "../../utils/scheduler";

export class CreatorManager implements ILayerManager {
    private _root: Node;
    private _layers: Map<UILayer, Node>;

    public initLayers(root: Node): void {
        this._root = root;
        this._layers = new Map<UILayer, Node>();

        // 初始化各层的节点
        this.initLayerNode(UILayer.BACKGROUND, 'BackgroundLayer');
        this.initLayerNode(UILayer.MAIN, 'MainLayer');
        this.initLayerNode(UILayer.DIALOG, 'DialogLayer');
        this.initLayerNode(UILayer.TOP, 'TopLayer');
    }

    private initLayerNode(layer: UILayer, name: string): void {
        const node = new Node(name);
        this._layers.set(layer, node);
        this._root.addChild(node);
    }

    public addToLayer(uiInstance: Node, layer: UILayer): void {
        const layerNode = this.getLayerNode(layer);
        if (layerNode) {
            layerNode.addChild(uiInstance);
        } else {
            console.error(`Layer - ${UILayer[layer]} not initialized.`);
        }
    }

    public removeFromLayer(uiInstance: Node, layer: UILayer): void {
        const layerNode = this.getLayerNode(layer);
        if (layerNode) {
            layerNode.removeChild(uiInstance);
        } else {
            console.error(`Layer - ${UILayer[layer]} not initialized.`);
        }
    }

    public hideUILayer(layer: UILayer): void {
        const layerNode = this.getLayerNode(layer);
        if (layerNode) {
            layerNode.active = false;
        } else {
            console.error(`Layer - ${UILayer[layer]} not initialized.`);
        }
    }

    public showUILayer(layer: UILayer): void {
        const layerNode = this.getLayerNode(layer);
        if (layerNode) {
            layerNode.active = true;
        } else {
            console.error(`Layer - ${UILayer[layer]} not initialized.`);
        }
    }

    public getLayerNode(layer: UILayer): Node | null {
        return this._layers.get(layer) || null;
    }

    public isUIInLayer(uiInstance: Node, layer: UILayer): boolean {
        const layerNode = this.getLayerNode(layer);
        if (layerNode) {
            return layerNode.children.includes(uiInstance);
        } else {
            console.warn(`Layer ${UILayer[layer]} is managed by creator or not initialized.`);
            return false;
        }
    }
}

/**
 * 
 */
export class CreatorResMgr  implements IResManager<Node> {

    private resMap: Map<string, CreatorUIRes> = new Map<string, CreatorUIRes>();

    public constructor(){
        scheduler.scheduleGlobal(this.cleanup.bind(this), 10)// 例如每30秒清理一次
    }

    // 清理函数，会根据设置的时间阈值来释放实例和资源
    private cleanup() {
        const now = sys.now();
        for (const [uiId, uiRes] of this.resMap.entries()) {
            if (uiRes.checkIdle(now)) {
                this.resMap.delete(uiId);
            }
        }
    }

    async load(config: IUIConfig): Promise<Node> {
        if (!config.uiId || !config.resourcePath || !config.uiComponentName) {
            throw new Error("Invalid UI config provided.");
        }
        if (!this.resMap.has(config.uiId)) {
            this.resMap.set(config.uiId, new CreatorUIRes(config));
        }
        let res = this.resMap.get(config.uiId);
        if (res) {
            const component = await res.get();
            if (component) {
                return component;
            }
        }
    }
   
    getUIRes(uiId:string ):CreatorUIRes{
        return  this.resMap[uiId]
    }

    release(uiId:string,uiInstance:Node):void{
        this.getUIRes(uiId)?.put(uiInstance)
    }
}


class CreatorUIRes extends UIResBase<Node> {
    protected cleanUI() {
        this.instanceList.forEach((instance: Node) => {
            instance.destroy();
        });
        this.instanceList = [];
    }

    protected release(config: IUIConfig) {
        this.instanceList.forEach((instance: Node) => {
            instance.destroy();
        });
        this.instanceList = [];
        resources.release(config.resourcePath, Prefab)
    }

    protected async createInstance(config: IUIConfig): Promise<Node> {
        const loadedPrefab = await this.load(config.resourcePath);
        const prefabInstance = instantiate(loadedPrefab);
        if (prefabInstance instanceof Node) {
            return prefabInstance;
        } else {
            throw new Error("UI component created is not a Node");
        }
    }

    async load(resourcePath: string): Promise<Prefab> {
        return new Promise((resolve, reject) => {
            resources.load(resourcePath, Prefab, (error, loadedPrefab: Prefab) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(loadedPrefab);
                }
            });
        });
    } 
}



