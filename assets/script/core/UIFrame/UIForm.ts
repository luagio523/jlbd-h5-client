import * as cc from "cc";
import CocosHelper from "./CocosHelper";
import { FormType, ModalOpacity } from "./config/SysDefine";
import { ECloseType, ModalType } from "./Struct";
import UIBase from "./UIBase";
import { IPool } from "../common/utils/Pool";


export class UIScreen extends UIBase {
    formType = FormType.Screen;
    closeType = ECloseType.CloseAndDestory;
}

export class UIWindow extends UIBase {
    formType = FormType.Window;    
    modalType = new ModalType(ModalOpacity.OpacityFull);                // 阴影类型
    closeType = ECloseType.LRU;
    
    /** 显示效果 */
    public async showEffect() {
        this.node.setScale(cc.v3(0, 0));
        await CocosHelper.runTweenSync(this.node, cc.tween().to(0.3, {scale: new cc.Vec3(1, 1)}, {}));
    }

    public async closeSelf(): Promise<boolean> {
        return await FormMgr.close({prefabUrl: this.fid, type: this.formType});
    }
}

export class UIFixed extends UIBase {
    formType = FormType.Fixed;
    closeType = ECloseType.LRU;
}

export class UITips extends UIBase {
    formType = FormType.Tips;
    closeType = ECloseType.CloseAndHide;
}

export class UIToast extends UIBase implements IPool {
    formType = FormType.Toast;

    public use() {
        
    }

    public free() {

    }

    public async closeSelf(): Promise<boolean> {
        return await FormMgr.close({prefabUrl: this.fid, type: this.formType});
    }
}


// @ts-ignore
cc.UIScreen = UIScreen;
// @ts-ignore
cc.UIWindow = UIWindow;
// @ts-ignore
cc.UIFixed = UIFixed;
// @ts-ignore
cc.UITips = UITips;
// @ts-ignore
cc.UIToast = UIToast;
