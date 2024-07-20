import { GComponent, GButton, GTextField, UIPackage } from "fairygui-cc";
import { Node, view, tween } from "cc";
import { ILayerManager, UILayer } from "./UILayer";


export type AlertOptions = {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
};

export class AlertManager {
    private static instance: AlertManager;
    private dialogQueue: AlertOptions[] = [];
    private dialogPool: GComponent[] = [];
    private layerManager: ILayerManager;

    private constructor() {}

    public static getInstance(): AlertManager {
        if (!AlertManager.instance) {
            AlertManager.instance = new AlertManager();
        }
        return AlertManager.instance;
    }

    public initialize(layerManager: ILayerManager): void {
        this.layerManager = layerManager;
    }

    public showDialog(options: AlertOptions): void {
        this.dialogQueue.push(options);
        this.processDialogQueue();
    }

    private async processDialogQueue(): Promise<void> {
        if (this.dialogQueue.length === 0) {
            return;
        }

        const options = this.dialogQueue.shift()!;
        this.displayDialog(options);
    }

    private displayDialog(options: AlertOptions): void {
        let dialog: GComponent;
        if (this.dialogPool.length > 0) {
            dialog = this.dialogPool.pop()!;
        } else {
            dialog = UIPackage.createObject("Common", "Dialog") as GComponent;
        }

        const title = dialog.getChild("title") as GTextField;
        const message = dialog.getChild("message") as GTextField;
        const confirmButton = dialog.getChild("confirmButton") as GButton;
        const cancelButton = dialog.getChild("cancelButton") as GButton;

        title.text = options.title;
        message.text = options.message;
        confirmButton.title = options.confirmText || "确定";
        cancelButton.title = options.cancelText || "取消";

        // 保存监听器引用
        const confirmListener = () => {
            if (options.onConfirm) {
                options.onConfirm();
            }
            this.closeDialog(dialog, confirmListener, cancelListener);
        };

        const cancelListener = () => {
            if (options.onCancel) {
                options.onCancel();
            }
            this.closeDialog(dialog, confirmListener, cancelListener);
        };

        confirmButton.offClick(confirmListener);
        cancelButton.offClick(cancelListener);

        confirmButton.onClick(confirmListener);
        cancelButton.onClick(cancelListener);

        // 设置Dialog位置
        const winSize = view.getVisibleSize();
        dialog.setPosition(winSize.width / 2 - dialog.width / 2, winSize.height / 2 - dialog.height / 2);

        // 添加到UI层
        this.layerManager.addToLayer(dialog.node, UILayer.DIALOG);

        // 设置动画
        dialog.alpha = 0;
        tween(dialog)
            .to(0.2, { alpha: 1 })
            .start();
    }

    private closeDialog(dialog: GComponent, confirmListener: Function, cancelListener: Function): void {
        const confirmButton = dialog.getChild("confirmButton") as GButton;
        const cancelButton = dialog.getChild("cancelButton") as GButton;

        confirmButton.offClick(confirmListener);
        cancelButton.offClick(cancelListener);

        tween(dialog)
            .to(0.2, { alpha: 0 })
            .call(() => {
                this.layerManager.removeFromLayer(dialog.node, UILayer.DIALOG);
                this.dialogPool.push(dialog);
            })
            .start();
    }
}
