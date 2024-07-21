export class MinHeap<T> {
    private heap: Array<T>;
    private comparator: (a: T, b: T) => number;

    constructor(comparator: (a: T, b: T) => number) {
        this.heap = [];
        this.comparator = comparator;
    }

    private getParentIndex(i: number): number {
        return Math.floor((i - 1) / 2);
    }

    private getLeftIndex(i: number): number {
        return 2 * i + 1;
    }

    private getRightIndex(i: number): number {
        return 2 * i + 2;
    }

    private swap(index1: number, index2: number): void {
        [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
    }

    private siftUp(index: number): void {
        let parentIndex = this.getParentIndex(index);
        while (index > 0 && this.comparator(this.heap[parentIndex], this.heap[index]) > 0) {
            this.swap(parentIndex, index);
            index = parentIndex;
            parentIndex = this.getParentIndex(index);
        }
    }

    private siftDown(index: number): void {
        let leftIndex = this.getLeftIndex(index);
        let rightIndex = this.getRightIndex(index);
        let smallest = index;

        if (leftIndex < this.heap.length && this.comparator(this.heap[leftIndex], this.heap[smallest]) < 0) {
            smallest = leftIndex;
        }
        if (rightIndex < this.heap.length && this.comparator(this.heap[rightIndex], this.heap[smallest]) < 0) {
            smallest = rightIndex;
        }
        if (smallest !== index) {
            this.swap(smallest, index);
            this.siftDown(smallest);
        }
    }

    public insert(value: T): void {
        this.heap.push(value);
        this.siftUp(this.heap.length - 1);
    }

    public peek(): T | undefined {
        return this.heap[0];
    }

    public pop(): T | undefined {
        if (this.heap.length === 0) {
            return undefined;
        }

        const root = this.heap[0];
        const last = this.heap.pop();
        if (this.heap.length > 0 && last !== undefined) {
            this.heap[0] = last;
            this.siftDown(0);
        }
        return root;
    }

    public size(): number {
        return this.heap.length;
    }

    public isEmpty(): boolean {
        return this.heap.length === 0;
    }

    public clear(): void {
        this.heap = [];
    }

    public toArray(): T[] {
        return [...this.heap];
    }

    public buildHeap(array: T[]): void {
        this.heap = array;
        for (let i = this.getParentIndex(this.heap.length - 1); i >= 0; i--) {
            this.siftDown(i);
        }
    }
}
