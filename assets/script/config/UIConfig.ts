import { UILayer } from "../core/ui/UILayer";
import { IUIConfig } from "../core/ui/UIConfig";

// 配置对象更新成包含loader方法
export enum UIView {
    LOGIN = "Login",
    CREATE_ROLE = "CreateRole",
}

// 使用新的枚举名重构 UI_CONFIG
export const UI_CONFIG: { [key in UIView]: IUIConfig } = {
    [UIView.LOGIN]: {
        uiId: UIView.LOGIN,
        uiLayer: UILayer.BACKGROUND,
        mediatorClass: "LoginMediator",
        resourcePath: "res/Login",
    },
    [UIView.CREATE_ROLE]: {
        uiId: UIView.CREATE_ROLE,
        uiLayer: UILayer.BACKGROUND,
        mediatorClass: "CreateRoleMediator",
        resourcePath: "UI/CreateRole",
        uiComponentName: "CreateRoleWin",
        // pkgName: "CreateRole"
    },
    // 添加更多 UI 配置...
};




