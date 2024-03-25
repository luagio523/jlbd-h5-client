interface DelayTask {
    id: number;
    callback: () => void;
    untilTime: number;
}

export class DelayTimer {
    private taskHeap: MinHeap<DelayTask> = new MinHeap((a, b) => a.untilTime - b.untilTime); 
    private nextId: number = 0; // 下一个任务的 ID
    private elapsedTime: number = 0;
    private taskIdMap: Map<number, DelayTask> = new Map(); 
    private idleTasks: Array<DelayTask> = []; // 可复用的任务

    // 添加任务，重用空闲任务或创建新任务
    addTask(callback: () => void, delay: number): number {
        let task: DelayTask = this.idleTasks.pop() || { id: 0, callback: undefined, untilTime: 0 };
        task.id = this.nextId++;
        task.callback = callback;
        task.untilTime = this.elapsedTime + delay;

        this.taskIdMap.set(task.id, task);
        this.taskHeap.insert(task);
        return task.id;
    }

    // 更新任务
    update(deltaTime: number): void {
        this.elapsedTime += deltaTime;
        while (this.taskHeap.peek() && this.taskHeap.peek().untilTime <= this.elapsedTime) {
            const task = this.taskHeap.pop();
            if (task) {
                task.callback();
                this.taskIdMap.delete(task.id);
                this.idleTasks.push(task);
            }
        }
    }

    // 取消任务
    cancelTask(id: number): void {
        const task = this.taskIdMap.get(id);
        if (task) {
            task.untilTime = Number.MAX_VALUE;
            this.taskHeap = new MinHeap<DelayTask>((a, b) => a.untilTime - b.untilTime);
            this.idleTasks.push(task);
            this.taskIdMap.delete(task.id);

            for (const t of this.taskIdMap.values()) {
                this.taskHeap.insert(t);
            }
        }
    }
}