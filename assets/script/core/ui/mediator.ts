import { js } from "cc";

// PureMVC中Mediator的示例接口
export interface IViewMediator {
    // 初始化UI
   initialize(instanceId :string): void;
 
 // 参数的处理和UI的打开行为由Mediator来定义
   open(...params: any[]): void; 
 
     // ...
   dispose(): void; // 当UI关闭时调用
 }


export class MediatorFactory {
    public static create(mediatorClassName: string, uiInstance: any): IViewMediator {
        const MediatorClass = js.getClassByName(mediatorClassName) as new (uiInstance: any) => IViewMediator;
        if (!MediatorClass) {
            throw new Error(`Mediator class not found: ${mediatorClassName}`);
        }
        return new MediatorClass(uiInstance);
    }
}