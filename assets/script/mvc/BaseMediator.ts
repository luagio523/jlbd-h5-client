import { GComponent, GObject } from "fairygui-cc"
import { Mediator } from "../core/mvc/init"
import {   FairyUIAdapter, IUIAdapter } from "../core/ui/UIAdapter";




export default abstract class BaseMediator extends Mediator {
    protected viewAdapter: IUIAdapter;

    public  initialize(instance: GComponent): void {
        if (!this.viewAdapter) {
            this.viewAdapter = new FairyUIAdapter()
        }
        this.viewAdapter.setView(instance)
        this.onInitialize();
    }

    protected abstract onInitialize():  void;
    protected abstract onOpen(params: any): void;
    protected abstract onClose(): void;
    protected abstract onDestroy(): void;
}


