import { GComponent, GTextField, UIPackage } from "fairygui-cc";
import {  tween, view } from "cc";
import { ILayerManager, UILayer } from "./UILayer";


export class ToastManager {
    private static instance: ToastManager;
    private toastQueue: { message: string; duration: number }[] = [];
    private isShowingToast: boolean = false;
    private toastPool: GComponent[] = [];
    private layerManager: ILayerManager;

    private constructor() {}

    public static getInstance(): ToastManager {
        if (!ToastManager.instance) {
            ToastManager.instance = new ToastManager();
        }
        return ToastManager.instance;
    }

    public initialize(layerManager: ILayerManager): void {
        this.layerManager = layerManager;
    }

    public showToast(message: string, duration: number = 2000): void {
        this.toastQueue.push({ message, duration });
        if (!this.isShowingToast) {
            this.processToastQueue();
        }
    }

    private async processToastQueue(): Promise<void> {
        if (this.toastQueue.length === 0) {
            this.isShowingToast = false;
            return;
        }

        this.isShowingToast = true;
        const { message, duration } = this.toastQueue.shift()!;
        await this.displayToast(message, duration);
        this.processToastQueue();
    }

    private displayToast(message: string, duration: number): Promise<void> {
        return new Promise<void>((resolve) => {
            let toast: GComponent;
            if (this.toastPool.length > 0) {
                toast = this.toastPool.pop()!;
            } else {
                toast = UIPackage.createObject("Common", "Toast") as GComponent;
            }

            const text = toast.getChild("text") as GTextField;
            text.text = message;

            // 设置Toast位置
            const winSize = view.getVisibleSize();
            toast.setPosition(winSize.width / 2 - toast.width / 2, winSize.height * 0.8 - toast.height / 2);

            // 添加到UI层
            this.layerManager.addToLayer(toast.node, UILayer.TOAST);

            // 设置动画
            toast.alpha = 0;
            tween(toast)
                .to(0.2, { alpha: 1 })
                .delay(duration / 1000 - 0.4)
                .to(0.2, { alpha: 0 })
                .call(() => {
                    this.layerManager.removeFromLayer(toast.node, UILayer.TOAST);
                    this.toastPool.push(toast);
                    resolve();
                })
                .start();
        });
    }
}
