
export class LinkListNode<T>  {
    data:T;
    
    next:LinkListNode<T>;
    public constructor(data:T,next:LinkListNode<T> = null){
        this.data = data 
        this.next = next
    }
} 


export  class LinkedList<T>{
    protected _head:LinkListNode<T>;
    protected _tail:LinkListNode<T>;

    protected size:number = 0
    public constructor(){
        this._head = null
        this._tail = null
    }
    /**从尾部删除 o(n)*/
    public pop():T{
        if(!this._tail){
            return 
        }
        let prev:LinkListNode<T> = this._head;
		while(prev.next ! = this._tail){
            prev = prev.next
        }
        this._tail = prev
    }
    /**头部删除 o(1)*/
    public shift():T{
        if(!this._head){
            return 
        }
        let data = this._head.data
        this._head = this._head.next;
        if(this._head == null){
            this._tail == null
        }
		this.size--;
        return data
    }
    /* 头部添加 o(1)*/ 
    public  unshift(data:T):void{
		this._head = new LinkListNode<T>(data,this._head);
        if(this._tail == null){
            this._tail = this._head
        }
		this.size++;
	}
	//向链表尾部插入元素 o(1)
	public  push(data:T):void{
        if(this._tail == null){
            this.unshift(data)
        }else{
            this._tail.next = new LinkListNode<T>(data);
            this._tail = this._tail.next
            this.size ++
        }
	}

	//向链表中间插入元素  o(n)
	public  add(data:T,index:number):void{
		if (index <0 || index > this.size ){
			throw new Error("index is error");
		}
		if (index == 0){
			this.unshift(data);
			return;
		}
		let prev:LinkListNode<T> = this._head;

        
		//找到要插入节点的前一个节点
		for(let i:number = 0; i < index - 1; i++){
			prev = prev.next;
		}

        let node = new LinkListNode<T>(data,prev.next); //要插入的节点的下一个节点指向preNode节点的下一个节点
        prev.next = node//preNode的下一个节点指向要插入节点node

        this.size ++ 

	}
  
    /**删除特定元素 ==data  o(n)*/
    public remove(data :T ):void{
		if(!this._head ){
			return;
		}
		//要删除的元素与头结点的元素相同
		while(this._head != null && this._head.data == data){
			this._head = this._head.next;
			this.size--;
		}

        if(this._head == null) {
            return null;
        }

		/**
		 * 上面已经对头节点判别是否要进行删除
		 * 所以要对头结点的下一个结点进行判别
		 */
		let prev = this._head;
		while(prev != null && prev.next != null){
			if(prev.next.data == data){
				this.size--;
				prev.next = prev.next.next;
			}
			else {
                prev = prev.next;
            }
		}
		
	}
    /***只删除一个 o(n) */
    public removeOne(data:T):void{
        if(!this._head ){
			return;
		}
		//要删除的元素与头结点的元素相同
		while(this._head != null && this._head.data == data){
			this._head = this._head.next;
			this.size--;

            return 
		}

        if(this._head == null) {
            return 
        }

		/**
		 * 上面已经对头节点判别是否要进行删除
		 * 所以要对头结点的下一个结点进行判别
		 */
		let prev = this._head;
		while(prev != null && prev.next != null){
			if(prev.next.data == data){
				this.size--;
				prev.next = prev.next.next;

                return 
			}
			else {
                prev = prev.next;
            }
		}
    }

}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


 export type TLinkListNode<T> = {
    key:number;
    data:T;
    next:TLinkListNode<T>;
}

export class TLinkList<T>
{
    private pool:TLinkListNode<T>[];
    private _head:TLinkListNode<T>;
    private _tail:TLinkListNode<T>;

    constructor()
    {
        this._head = this._tail = null;
        this.pool = [];
    }

    private spawn_node(key:number, data:T):TLinkListNode<T>
    {
        let node:TLinkListNode<T> = this.pool.pop();
        if(node)
        {
            node.key = key;
            node.data = data;
            node.next = null;
        }
        else
        {
            node = {key:key, data:data, next:null};
        }
        return node;
    }
    
    get head():TLinkListNode<T>
    {
        return this._head;
    }

    get tail():TLinkListNode<T>
    {
        return this._tail;
    }

    append(key:number, data:T):number
    {
        let node:TLinkListNode<T> = this.spawn_node(key, data);
        //将node加到linklist末尾
        if(this._tail)
        {
            this._tail.next = node;
            this._tail = node;
        }
        else
        {
            this._head = this._tail = node;
        }
        return node.key;
    }

