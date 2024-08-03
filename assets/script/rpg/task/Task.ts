import { ITaskCondition } from "./Condition";

// TaskStatus.ts
export enum TaskStatus {
    Locked,      // 任务被锁定，无法接取
    NotAccepted, // 任务未接取
    InProgress,  // 任务进行中
    Completed,   // 任务已完成
    Failed       // 任务失败
}



export interface Reward {
    experience: number;
    gold: number;
    items: string[];
}

export interface Task {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    type: 'main' | 'side';
    reward: Reward;
    prerequisites: Task[]; // 前置任务
    nextTasks: Task[]; // 后续任务
    condition: ITaskCondition; // 完成条件
    complete(): void; // 完成任务的方法
}


export class GameTask implements Task {
    public status: TaskStatus = TaskStatus.Locked;
    public prerequisites: Task[] = [];
    public nextTasks: Task[] = [];

    constructor(
        public id: number,
        public title: string,
        public description: string,
        public type: 'main' | 'side',
        public reward: Reward,
        public condition: ITaskCondition // 直接持有条件实例
    ) {}

    public complete(): void {
        if (this.condition.check()) {
            this.status = TaskStatus.Completed;
            console.log(`任务 "${this.title}" 完成！`);
        } else {
            console.log(`任务 "${this.title}" 未完成。`);
        }
    }
}
