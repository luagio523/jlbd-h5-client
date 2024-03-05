/**
 * 定时器管理

 */
import { CircularQueue } from "../utils/HighDicList";
import { DLinkListNode, DoublyLinkedList, TLinkList, TLinkListNode } from "../utils/LinkList"


export interface ITimerMgr {
    add(interval: number, delay: number, repeat: number, cb: Function, is_updater?: boolean): TimerHandler;
    remove(handler: TimerHandler): void;
    loop(interval: number, cb: Function): TimerHandler;
    loopTimes(interval: number, repeat: number, cb: Function): TimerHandler;
    frameLoop(cb: Function): TimerHandler;
    delayLoop(interval: number, delay: number, cb: Function): TimerHandler;
    once(delay: number, cb: Function): TimerHandler;
    add_updater(cb: Function): TimerHandler;
    update(dt: number): void;
}


//timeHandler的双向链表
class TimeDLinkList<T extends TimerHandler> extends DoublyLinkedList<T> {
    private nodes: Map<number, DLinkListNode<T>> = new Map();

    append(data: T): DLinkListNode<T> {
        const newNode = this.push(data);
        this.nodes.set(data.key, newNode); // 在字典中添加
        return newNode;
    }
    
    getNodeByKey(key: number): DLinkListNode<T> {
        return this.nodes.get(key);
    }

    deleteNodeByKey(key: number): DLinkListNode<T> {
        const node = this.nodes.get(key); // 从字典中获取
        if (node === undefined) {
            return null;
        }
        this.nodes.delete(key); // 从字典中删除
        this.deleteNode(node); // 使用父类的deleteNode方法
        return node 
    }
}

//timehandler定义
class TimerHandler {
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
 * 基于双向链表的 定时器管理，适用于 频繁删除，新增
 */
export class LinkListTimerMgr implements ITimerMgr{
    private static inst: LinkListTimerMgr;
    private list: TimeDLinkList<TimerHandler>;
    private pool: CircularQueue<TimerHandler>
    private key: number;
    public runTime: number = 0

    private constructor() {
        this.key = 0;
        this.pool = new CircularQueue
        this.list = new TimeDLinkList<TimerHandler>();
    }

    static ins(): LinkListTimerMgr {
        if (!this.inst) {
            this.inst = new LinkListTimerMgr();
        }
        return this.inst;
    }

    add(interval: number, delay: number, repeat: number, cb: Function, is_updater: boolean = false): TimerHandler {
        let timerHandler: TimerHandler = this.pool.dequeue();
        if (timerHandler) {
            timerHandler.reset(interval,delay,repeat,cb,is_updater)
        }
        else {
            timerHandler = new TimerHandler(interval, delay, repeat, this.runTime + delay, cb, is_updater);
        }
        timerHandler.key = ++this.key
        // return this.list.append(timerHandler.key, timerHandler);
        this.list.append(timerHandler);
        return timerHandler
    }

    remove(handler :TimerHandler) {
        if (handler) {
            this.list.deleteNodeByKey(handler.key);
            this.pool.enqueue(handler);
        }
    }

    loop(interval: number, cb: Function): TimerHandler {
        return this.add(interval, 0, 0, cb);
    }

    loopTimes(interval: number, repeat: number, cb: Function): TimerHandler {
        return this.add(interval, 0, repeat, cb);
    }

    frameLoop(cb: Function): TimerHandler {
        return this.add(1 / 24, 0, 0, cb);
    }

    delayLoop(interval: number, delay: number, cb: Function): TimerHandler {
        return this.add(interval, delay, 0, cb);
    }

    once(delay: number, cb: Function): TimerHandler {
        return this.add(0, delay, 1, cb);
    }

    add_updater(cb: Function): TimerHandler {
        return this.add(0, 0, 0, cb, true);
    }

    update(dt: number) {
        this.runTime = this.runTime + dt;
    
        if (!this.list.head) {
            return;
        }
        let node: DLinkListNode<TimerHandler> = this.list.head;
        while (node) {
            let nextNode = node.next; // 存储一下 node.next
    
            if (node.data.is_updater) { //第一种情况  有is_updater true 直接处理
                if (node.data.cb) {
                    node.data.cb(dt);
                }
                node = nextNode;
                continue;
            }
            if (node.data.repeat != 0 && node.data.times >= node.data.repeat) { // 判断是否已经达到重复次数了，比如直接修改次数的情况，或者上轮已经达到次数的。
                this.list.deleteNodeByKey(node.data.key);
                node = nextNode;
                continue;
            }
            node.data.elapsed += dt;
            if (node.data.elapsed >= node.data.delay + node.data.interval) {
                node.data.times++;
                node.data.elapsed = node.data.delay - dt;
                
                if (node.data.cb) {
                    node.data.cb(dt);
                }
            }
            node = nextNode;
        }
    }

}

/**
 * 基于二叉堆的，适用于大量定时器，且删除不频繁的。
 */
export class HeapTimerMgr implements ITimerMgr{
    public runTime: number;
    private heap: MinHeap<TimerHandler>;

    private pendingToRemove: Set<TimerHandler>;
  
    constructor() {
        this.runTime = 0;
        this.heap = new MinHeap<TimerHandler>(
            (a, b) => a.executeTime - b.executeTime
        );
    }
  
    add(interval: number, delay: number, repeat: number, cb: Function, is_updater: boolean = false): TimerHandler {
        const timerHandler = new TimerHandler(interval, delay, repeat, this.runTime + delay, cb, is_updater);
        this.heap.insert(timerHandler);
        return timerHandler;
    }

   

    loop(interval: number, cb: Function): TimerHandler {
        return this.add(interval, 0, 0, cb);
    }

    loopTimes(interval: number, repeat: number, cb: Function): TimerHandler {
        return this.add(interval, 0, repeat, cb);
    }

    frameLoop(cb: Function): TimerHandler {
        return this.add(1 / 24, 0, 0, cb);
    }

    delayLoop(interval: number, delay: number, cb: Function): TimerHandler {
        return this.add(interval, delay, 0, cb);
    }

    once(delay: number, cb: Function): TimerHandler {
        return this.add(0, delay, 1, cb);
    }

    add_updater(cb: Function): TimerHandler {
        return this.add(0, 0, 0, cb, true);
    }



    remove(timerHandler: TimerHandler) {
        // we just mark it as pending to remove first
        this.pendingToRemove.add(timerHandler); //堆的特性，删除 填充比较好，再一起删
    }
    
    private cleanPendingToRemove() {
        for (let handler of this.pendingToRemove) {
            if (this.heap.peek() === handler) {
            this.heap.pop();
            }
        }

        this.pendingToRemove.clear();
    }
  
    update(dt: number) {
      this.runTime += dt;
      let timerHandler = this.heap.peek();
  
      while (timerHandler && this.runTime >= timerHandler.executeTime) {
        // Maybe repeat TimerHandler
        if (timerHandler.repeat === 0 || timerHandler.times < timerHandler.repeat) {
            // postpone executing time.
            timerHandler.executeTime = this.runTime + timerHandler.interval;
            timerHandler.times += 1;
            
            // Use timerHandler.cb(dt), if we assume that timerHandler.cb != null
            timerHandler.cb?.(dt);
        }
  
        // pop TimerHandler because it will be executed
        this.heap.pop();
        timerHandler = this.heap.peek();
      }
      this.cleanPendingToRemove();
    }
  }
  
