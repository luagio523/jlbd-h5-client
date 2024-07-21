/**
 * 定时器管理

 */
import { CircularQueue } from "../collection/CircularQueue";
import { DLinkListNode, DoublyLinkedList } from "../collection/LinkList";
import { MinHeap } from "../collection/MinHeap";


export interface ITimerMgr {
    add(interval: number, delay: number, repeat: number, cb: Function, isUpdater?: boolean): number;
    remove(handler: number): void;
    loop(interval: number, cb: Function): number;
    loopTimes(interval: number, repeat: number, cb: Function): number;
    frameLoop(cb: Function): number;
    delayLoop(interval: number, delay: number, cb: Function): number;
    once(delay: number, cb: Function): number;
    addUpdater(cb: Function): number;
    update(dt: number): void;
}




//timehandler定义
class TaskTimer {
    public times: number;
    public executeTime: number;
    public elapsed: number = 0; // 已过去的时间
    public key: number = -1; // 链表标识

    constructor(
        public interval: number, // execution interval. Timer which only executed once doesn't use this property.
        public delay: number, // delay for first time execution
        public repeat: number, // how many times it should be executed. 0 means infinite.
        initExecuteTime: number,
        public cb: Function | null, // callback function
        public isUpdater: boolean, // is handler ran in every frame
    ) {
        this.times = 0;
        this.executeTime = initExecuteTime;
    }

    update(dt: number): boolean {
        this.elapsed += dt;
        if (this.elapsed >= this.executeTime) {
            this.times++;
            this.executeTime += this.interval;
            return true;
        }
        return false;
    }

    public reset(
        interval: number, // execution interval. Timer which only executed once doesn't use this property.
        delay: number, // delay for first time execution
        repeat: number, // how many times it should be executed. 0 means infinite.
        cb: Function | null, // callback function
        isUpdater: boolean, // is handler ran in every frame
    ): void {
        this.interval = interval;
        this.delay = delay;
        this.repeat = repeat;
        this.cb = cb;
        this.isUpdater = isUpdater;
        this.elapsed = 0;
        this.times = 0;
        this.executeTime = this.delay; // 重置执行时间
    }
}




/**
 * 基于双向链表的 定时器管理，适用于 取消频繁删除，新增
 */
export class LinkListTimerMgr implements ITimerMgr {
    private timerIdCounter: number = 0;
    private timerIdMap: Map<number, DLinkListNode<TaskTimer>> = new Map();
    private list: DoublyLinkedList<TaskTimer>;
    private pool: CircularQueue<TaskTimer>;
    public runTime: number = 0;

    public constructor() {
        this.pool = new CircularQueue<TaskTimer>();
        this.list = new DoublyLinkedList<TaskTimer>();
    }

    public add(interval: number, delay: number, repeat: number, cb: Function, isUpdater: boolean = false): number {
        let taskTimer: TaskTimer | null = this.pool.dequeue();
        if (taskTimer) {
            taskTimer.reset(interval, delay, repeat, cb, isUpdater);
        } else {
            taskTimer = new TaskTimer(interval, delay, repeat, this.runTime + delay, cb, isUpdater);
        }
        const id = this.timerIdCounter++;
        taskTimer.key = id;
        const newNode = this.list.push(taskTimer);
        this.timerIdMap.set(id, newNode);
        return id;
    }

    public remove(key: number): boolean {
        const node = this.timerIdMap.get(key);
        if (!node) {
            return false;
        }
        this.timerIdMap.delete(key);
        this.list.deleteNode(node);

        if (node.data) {
            this.pool.enqueue(node.data);
        }
        return true;
    }

    public loop(interval: number, cb: Function): number {
        return this.add(interval, 0, 0, cb);
    }

    public loopTimes(interval: number, repeat: number, cb: Function): number {
        return this.add(interval, 0, repeat, cb);
    }

    public frameLoop(cb: Function): number {
        return this.add(1 / 24, 0, 0, cb);
    }

    public delayLoop(interval: number, delay: number, cb: Function): number {
        return this.add(interval, delay, 0, cb);
    }

    public once(delay: number, cb: Function): number {
        return this.add(0, delay, 1, cb);
    }

