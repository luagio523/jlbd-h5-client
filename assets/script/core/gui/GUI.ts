import { Camera, Component, ResolutionPolicy, UITransform, _decorator, math, screen, view } from "cc";
import { oops } from "../Oops";

const { ccclass, property } = _decorator;

/** 游戏界面屏幕自适应管理 */
@ccclass('GUI')
export class GUI extends Component {
    /** 界面层矩形信息组件 */
    transform!: UITransform;
    /** 游戏二维摄像机 */
    camera!: Camera;
    /** 是否为竖屏显示 */
    portrait!: boolean;

    /** 竖屏设计尺寸 */
    private portraitDrz: math.Size = null!;
    /** 横屏设计尺寸 */
    private landscapeDrz: math.Size = null!;

    @property({ tooltip: '是否保留黑边,如果为false,将会裁切画面以适配屏幕' })
    keepAspectRatio: boolean = true;

    onLoad() {
        // this.init(); 使用另外的方式
    }

    /** 初始化引擎 */
    protected init() {
        this.transform = this.getComponent(UITransform)!;
        this.camera = this.getComponentInChildren(Camera)!;

        if (view.getDesignResolutionSize().width > view.getDesignResolutionSize().height) {
            this.landscapeDrz = view.getDesignResolutionSize();
            this.portraitDrz = new math.Size(this.landscapeDrz.height, this.landscapeDrz.width);
        }
        else {
            this.portraitDrz = view.getDesignResolutionSize();
            this.landscapeDrz = new math.Size(this.portraitDrz.height, this.portraitDrz.width);
        }

        this.resize();
    }

    /** 游戏画布尺寸变化 */
    resize() {
        let dr;

        
        if (view.getDesignResolutionSize().width > view.getDesignResolutionSize().height) {
            dr = this.landscapeDrz;
        }
        else {
            dr = this.portraitDrz;
        }

        const s = screen.windowSize;
        const rw = s.width;
        const rh = s.height;
        let finalW = rw;
        let finalH = rh;

        if (this.keepAspectRatio) {
            if ((rw / rh) > (dr.width / dr.height)) {
                // 如果更长，则用定高
                finalH = dr.height;
                finalW = finalH * rw / rh;
                this.portrait = false;
            }
            else {
                // 如果更短，则用定宽
                finalW = dr.width;
                finalH = finalW * rh / rw;
                this.portrait = true;
            }
        } else {
            // 如果不保留黑边，直接使用窗口大小
            finalW = rw;
            finalH = rh;
        }

        // 手工修改 canvas 和设计分辨率，这样反复调用也能生效
        if (this.keepAspectRatio) {
            view.setDesignResolutionSize(finalW, finalH, ResolutionPolicy.UNKNOWN);
        } else {
            view.setDesignResolutionSize(finalW, finalH, ResolutionPolicy.SHOW_ALL);
        }

        this.transform!.width = finalW;
        this.transform!.height = finalH;
    }

    /** 切换是否保留黑边 */
    public toggleKeepAspectRatio() {
        this.keepAspectRatio = !this.keepAspectRatio;
        this.resize();
    }
}