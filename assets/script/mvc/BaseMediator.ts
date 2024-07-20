import { GComponent, GObject } from "fairygui-cc"
import { Mediator } from "../core/mvc/init"
import { Node } from "cc";
import { Finder } from "../core/ui/Finder";




export default abstract class BaseMediator extends Mediator {
    protected viewComponent: GComponent|Node;
    protected param: any;
    public readonly instanceId: string;

    

    public async initialize(instance: GComponent|Node): Promise<void> {
        this.viewComponent = instance;
        await this.onInitialize();
    }

    public async open(param: any): Promise<void> {
        this.param = param;
        await this.onOpen();
    }

    public async close(): Promise<void> {
        await this.onClose();
    }
    

    protected abstract onInitialize(): Promise<void> | void;
    protected abstract onOpen(): Promise<void> | void;
    protected abstract onClose(): Promise<void> | void;
    protected abstract onDestroy(): void;

    

    protected findChild(path: string): GObject | Node | null {
        return Finder.findChild(this.viewComponent, path);
    }

    protected getUIChild(name: string): GObject | Node | null {
        return Finder.getUIChild(this.viewComponent, name);
    }
}


