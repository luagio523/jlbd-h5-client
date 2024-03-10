import { sys } from "cc";
import scheduler from "../../utils/scheduler";
import { DLinkListNode, DoublyLinkedList } from "../common/utils/LinkList";
import { IReleaseRes } from "./loader";


class LRULinkList<T extends IReleaseRes> extends DoublyLinkedList<T> {
    private nodes: Map<string, DLinkListNode<T>> = new Map();
    append(data: T): DLinkListNode<T> {
        const newNode = this.push(data);
        this.nodes.set(data.getKey(), newNode); // 在字典中添加
        return newNode;
    }

    getNodeByKey(key: string): DLinkListNode<T> {
        return this.nodes.get(key);
    }

    deleteNodeByKey(key: string): DLinkListNode<T> {
        const node = this.nodes.get(key); // 从字典中获取
        if (node === undefined) {
            return null;
        }
        this.nodes.delete(key); // 从字典中删除
        this.deleteNode(node); // 使用父类的deleteNode方法
        return node
    }
}


export class LRUCache {
    // 存储缓存项的Map
    private cache: LRULinkList<IReleaseRes>
    constructor() {
        this.cache = new LRULinkList<IReleaseRes>;
        scheduler.scheduleGlobal(this.cleanup.bind(this), 30)// 例如每30秒清理一次
    }
    access(key: string) {
        const item = this.cache.getNodeByKey(key);
        if (item) {
            item.data.access()
        }
    }

    remove(key:string){
        this.cache.deleteNodeByKey(key)
    }

    put(res: IReleaseRes) {
        this.cache.append(res)
    }

    // 清理函数，会根据设置的时间阈值来释放实例和资源
    private cleanup() {
        const now = sys.now();
        let node: DLinkListNode<IReleaseRes> = this.cache.head;
        while (node) {
            if (node.data.clean(now)) {
                this.cache.deleteNode(node);
            }
            node = node.next;
        }
    }
}
