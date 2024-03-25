/**
 * 定时器管理

 */
import { CircularQueue } from "../collection/CircularQueue";
import { DLinkListNode, DoublyLinkedList } from "../collection/LinkList";


export interface ITimerMgr {
    add(interval: number, delay: number, repeat: number, cb: Function, is_updater?: boolean): number;
    remove(handler: number): void;
    loop(interval: number, cb: Function): number;
    loopTimes(interval: number, repeat: number, cb: Function): number;
    frameLoop(cb: Function): number;
    delayLoop(interval: number, delay: number, cb: Function): number;
    once(delay: number, cb: Function): number;
    add_updater(cb: Function): number;
    update(dt: number): void;
}




//timehandler定义
class TaskTimer {
    public times: number;
    public executeTime: number;
    public elapsed: number;     //已过去的时间
    public key:number //链表标识
  
    constructor(
      public interval: number, // execution interval. Timer which only executed once doesn't use this property.
      public delay: number, // delay for first time execution
      public repeat: number, // how many times it should be executed. 0 means infinite. 
      initExecuteTime: number,
      public cb: Function | null, // callback function
      public is_updater: boolean, // is handler ran in every frame
    ) {
      this.times = 0;
      this.executeTime = initExecuteTime;
    }

    update(dt: number) {
        this.elapsed += dt;
        return this.elapsed >= this.delay + this.interval;
    }

    public reset(  interval: number, // execution interval. Timer which only executed once doesn't use this property.
        delay: number, // delay for first time execution
        repeat: number, // how many times it should be executed. 0 means infinite. 
        cb: Function | null, // callback function
        is_updater: boolean, // is handler ran in every frame){
    ){
        this.interval = interval
        this.delay = delay
        this.repeat = repeat
        this.cb  = cb 
        this.is_updater = is_updater
        this.elapsed  = 0 
        this.times = 0
    }
  }




/**
 * 基于双向链表的 定时器管理，适用于 取消频繁删除，新增
 */
export class LinkListTimerMgr implements ITimerMgr{
    private timerIdCounter: number;
    private timerIdMap: Map<number, DLinkListNode<TaskTimer>> = new Map();
    private list: DoublyLinkedList<TaskTimer>;
    private pool: CircularQueue<TaskTimer>
    public runTime: number = 0

    public constructor() {
        this.pool = new CircularQueue
        this.list = new DoublyLinkedList<TaskTimer>();
    }

   
    add(interval: number, delay: number, repeat: number, cb: Function, is_updater: boolean = false): number {
        let taskTimer: TaskTimer = this.pool.dequeue();
        if (taskTimer) {
            taskTimer.reset(interval,delay,repeat,cb,is_updater)
        }
        else {
            taskTimer = new TaskTimer(interval, delay, repeat, this.runTime + delay, cb, is_updater);
        }
        const id = this.timerIdCounter++
        taskTimer.key = id
        const newNode =  this.list.push(taskTimer);
        this.timerIdMap.set(id, newNode); // 在字典中添加
        return id
    }

    remove(key :number) {
        const node = this.timerIdMap.get(key); // 从字典中获取
        if (node === undefined) {
            return null;
        }
        this.timerIdMap.delete(key) // 从字典中删除
        this.list.deleteNode(node); 

        if(node.data)
        {
            this.pool.enqueue(node.data);
        }
    }

    loop(interval: number, cb: Function): number {
        return this.add(interval, 0, 0, cb);
    }

    loopTimes(interval: number, repeat: number, cb: Function): number {
        return this.add(interval, 0, repeat, cb);
    }

    frameLoop(cb: Function): number {
        return this.add(1 / 24, 0, 0, cb);
    }

    delayLoop(interval: number, delay: number, cb: Function): number {
        return this.add(interval, delay, 0, cb);
    }

    once(delay: number, cb: Function): number {
        return this.add(0, delay, 1, cb);
    }

    add_updater(cb: Function): number {
        return this.add(0, 0, 0, cb, true);
    }

