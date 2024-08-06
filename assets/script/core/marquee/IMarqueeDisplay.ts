import { MarqueeMessage } from "./Marquee";

/**
 * 跑马灯显示接口
 */
export interface IMarqueeDisplay {
    show(message: MarqueeMessage): void;
    hide(message: MarqueeMessage): void;
}






// 使用示例
export class ConsoleMarqueeDisplay implements IMarqueeDisplay {
    show(message: MarqueeMessage): void {
        console.log(`Showing message: ${message.content} (Priority: ${message.priority}, Display Time: ${message.displayTime}ms)`);
    }

    hide(message: MarqueeMessage): void {
        console.log(`Hiding message: ${message.content}`);
    }
}
