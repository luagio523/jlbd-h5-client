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
        let node = new Node(name);
        this._layers.set(layer, node);
        this._root.addChild(node);
    }

    public addToLayer(uiInstance: Node, layer: UILayer): void {
        let layerNode = this._layers.get(layer);
        if (layerNode) {
            layerNode.addChild(uiInstance);
        } else {
            console.error("Layer not initialized for  Creator.");
        }
    }

    public removeFromLayer(uiInstance: Node, layer: UILayer): void {
        let layerNode = this._layers.get(layer);
        if (layerNode) {
            layerNode.removeChild(uiInstance);
        } else {
            console.error(`Layer - ${UILayer[layer]} not initialized.`);
        }
    }

    public hideUILayer(layer: UILayer): void {
        let layerNode = this._layers.get(layer);
        if (layerNode) {
            layerNode.active = false;
        } else {
            console.error(`Layer - ${UILayer[layer]} not initialized.`);
        }
    }

    public showUILayer(layer: UILayer): void {
        let layerNode = this._layers.get(layer);
        if (layerNode) {
            layerNode.active = true;
        } else {
            console.error(`Layer - ${UILayer[layer]} not initialized.`);
        }
    }
}


/**
 * 
 */
export class CreatorResMgr  implements IResManager<Node> {
    private resMap:{ [uiId: string]: CreatorUIRes }

    public constructor(){
        this.resMap = {}
        scheduler.scheduleGlobal(this.cleanup.bind(this), 10)// 例如每30秒清理一次
    }

    // 清理函数，会根据设置的时间阈值来释放实例和资源
    private cleanup() {
        const now = sys.now();
        for (let uiId in this.resMap) {
            let res = this.resMap[uiId]
            if(res.clean(now)){
                delete this.resMap[uiId]
            }
        }
    }

    async load(config: IUIConfig): Promise<Node> {
        try {
            // 检查缓存中是否存在资源
            let res = this.resMap[config.uiId];
            if (res) {
                const component = res.get();
                if (component) {
                    return component;
                }
            }

            // 如果缓存中不存在资源，则加载并生成一个新的UIRes
            if (!res) {
                res = new CreatorUIRes(config);
                this.resMap[config.uiId] = res;
            }

            const loadedPrefab = await this.loadPrefab(config.resourcePath);
            const prefabInstance = instantiate(loadedPrefab);

            if (prefabInstance instanceof Node) {
                return prefabInstance;
            } else {
                throw new Error("UI component created is not a Node");
            }

        } catch (error) {
            throw error;
        }
    }

    loadPrefab(resourcePath: string): Promise<Prefab> {
        return new Promise((resolve, reject) => {
            assetManager.loadBundle('bundleName', (err, bundle) => {
                if (err) {
                    reject(err);
                    return;
                }
                bundle.load(resourcePath, Prefab, (error, loadedPrefab: Prefab) => {
                    if (error) {
                        reject(error);
                    } else {
                       
                        resolve(loadedPrefab);
                    }
                });
            });
        });
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

    protected cleanAssets(resourcePath: string) {
        resources.release(resourcePath, Prefab)
    }
}