    public addUpdater(cb: Function): number {
        return this.add(0, 0, 0, cb, true);
    }

    public update(dt: number): void {
        this.runTime += dt;

        let node = this.list.head;
        while (node) {
            const nextNode = node.next;
            const taskTimer = node.data;

            if (taskTimer.isUpdater) {
                taskTimer.cb?.(dt);
            } else if (taskTimer.update(dt) && taskTimer.cb) {
                taskTimer.cb(dt);
                if (taskTimer.repeat !== 0 && taskTimer.times >= taskTimer.repeat) {
                    this.timerIdMap.delete(taskTimer.key);
                    this.list.deleteNode(node);
                    this.pool.enqueue(taskTimer);
                }
            }

            node = nextNode;
        }
    }

    public clear(): void {
        this.timerIdMap.clear();
        this.list.clear();
        this.pool.clear();
        this.timerIdCounter = 0;
        this.runTime = 0;
    }
}



//适用于大批量定时器，取消删除比较少
export class HeapTimerMgr implements ITimerMgr {
    public runTime: number;
    private heap: MinHeap<TaskTimer>;
    private timerIdMap: Map<number, TaskTimer>;
    private timerIdCounter: number;
    private pendingToRemove: Set<TaskTimer>;
    private pool: CircularQueue<TaskTimer>;

    constructor(private maxPoolSize: number = 1000) {
        this.runTime = 0;
        this.heap = new MinHeap<TaskTimer>((a, b) => a.executeTime - b.executeTime);
        this.timerIdMap = new Map<number, TaskTimer>();
        this.timerIdCounter = 0;
        this.pendingToRemove = new Set<TaskTimer>();
        this.pool = new CircularQueue<TaskTimer>(this.maxPoolSize);
    }

    public add(interval: number, delay: number, repeat: number, cb: Function, isUpdater: boolean = false): number {
        if (interval < 0 || delay < 0 || repeat < 0) {
            throw new Error("Invalid timer parameters");
        }

        let taskTimer: TaskTimer | null = this.pool.dequeue();
        if (taskTimer) {
            taskTimer.reset(interval, delay, repeat, cb, isUpdater);
        } else {
            taskTimer = new TaskTimer(interval, delay, repeat, this.runTime + delay, cb, isUpdater);
        }

        const id = this.timerIdCounter++;
        taskTimer.key = id;
        this.heap.insert(taskTimer);
        this.timerIdMap.set(id, taskTimer);
        return id;
    }

    public remove(key: number): boolean {
        const taskTimer = this.timerIdMap.get(key);
        if (!taskTimer) return false;

        if (this.heap.peek() === taskTimer) {
            this.heap.pop();
            this.timerIdMap.delete(key);
        } else {
            this.pendingToRemove.add(taskTimer);
        }

        if (this.pool.getSize() < this.maxPoolSize) {
            this.pool.enqueue(taskTimer);
        }

        return true;
    }

    public update(dt: number): void {
        this.runTime += dt;
        this.processTimers(dt);
        this.cleanPendingToRemove();
    }

    private processTimers(dt: number): void {
        while (this.shouldProcessNextTimer()) {

            console.log("process next timer",dt);
            const taskTimer = this.heap.pop();
            if (!taskTimer) break;

            if (this.pendingToRemove.has(taskTimer)) {
                this.timerIdMap.delete(taskTimer.key);
                this.pendingToRemove.delete(taskTimer);
                continue;
            }


            this.executeTimer(taskTimer, dt);

            if (this.shouldReinsertTimer(taskTimer)) {
                this.reinsertTimer(taskTimer);
            } else {
                this.recycleTimer(taskTimer);
            }
        }
    }

    private shouldProcessNextTimer(): boolean {
        const nextTimer = this.heap.peek();
        return nextTimer !== undefined && this.runTime >= nextTimer.executeTime;
    }

    private executeTimer(taskTimer: TaskTimer, dt: number): void {

        console.log("execute timer", dt);

        if (taskTimer.isUpdater || taskTimer.update(dt)) {

           

            taskTimer.cb?.(dt);
        }
    }