    update(dt: number) {
        this.runTime = this.runTime + dt;

        let node: DLinkListNode<TaskTimer> = this.list.head;
        while (node) {
            let nextNode = node.next;

            if (node.data.is_updater) { //第一种情况 有is_updater true 直接处理
                node.data.cb?.(dt);
            } else if (node.data.update(dt) && node.data.cb) {
                node.data.cb(dt);
                if (node.data.repeat !== 0 && node.data.times >= node.data.repeat) { 
                    this.timerIdMap.delete(node.data.key) // 从字典中删除
                    this.list.deleteNode(node);
                    this.pool.enqueue(node.data)
                }
            }

            node = nextNode;
        }
    }

}

//适用于大批量定时器，取消删除比较少
export class HeapTimerMgr implements ITimerMgr {
    public runTime: number;
    private heap: MinHeap<TaskTimer>;

     // 添加一个用来存储id和TaskTimer关系的Map
    private timerIdMap: Map<number, TaskTimer>;
    private timerIdCounter: number;

    private pendingToRemove: Set<TaskTimer>;
    private pool: CircularQueue<TaskTimer>

    constructor() {
        this.runTime = 0;
        this.heap = new MinHeap<TaskTimer>(
            (a, b) => a.executeTime - b.executeTime
        );
        this.pendingToRemove = new Set<TaskTimer>();
        this.pool = new CircularQueue
        this.timerIdMap  = new Map<number, TaskTimer>()
    }

    add(interval: number, delay: number, repeat: number, cb: Function, is_updater: boolean = false): number {
        let taskTimer: TaskTimer = this.pool.dequeue();
        if (taskTimer) {
            taskTimer.reset(interval,delay,repeat,cb,is_updater)
        }
        else {
            taskTimer = new TaskTimer(interval, delay, repeat, this.runTime + delay, cb, is_updater);
        }

        const id  = this.timerIdCounter++;
        taskTimer.key = id;
        this.heap.insert(taskTimer);
        this.timerIdMap.set(id, taskTimer);
        return id;
    }

    remove(key:number) {
        const taskTimer = this.timerIdMap.get(key);

        if (!taskTimer) return;
        if (this.heap.peek() === taskTimer) {
          this.heap.pop();
          this.timerIdMap.delete(key);
        } else {
          this.pendingToRemove.add(taskTimer);
        }

        if(taskTimer)
        {
            this.pool.enqueue(taskTimer);
        }
    }

    private cleanPendingToRemove() {
        let tempHeap = new MinHeap<TaskTimer>(
            (a, b) => a.executeTime - b.executeTime
        );

        while (!this.heap.isEmpty()) {
            let handler = this.heap.pop();
            if (handler && !this.pendingToRemove.has(handler)) {
                tempHeap.insert(handler);
            }
        }

        this.heap = tempHeap;
        this.pendingToRemove.clear();
    }

    update(dt: number) {
        this.runTime += dt;
        let taskTimer = this.heap.peek();
     
        while (taskTimer && this.runTime >= taskTimer.executeTime) {
            if (this.pendingToRemove.has(taskTimer)) {
                this.heap.pop();
                taskTimer = this.heap.peek();
                continue;
            }
    
            if (taskTimer.is_updater || taskTimer.update(dt)) {
                taskTimer.cb?.(dt);
            }
    
            if (taskTimer.repeat !== 0 && taskTimer.times >= taskTimer.repeat) {
                this.pool.enqueue(this.heap.pop())
            } else if(!taskTimer.is_updater) {
                taskTimer.executeTime += taskTimer.interval;
                this.heap.insert(taskTimer);
            }
            
            taskTimer = this.heap.peek();
        }
    
        this.cleanPendingToRemove();
    }

    loop(interval: number, cb: Function): number {
        return this.add(interval, 0, 0, cb);
    }

    loopTimes(interval: number, repeat: number, cb: Function): number {
        return this.add(interval, 0, repeat, cb);
    }

    frameLoop(cb: Function): number {
        return this.add(1 / 24, 0, 0, cb);
    }

    delayLoop(interval: number, delay: number, cb: Function): number {
        return this.add(interval, delay, 0, cb);
    }

    once(delay: number, cb: Function): number {
        return this.add(0, delay, 1, cb);
    }

    add_updater(cb: Function): number {
        return this.add(0, 0, 0, cb, true);
    }
}