    remove(key:number):T
    {
        if(!key)
        {
            return null;
        }
        if(!this._head)
        {
            return null;
        }
        let prev:TLinkListNode<T>;
        let curr:TLinkListNode<T> = this._head;
        while(curr && curr.key != key)
        {
            prev = curr;
            curr = curr.next;
        }
        //没找到
        if(!curr)
        {
            return null;
        }
        if(!prev)
        {
            //curr为头节点(要区分curr是否同时为尾节点)
            this._head = curr.next;
            if(!curr.next)
            {
                this._tail = null;
            }
        }
        else
        {
            //curr非头节点(要区分curr是否为尾节点)
            prev.next = curr.next;
            if(!curr.next)
            {
                this._tail = prev;
            }
        }
        this.pool.push(curr);
        return curr.data;
    }
}





export class DLinkListNode<T> {
    prev: DLinkListNode<T> = null;
    next: DLinkListNode<T> = null;
    data: T;
    constructor(data: T) {
        this.data = data;
    }
}

export class DoublyLinkedList<T> {
    protected _head: DLinkListNode<T> = null;
    protected _tail: DLinkListNode<T> = null;
    protected size: number = 0;


    public get head() {
        return this._head
    }

    public get tail() {
        return this._head
    }

    // 向链表头部添加元素
    unshift(data: T): void {
        const newNode: DLinkListNode<T> = new DLinkListNode<T>(data);
        if (!this._head) {
            this._head = this._tail = newNode;
        } else {
            newNode.next = this._head;
            this._head.prev = newNode;
            this._head = newNode;
        }
        this.size++;
    }

    // 从链表头部删除元素
    shift(): T {
        if (!this._head) return null;
        const data: T = this._head.data;
        this._head = this._head.next;
        if (this._head) {
            this._head.prev = null;
        } else {
            this._tail = null;
        }
        this.size--;
        return data;
    }

    // 向链表尾部添加元素
    push(data: T): DLinkListNode<T> {
        const newNode: DLinkListNode<T> = new DLinkListNode<T>(data);
        if (!this._tail) {
            this._head = this._tail = newNode;
        } else {
            newNode.prev = this._tail;
            this._tail.next = newNode;
            this._tail = newNode;
        }
        this.size++;
        return newNode
    }

    // 从链表尾部删除元素
    pop(): T {
        if (!this._tail) return null;
        const data: T = this._tail.data;
        this._tail = this._tail.prev;
        if (this._tail) {
            this._tail.next = null;
        } else {
            this._head = null;
        }
        this.size--;
        return data;
    }

    
    // 插入到指定位置
    insert(data: T, index: number): void {
        if (index < 0 || index > this.size) {
            throw new Error("Index out of bounds");
        }
        if (index === 0) {
            this.unshift(data);
        } else if (index === this.size) {
            this.push(data);
        } else {
            const newNode: DLinkListNode<T> = new DLinkListNode<T>(data);
            let current = this._head;
            let i;
            for (i = 0; i < index - 1; i++) {
                current = current.next;
            }
            newNode.next = current.next;
            newNode.prev = current;
            current.next.prev = newNode;
            current.next = newNode;
            this.size++;
        }
    }

    // 删除指定位置的元素
    remove(index: number): T {
        if (index < 0 || index >= this.size) {
            throw new Error("Index out of bounds");
        }
        let data: T;
        if (index === 0) {
            data = this.shift();
        } else if (index === this.size - 1) {
            data = this.pop();
        } else {
            let current: DLinkListNode<T> = this._head;
            let i;
            for (i = 0; i < index; i++) {
                current = current.next;
            }
            data = current.data;
            current.prev.next = current.next;
            current.next.prev = current.prev;
            this.size--;
        }
        return data;
    }


    // 删除特定节点值
    removeValue(data: T): boolean {
        let current: DLinkListNode<T> = this._head;
        while (current != null) {
            if (current.data === data) {
                // 如果删除头部节点
                if (current == this._head) {
                    this.shift();
                }
                // 如果删除尾部节点
                else if (current == this._tail) {
                    this.pop();
                } 
                // 删除中间的节点
                else {
                    current.prev.next = current.next;
                    current.next.prev = current.prev;
                    this.size--;
                }
                return true;
            }
            current = current.next;
        }
        return false; // 如果没有找到值返回false
    }

    // 删除特定节点
    deleteNode(node: DLinkListNode<T>): T {
        // 如果删除头部节点
        if (node === this._head) {
            return this.shift();
        }
        // 如果删除尾部节点
        else if (node === this._tail) {
            return this.pop();
        } 
        // 删除中间的节点
        else {
            const data: T = node.data;
            node.prev.next = node.next;
            node.next.prev = node.prev;
            this.size--;
            return data;
        }
      }
   
    
    // 获取链表大小
    get length(): number {
        return this.size;
    }
}