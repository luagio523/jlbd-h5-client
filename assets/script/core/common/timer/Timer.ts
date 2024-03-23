

// Timer类定义 
export class Timer {
    private interval: number;        // 时间间隔
    private callback?: Function;    // 到达间隔时的回调函数
    private accumulator: number;     // 累加时间
    private repeat: boolean;         // 是否重复计时
    private active: boolean;         // 定时器是否自动开始

    /**
     * 构造一个定时器对象.
     * @param {number} interval - 时钟的触发间隔.
     * @param {Function} callback - 触发时钟时的回调函数.
     * @param {Object} options - 配置选项.
     * @param {boolean} options.repeat - 时间是否应重复.
     * @param {boolean} options.autoStart - 定时器是否在创建时自动开始.
     */
    constructor(interval: number, callback?: Function, { repeat = true, autoStart = true } = {}) {
        this.interval = interval;
        this.callback = callback;
        this.accumulator = 0;
        this.repeat = repeat;
        this.active = autoStart;
    }

    /**
     * 获取计时器的进度.
     * @return {number} 当前累计时间与间隔的比.
     */
    get progress(): number {
        return this.accumulator / this.interval;
    }

    /**
     * 更新计时器的状态，如果达到间隔时间，则触发回调.
     * @param {number} deltaTime - 从上次更新以来经过的时间.
     */
    update(deltaTime: number): void {
        if (!this.active) {
            return;
        }

        this.accumulator += deltaTime;
        if (this.accumulator >= this.interval) {
            this.callback?.call(this);             
            this.accumulator = this.repeat ? this.accumulator % this.interval : 0;
            this.active = this.repeat;  
        }
    }

    /**
     * 重启定时器.
     * @param {boolean} resetAccumulator - 是否重置累加的时间.
     */
    restart(resetAccumulator = true): void {
        if (resetAccumulator) {
            this.accumulator = 0;
        }
        this.active = true;
    }

    /**
     * 停止定时器.
     * @param {boolean} resetAccumulator 是否重置累加的时间.
     */
    stop(resetAccumulator = true): void {
        this.active = false;
        if (resetAccumulator) {
            this.accumulator = 0;
        }
    }
    
    /**
     * 暂停计时器.
     */
    pause(): void {
        this.active = false;
    }

    /**
     * 恢复计时器.
     */
    resume(): void {
        this.active = true;
    }

    /**
     * 修改间隔时间.
     * @param {number} newInterval - 新的时间间隔.
     */
    setInterval(newInterval: number): void {
        this.interval = newInterval;
    }

    /**
     * 添加额外的回调函数.
     * @param {Function} additionalCallback - 额外的回调函数.
     */
    addCallback(additionalCallback: Function): void {
        const previousCallback = this.callback;
        this.callback = () => {
            previousCallback();
            additionalCallback();
        };
    }
}