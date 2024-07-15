import { Vec2, view, Screen, sys, Size } from "cc";
import { MathUtil } from "./MathUtil";

/**
 * 兼容 Cocos Creator 3.6 的显示适配工具类
 */
export default class Display {
    private static _instance: Display;
    private _designSize: Size;
    private _frameSize: Size;
    private _adaptRect: { width: number; height: number; x: number; y: number };
    private _adaptCenter: Vec2;
    private _maxDistance: number;

    private constructor() {
        this._designSize = view.getDesignResolutionSize();
        this._frameSize = Screen.windowSize;
        this._adaptRect = { width: this._designSize.width, height: this._designSize.height, x: 0, y: 0 };
        this._adaptCenter = new Vec2(this._adaptRect.width / 2, this._adaptRect.height / 2);
        this._maxDistance = MathUtil.getDistance(0, 0, this._adaptRect.width, this._adaptRect.height);
    }

    public static getInstance(): Display {
        if (!Display._instance) {
            Display._instance = new Display();
        }
        return Display._instance;
    }

    public get width(): number {
        return this._designSize.width;
    }

    public get height(): number {
        return this._designSize.height;
    }

    public get center(): Vec2 {
        return new Vec2(this.width / 2, this.height / 2);
    }

    public get viewWidth(): number {
        return this._frameSize.width;
    }

    public get viewHeight(): number {
        return this._frameSize.height;
    }

    public resetAdapt(adaptRect: { width: number; height: number; x: number; y: number }): void {
        this._adaptRect = adaptRect;
        this._adaptCenter = new Vec2(adaptRect.width / 2, adaptRect.height / 2);
        this._maxDistance = MathUtil.getDistance(0, 0, adaptRect.width, adaptRect.height);
    }

    public get baseX(): number {
        return this._adaptRect.x;
    }

    public get baseY(): number {
        return this._adaptRect.y;
    }

    public get maxX(): number {
        return this._adaptRect.width + this._adaptRect.x;
    }

    public get maxY(): number {
        return this._adaptRect.height + this._adaptRect.y;
    }

    public get adaptWidth(): number {
        return this._adaptRect.width;
    }

    public get adaptHeight(): number {
        return this._adaptRect.height;
    }

    public get adaptCenter(): Vec2 {
        return this._adaptCenter;
    }

    public get scaleX(): number {
        return this.adaptWidth / this.width;
    }

    public get scaleY(): number {
        return this.adaptHeight / this.height;
    }

    public get skewX(): number {
        return this._adaptRect.x;
    }

    public get skewY(): number {
        return this._adaptRect.y;
    }

    public get maxDistance(): number {
        return this._maxDistance;
    }

    private _adaptOffset: number = 20;
    public get adaptOffset(): number {
        return this._adaptOffset;
    }
    public set adaptOffset(val: number) {
        this._adaptOffset = Math.max(val, 20);
    }

    // 新增方法：获取安全区域
    public getSafeArea(): { top: number; bottom: number; left: number; right: number } {
        if (sys.platform === sys.Platform.MOBILE_BROWSER || sys.platform === sys.Platform.ANDROID || sys.platform === sys.Platform.IOS) {
            const safeArea = sys.getSafeAreaRect();
            return {
                top: safeArea.y,
                bottom: this.viewHeight - (safeArea.y + safeArea.height),
                left: safeArea.x,
                right: this.viewWidth - (safeArea.x + safeArea.width)
            };
        }
        return { top: 0, bottom: 0, left: 0, right: 0 };
    }
}