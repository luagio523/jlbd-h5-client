import { UILayer } from "../core/ui/LayerManager";
import { IUIConfig } from "../core/ui/UIConfig";

// 配置对象更新成包含loader方法
export const UI_CONFIG: { [uiId: string]: IUIConfig } = {
    "loginUI": {
        uiId: "loginUI",
        uiLayer: UILayer.BACKGROUND,
        mediatorClass: "LoginMediator",
        resourcePath: "res/Login",
    },
};
