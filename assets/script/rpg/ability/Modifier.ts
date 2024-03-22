
export class Modifier {
    // ...其他属性和方法保持不变
    public elapsed: number = 0; // 累积时间
    public thinkInterval: number; // 执行间隔
 
    constructor(thinkInterval: number) {
        this.thinkInterval = thinkInterval;
    }
 
    // 更新方法，决定何时执行think
    // 只使用deltaTime参数
    public update(deltaTime: number): void {
        this.elapsed += deltaTime; // 累积经过的时间
        if (this.elapsed >= this.thinkInterval) {
            this.think();
            this.elapsed -= this.thinkInterval; // 重置累积时间
        }
    }
 
    public think() {
        // 在这里实现每个think周期需要执行的逻辑
    }
 
    // startThink和stopThink方法依然可以按照之前的逻辑实现。
 }