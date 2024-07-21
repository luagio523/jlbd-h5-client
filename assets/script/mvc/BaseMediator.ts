import { GComponent, GObject } from "fairygui-cc"
import { Mediator } from "../core/mvc/init"
import {  FGUIHelper } from "../core/ui/UIHelper";




export default abstract class BaseMediator extends Mediator {
    protected viewComponent: GComponent;

    public async initialize(instance: GComponent): Promise<void> {
        this.viewComponent = instance;
        await this.onInitialize();
    }
    

    protected abstract onInitialize():  void;
    protected abstract onOpen(params: any): void;
    protected abstract onClose(): void;
    protected abstract onDestroy(): void;

    
    /**
     * 根据路径获取一个子节点
     * @param path 节点路径
     * @returns 
     */
    protected findChild(path: string): GObject | null {
        return FGUIHelper.findChild(this.viewComponent, path);
    }

    /**
     * 根据名字获取子节点
     * @param name 节点名称
     * @returns 
     */
    protected getUIChild(name: string): GObject | null {
        return FGUIHelper.getUIChild(this.viewComponent, name);
    }

    /**
     * 安全注册点击事件(防止重复注册)
     * @param target 可传入节点名或节点对象
     * @param callback 
     * @param thisArg 
     * @returns 
     */
    protected safeClick(target: string | GObject, callback: Function, thisArg?: any): void {
        return FGUIHelper.safeClick(target, this.viewComponent, callback, thisArg);
    }
}


