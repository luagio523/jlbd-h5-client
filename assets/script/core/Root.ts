import { Component, Node, _decorator, director} from "cc";
import { version } from "./Oops";
const {  property } = _decorator;

export class Root extends Component {
    @property({ type: Node, tooltip: "游戏层" })
    private gameNode: Node = null!;

    @property({ type: Node, tooltip: "界面层" })
    private guiNode: Node = null!;

    protected persistRootNode: Node = null!;
    private static isInitialized: boolean = false;

    async onLoad() {
        if (Root.isInitialized) return;
        Root.isInitialized = true;

        console.log(`Oops Framework v${version}`);
        this.enabled = false;
        await this.preload();
        this.enabled = true;
        this.run();
    }

    protected async preload(): Promise<void> {
        // 在这里添加预加载逻辑
        // 例如：加载配置文件、初始化服务等
    }

    protected run(): void {
        // 在这里添加游戏运行时的初始化逻辑
    }

    public getGameNode(): Node {
        return this.gameNode;
    }

    public getGUINode(): Node {
        return this.guiNode;
    }

    update(dt: number) {
    }

    public getPersistRootNode(): Node {
        if (!this.persistRootNode) {
            this.persistRootNode = new Node('PersistRoot');
            director.addPersistRootNode(this.persistRootNode);
        }
        return this.persistRootNode;
    }
}