


export class CircularQueue<T> {
    private queue: Array<T>;
    private head: number;
    private tail: number;
    private size: number;
    private capacity: number;

    constructor(capacity:number = 120) {
        this.queue = new Array<T>(capacity);
        this.head = -1;
        this.tail = -1;
        this.size = 0;
        this.capacity = capacity;
    }

    public getSize():number{
        return this.size
    }
    
    public enqueue(value: T): boolean {
        if (this.isFull()) {
            this.resize(this.capacity * 2); // Resize on full
        }
        this.tail = (this.tail + 1) % this.capacity;
        this.queue[this.tail] = value;
        if (this.head === -1) {
            this.head = this.tail;
        }
        this.size++;
        return true;
    }
    
    public dequeue(): T | null {
        if (this.isEmpty()) {
            console.log("Queue is empty.");
            return null;
        }
        let result = this.queue[this.head];
        this.head = (this.head + 1) % this.capacity;
        this.size--;
        if (this.isEmpty()) {
            this.head = -1;
            this.tail = -1;
        }
        return result;
    }

    public front(): T | null {
        if (this.isEmpty()) {
            return null;
        }
        return this.queue[this.head];
    }

    public rear(): T | null {
        if (this.isEmpty()) {
            return null;
        }
        return this.queue[this.tail];
    }

    public isEmpty(): boolean {
        return this.size === 0;
    }

    public isFull(): boolean {
        return this.size === this.capacity;
    }

    public resize(newCapacity: number): void {
        let temp = new Array<T>(newCapacity);
        for (let i = 0; i < this.size; i++) {
            temp[i] = this.queue[(this.head + i) % this.capacity];
        }
        this.queue = temp;
        this.capacity = newCapacity;
        this.head = 0;
        this.tail = this.size === newCapacity ? 0 : this.size - 1; 
    }

    public clear(): void {
        this.queue = new Array<T>(this.capacity);
        this.head = -1;
        this.tail = -1;
        this.size = 0;
     }
}