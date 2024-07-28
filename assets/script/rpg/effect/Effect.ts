// IEffect.ts
import { Node } from 'cc';


// 定义效果接口
export interface IEffect {
    apply(target: Node, ...args: any[]): void;
    onComplete(callback: () => void): void;
    reset(): void;
    update(dt: number): void;
    complete(): void;
}

/**
 *  所有效果的基类
 *  子类必须实现调用 complete() 方法来结束效果
 */
export abstract class BaseEffect extends EventTarget implements IEffect {
    protected completeCallbacks: (() => void)[] = [];

    abstract apply(target: Node, ...args: any[]): void;
    abstract reset(): void;
    

    public onComplete(callback: () => void): void {
        this.completeCallbacks.push(callback);
    }

    update(dt: number): void{};
    public complete(): void {
        this.reset();
        this.completeCallbacks.forEach(callback => callback());
        this.completeCallbacks = [];
    }
}







