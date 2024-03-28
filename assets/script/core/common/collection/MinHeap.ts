export class MinHeap<T> {
    public heap: Array<T>;
  
    constructor(private comparator: (a: T, b: T) => number ) {
      this.heap = [];
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
        const temp = this.heap[index1];
        this.heap[index1] = this.heap[index2];
        this.heap[index2] = temp;
    }
  
    private siftUp(index: number): void {
        if (index <= 0) {
            return;
        }
        
        const parentIndex = this.getParentIndex(index);
        if (this.comparator(this.heap[parentIndex], this.heap[index]) > 0) {
            this.swap(parentIndex, index);
            this.siftUp(parentIndex);
        }
    }
  
    private siftDown(index: number): void {
        const leftIndex = this.getLeftIndex(index);
        const rightIndex = this.getRightIndex(index);
        let smallest = index;
  
        if (leftIndex < this.heap.length && this.comparator(this.heap[leftIndex], this.heap[index]) < 0) {
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
        this.heap[0] = this.heap[this.heap.length - 1];
        this.heap.pop();
        this.siftDown(0);
        return root;
    }
  
    public size(): number {
        return this.heap.length;
    }
  
    public isEmpty(): boolean {
        return this.size() === 0;
    }
  }