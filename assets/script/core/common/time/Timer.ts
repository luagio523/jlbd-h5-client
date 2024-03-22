/*
 * @Author: dgflash
 * @Date: 2023-01-19 11:09:38
 * @LastEditors: dgflash
 * @LastEditTime: 2023-01-19 14:28:05
 */

/** 
 * 定时跳动组件 
 * @example
    export class Test extends Component {
        // 创建一个定时跳动组件
        private timer: Timer = new Timer(1);

        update(dt: number) {
            if (this.timer.update(this.dt)) {
                console.log(每一秒触发一次);
            }
        }
    }
 */
export class Timer {
    callback: Function | null = null;

    private _elapsedTime: number = 0;

    get elapsedTime(): number {
        return this._elapsedTime;
    }

    private _interval: number = -1;
    /** 触发间隔时间（秒） */
    get interval(): number {
        return this._interval;
    }
    set interval(interval: number) {
        this._interval = interval;                     // 每次修改时间
        this._elapsedTime = 0;                 // 逝去时间
    }

    get progress(): number {
        return this._elapsedTime / this._interval;
    }

    constructor(interval: number = 0) {
        this.interval = interval;
    }

    update(dt: number) {
        if (this.interval <= 0) return false;

        this._elapsedTime += dt;

        if (this._elapsedTime >= this._interval) {
            this._elapsedTime -= this._interval;
            this.callback?.call(this);
            return true;
        }
        return false;
    }

    reset() {
        this._elapsedTime = 0;
    }

    stop() {
        this._elapsedTime = 0;
        this.interval = -1;
    }
}