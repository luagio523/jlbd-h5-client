import { UILayer } from "./UILayer";

export interface IUIConfig {
    uiId: string; //uiId 配置标识
    uiLayer:UILayer //所在的层
    mediatorClass: string; //mediator类
    resourcePath: string; //资源路径
    pkgName?:string;
    uiComponentName?: string; // 要创建的UI组件的名称
    uiRepeat?:boolean //实例是否允许重复
    uiIdleTime?:number //ui保留时间
}

