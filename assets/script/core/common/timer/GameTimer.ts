

import { Timer } from './Timer'; // 假定Timer类在'Timer.ts'文件中

// 游戏计时器类定义
export class GameTimer {
    private gameStartTime: number;
    private pausedTime: number;
    private pausedAt: number | null;
    private timers: Timer[];
    private serverTimeOffset: number; // 服务器时间偏移量

    constructor() {
        this.gameStartTime = Date.now();
        this.pausedTime = 0;
        this.pausedAt = null;
        this.timers = [];
    }

     /**
     * 更新服务器时间与本地时间的偏移量。
     * @param serverTimestamp 从服务器获取的当前时间戳（单位：毫秒）
     */
     public syncServerTime(serverTimestamp: number): void {
        const localTimestamp = Date.now();
        // 更新服务器时间偏移量
        this.serverTimeOffset = serverTimestamp - localTimestamp;
    }

       /**
     * 获取本地客户端当前时间。
     * @returns 返回本地时间戳（单位：毫秒）
     */
    public getLocalTime(): number {
        return Date.now();
    }

    /**
     * 获取服务器当前时间。
     * @returns 返回通过偏移量校正过的服务器时间戳（单位：毫秒）
     */
    public getServerTime(): number {
        return this.getLocalTime() + this.serverTimeOffset;
    }

    /************************************************************************************************************************** */

    /**
     * 更新游戏计时和所有计时器的状态。
     * @param deltaTime 从上次更新以来经过的时间（单位：毫秒）
     */
    public update(deltaTime: number): void {
        if (this.pausedAt !== null) {
            return; // 如果游戏已暂停，则不更新计时器。
        }

        // 遍历并更新每个计时器。
        this.timers.forEach(timer => timer.update(deltaTime));
    }

    /**
     * 开始或者继续游戏计时。
     */
    public start(): void {
        if (this.pausedAt) {
            // 如果游戏以前暂停过，计算并记录暂停时间。
            this.pausedTime += Date.now() - this.pausedAt;
            this.pausedAt = null;
        }
        this.gameStartTime = Date.now() - this.pausedTime;
        // 从新的开始时间激活所有Timer计时器。
        this.timers.forEach(timer => timer.resume());
    }

    /**
     * 暂停游戏和所有计时器。
     */
    public pause(): void {
        this.pausedAt = Date.now();
        // 暂停所有Timer计时器。
        this.timers.forEach(timer => timer.pause());
    }

    /**
     * 添加一个新的定时器到游戏计时器。
     * @param interval 定时器的时间间隔。
     * @param callback 定时器的回调函数。
     * @param repeat 定时器是否应该重复。
     * @param autoStart 定时器是否在创建时自动开始。
     * @returns 创建的Timer实例。
     */
    public addTimer(interval: number, callback: Function, repeat = true, autoStart = true): Timer {
        const timer = new Timer(interval, callback, { repeat, autoStart });
        this.timers.push(timer);
        return timer;
    }


    /**
     * 添加倒计时器。
     * @param duration 倒计时持续时间（单位：毫秒）
     * @param onTick 每秒执行的回调函数
     * @param onComplete 倒计时结束的回调函数
     * @returns 返回创建的计时器对象
     */
    public addCountdown(duration: number, onTick: (secondsRemaining: number) => void, onComplete: () => void): Timer {
        // 每秒钟调用一次onTick函数
        const interval = 1000;
        let secondsRemaining = duration / 1000;

        const tickFunction = () => {
            secondsRemaining--;
            onTick(secondsRemaining);
        };

        const completeFunction = () => {
            onComplete();
            countdownTimer.stop(); // 停止倒计时器
        };

        // 创建一个Timer对象，该对象在指定的时间间隔后调用tickFunction，
        // 并在总持续时间结束后调用completeFunction。
        const countdownTimer = new Timer(interval, tickFunction, {
            repeat: true,
            autoStart: true
        });

        // 添加一个额外的回调函数用来检查倒计时是否完成
        countdownTimer.addCallback(() => {
            if (secondsRemaining <= 0) {
                completeFunction();
            }
        });

        this.timers.push(countdownTimer);
        
        // 如果游戏当前是暂停的，我们需要保持倒计时器的状态为暂停
        if(this.pausedAt !== null) {
            countdownTimer.pause();
        }

        return countdownTimer;
    }


    /**
     * 从游戏计时器中移除一个计时器。
     * @param timer 要移除的计时器对象。
     */
    public removeTimer(timer: Timer): void {
        // 停止定时器
        timer.stop();
        // 从定时器数组中移除
        this.timers = this.timers.filter(t => t !== timer);
    }

    /**
     * 获取游戏经过时间，考虑任何暂停时间。
     * @returns 游戏已经经过的时间（单位：毫秒）
     */
    public getTimeElapsed(): number {
        if (this.pausedAt) {
            // 游戏暂停时，返回已经记录的暂停时间。
            return this.pausedTime;
        }
        // 游戏进行时，返回当前时间减去游戏开始时间。
        return Date.now() - this.gameStartTime - this.pausedTime;
    }
}
