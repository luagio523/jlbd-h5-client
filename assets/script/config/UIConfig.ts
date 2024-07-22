import { UILayer } from "../core/ui/UILayer";
import { IUIConfig } from "../core/ui/UIConfig";

// 配置对象更新成包含loader方法
export enum UIView {
    Login = "Login",
    CreateRole = "CreateRole",
    HeadUpDisplay = "HeadUpDisplay",
    Story = "Story",
    StoryGuide = "StoryGuide",
}

// 使用新的枚举名重构 UI_CONFIG
export const UI_CONFIG: { [key in UIView]: IUIConfig } = {
    [UIView.Login]: {
        uiId: UIView.Login,
        uiLayer: UILayer.BACKGROUND,
        mediatorClass: "LoginMediator",
        resourcePath: "UI/Login",
    },
    [UIView.CreateRole]: {
        uiId: UIView.CreateRole,
        uiLayer: UILayer.BACKGROUND,
        mediatorClass: "CreateRoleMediator",
        resourcePath: "UI/CreateRole",
        uiComponentName: "CreateRoleWin",
    },
    [UIView.HeadUpDisplay]: {
        uiId: UIView.HeadUpDisplay,
        uiLayer: UILayer.BACKGROUND,
        mediatorClass: "HeadUpDisplayMediator",
        resourcePath: "UI/Battle",
        uiComponentName: "BattlePanel",
    },
    [UIView.Story]: {
        uiId: UIView.Story,
        uiLayer: UILayer.BACKGROUND,
        mediatorClass: "StoryMediator",
        resourcePath: "UI/Story",
        uiComponentName: "Story",
    },
    [UIView.StoryGuide]: {
        uiId: UIView.StoryGuide,
        uiLayer: UILayer.BACKGROUND,
        mediatorClass: "StoryGuideMediator",
        resourcePath: "UI/StoryGuide",
        uiComponentName: "StoryGuide",
    },
    // 添加更多 UI 配置...
};




