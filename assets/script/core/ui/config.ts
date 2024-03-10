import { UILayer } from "./layer";

export interface IUIConfig {
    uiId: string; //uiId 配置标识
    uiLayer:UILayer //所在的层
    mediatorClass: string; //mediator类
    resourcePath: string; //资源路径
    pkgName?:string;
    uiComponentName?: string; // 要创建的UI组件的名称
    uiRepeat?:boolean //实例是否允许重复
    resourceType?:ResourceType; //资源类型
    uiIdleTime?:number //ui保留时间
    assetIdleTime?:number //ui资源保留时间
}



export const enum ResourceType {
    FairyGuiComponent = 1,
    CocosCreatorPrefab = 2
}

export const DefaultUIIdleTime = 1*60*1000  //默认UI释放时间
export const DefaultAssetsIdleTime = 5*60*1000 //默认assets 释放时间