    private shouldReinsertTimer(taskTimer: TaskTimer): boolean {
        return !taskTimer.isUpdater && (taskTimer.repeat === 0 || taskTimer.times < taskTimer.repeat);
    }

    private reinsertTimer(taskTimer: TaskTimer): void {
        taskTimer.executeTime = this.runTime + taskTimer.interval;
        this.heap.insert(taskTimer);
    }

    private recycleTimer(taskTimer: TaskTimer): void {
        this.timerIdMap.delete(taskTimer.key);
        if (this.pool.getSize() < this.maxPoolSize) {
            this.pool.enqueue(taskTimer);
        }
    }

    private cleanPendingToRemove(): void {
        if (this.pendingToRemove.size === 0) return;

        const newHeap = new MinHeap<TaskTimer>((a, b) => a.executeTime - b.executeTime);
        while (!this.heap.isEmpty()) {
            const timer = this.heap.pop();
            if (timer && !this.pendingToRemove.has(timer)) {
                newHeap.insert(timer);
            }
        }

        this.heap = newHeap;
        this.pendingToRemove.clear();
    }

    public loop(interval: number, cb: Function): number {
        return this.add(interval, 0, 0, cb);
    }

    public loopTimes(interval: number, repeat: number, cb: Function): number {
        return this.add(interval, 0, repeat, cb);
    }

    public frameLoop(cb: Function): number {
        return this.add(1 / 24, 0, 0, cb);
    }

    public delayLoop(interval: number, delay: number, cb: Function): number {
        return this.add(interval, delay, 0, cb);
    }

    public once(delay: number, cb: Function): number {
        return this.add(0, delay, 1, cb);
    }

    public addUpdater(cb: Function): number {
        return this.add(0, 0, 0, cb, true);
    }

    public clear(): void {
        this.heap = new MinHeap<TaskTimer>((a, b) => a.executeTime - b.executeTime);
        this.timerIdMap.clear();
        this.pendingToRemove.clear();
        this.pool.clear();
        this.timerIdCounter = 0;
        this.runTime = 0;
    }
}





// 基于堆的定时器管理：
// 优点：
// 插入和删除操作的时间复杂度为 O(log n)，非常高效。
// 获取最近要执行的定时器非常快，时间复杂度为 O(1)。
// 内存使用相对紧凑。
// 缺点：
// 实现相对复杂。
// 对于频繁更新的定时器，可能需要频繁重新平衡堆。
// 不适合需要频繁遍历所有定时器的场景。
// 适用场景：
// 大量定时器，且主要关注最近要执行的定时器。
// 定时器的触发时间分布较为均匀。
// 基于双向链表的定时器管理：
// 优点：
// 插入和删除操作的时间复杂度为 O(1)，非常快。
// 实现相对简单，易于理解和维护。
// 适合频繁遍历所有定时器的场景。
// 更新定时器的执行时间很方便。
// 缺点：
// 获取最近要执行的定时器需要遍历整个链表，时间复杂度为 O(n)。
// 内存使用可能比堆实现更多，因为每个节点都需要额外的指针。
// 适用场景：
// 定时器数量相对较少。
// 需要频繁遍历和更新所有定时器。
// 定时器的触发时间分布不均匀。


// 对于前端RPG游戏的选择：
// 考虑到前端RPG游戏的特性，我更倾向于推荐基于双向链表的定时器管理（，原因如下：
// 灵活性：RPG游戏通常有很多复杂的游戏逻辑和状态，可能需要频繁地添加、删除和更新定时器。双向链表的实现在这方面更加灵活。
// 遍历效率：游戏可能需要在每一帧更新多个定时器，双向链表便于遍历和批量更新。
// 实时性：RPG游戏可能需要频繁地调整定时器的执行时间（例如，因为游戏状态的变化），双向链表可以很容易地实现这一点。
// 简单性：双向链表的实现更简单，更容易理解和维护，这对于游戏开发来说是一个优势。
// 定时器数量：除非你的游戏有成千上万的定时器同时运行（这种情况在大多数RPG游戏中不太可能），否则双向链表的性能应该足够好。
// 内存使用：虽然双向链表可能使用更多内存，但在现代浏览器中，这种差异通常不会造成明显的性能问题。