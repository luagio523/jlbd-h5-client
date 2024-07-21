


export class CircularQueue<T> {
    private queue: Array<T | undefined>;
    private head: number;
    private tail: number;
    private _size: number;
    private capacity: number;

    constructor(capacity: number = 120) {
        if (capacity <= 0) {
            throw new Error("Capacity must be a positive number");
        }
        this.queue = new Array<T | undefined>(capacity);
        this.head = 0;
        this.tail = 0;
        this._size = 0;
        this.capacity = capacity;
    }

    public getSize(): number {
        return this._size;
    }
    
    public enqueue(value: T): boolean {
        if (this.isFull()) {
            this.resize(this.capacity * 2);
        }
        this.queue[this.tail] = value;
        this.tail = (this.tail + 1) % this.capacity;
        this._size++;
        return true;
    }
    
    public dequeue(): T | undefined {
        if (this.isEmpty()) {
            return undefined;
        }
        const result = this.queue[this.head];
        this.queue[this.head] = undefined; // Clear the reference
        this.head = (this.head + 1) % this.capacity;
        this._size--;
        return result;
    }

    public front(): T | undefined {
        return this.isEmpty() ? undefined : this.queue[this.head];
    }

    public rear(): T | undefined {
        return this.isEmpty() ? undefined : this.queue[(this.tail - 1 + this.capacity) % this.capacity];
    }

    public isEmpty(): boolean {
        return this._size === 0;
    }

    public isFull(): boolean {
        return this._size === this.capacity;
    }

    private resize(newCapacity: number): void {
        if (newCapacity < this._size) {
            throw new Error("New capacity is too small");
        }
        const newQueue = new Array<T | undefined>(newCapacity);
        for (let i = 0; i < this._size; i++) {
            newQueue[i] = this.queue[(this.head + i) % this.capacity];
        }
        this.queue = newQueue;
        this.capacity = newCapacity;
        this.head = 0;
        this.tail = this._size;
    }

    public clear(): void {
        this.queue = new Array<T | undefined>(this.capacity);
        this.head = 0;
        this.tail = 0;
        this._size = 0;
    }

    public toArray(): T[] {
        const result: T[] = [];
        for (let i = 0; i < this._size; i++) {
            const item = this.queue[(this.head + i) % this.capacity];
            if (item !== undefined) {
                result.push(item);
            }
        }
        return result;
    }

    public forEach(callback: (value: T, index: number) => void): void {
        for (let i = 0; i < this._size; i++) {
            const item = this.queue[(this.head + i) % this.capacity];
            if (item !== undefined) {
                callback(item, i);
            }
        }
    }
}
