import { Node, Prefab, assetManager, instantiate, resources, sys } from "cc";
import { ILayerManager, UILayer } from "./UILayer";
import { AbstractResManager, IResManager, UIResBase } from "./UIRes";
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
export class CreatorResManager extends AbstractResManager<Node> {
    private static instance: CreatorResManager;

    public static getInstance(): CreatorResManager {
        if (!CreatorResManager.instance) {
            CreatorResManager.instance = new CreatorResManager();
        }
        return CreatorResManager.instance;
    }
    protected createUIRes(config: IUIConfig): UIResBase<Node> {
        return new CreatorUIRes(config);
    }
}



class CreatorUIRes extends UIResBase<Node> {

    public releaseAssets(resourcePath: string) {
        resources.release(resourcePath, Prefab)
    }

    public disposeUI() {
        this.instanceList.forEach((instance: Node) => {
            instance.destroy();
        });
        this.instanceList = [];
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



