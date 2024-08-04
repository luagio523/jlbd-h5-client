// TaskManager.ts
import { GameTask, Task, TaskStatus } from '../task/Task';
import { EventDispatcher } from '../event/EventManager';
import { ConditionFactory,  } from '../task/Condition';
import { ConfigManager } from '../../core/common/config/ConfigManager';
import { IEvent,  RPGEvent } from '../event/Event';

export class TaskManager {
    private tasks: Task[] = [];
    private taskMap: Map<number, GameTask> = new Map();
    private activeTasks: Set<Task> = new Set(); // 用于跟踪进行中的任务
    private eventDispatcher: EventDispatcher;
   
    constructor() {
        this.eventDispatcher = new EventDispatcher();
        this.initializeEventListeners(); // 初始化事件监听
    }

    private initializeEventListeners(): void {
        this.eventDispatcher.on(RPGEvent.KillEvent, this.onTrigger.bind(this));
        this.eventDispatcher.on(RPGEvent.CollectEvent, this.onTrigger.bind(this));
    }

    public addTask(task: Task): void {
        this.tasks.push(task);
        console.log(`任务 "${task.title}" 已添加！`);
    }

    public getAvailableTasks(): Task[] {
        return this.tasks.filter(task => task.status === TaskStatus.NotAccepted && task.prerequisites.every(pre => pre.status === TaskStatus.Completed));
    }

    public acceptTask(taskId: number): void {
        const task = this.tasks.find(t => t.id === taskId);
        if (task && task.status === TaskStatus.NotAccepted) {
            task.status = TaskStatus.InProgress;
            this.activeTasks.add(task); // 将任务添加到活动任务集合
            console.log(`任务 "${task.title}" 已接取！`);
        } else {
            console.log(`任务未找到或已接取！`);
        }
    }

    public completeTask(taskId: number): void {
        const task = this.tasks.find(t => t.id === taskId);
        if (task && task.status === TaskStatus.InProgress) {
            if (task.condition.check()) {
                task.status = TaskStatus.Completed;
                console.log(`任务 "${task.title}" 完成！`);
                this.activeTasks.delete(task); // 从活动任务集合中移除
                this.triggerNextTasks(task); // 触发后续任务
            } else {
                console.log(`任务 "${task.title}" 未完成。`);
            }
        } else {
            console.log(`任务未找到或未接取！`);
        }
    }

    private triggerNextTasks(task: Task): void {
        task.nextTasks.forEach(nextTask => {
            nextTask.status = TaskStatus.NotAccepted; // 解锁后续任务
            console.log(`任务 "${nextTask.title}" 已解锁！`);
        });
    }

    
    
   

    // 获取当前进行中的主线任务
    public getCurrentMainTasks(): Task[] {
        return Array.from(this.activeTasks).filter(task => task.type === 'main');
    }

    // 获取当前进行中的支线任务
    public getCurrentSideTasks(): Task[] {
        return Array.from(this.activeTasks).filter(task => task.type === 'side');
    }
    
    
    public getTaskById(taskId: number): Task | undefined {
        return this.taskMap.get(taskId);
    }

    public async load(jsonPath: string): Promise<void> {
        const tasksConfig = await ConfigManager.getInstance().loadJSON(jsonPath, true);

         // 创建任务实例并添加到 taskMap
         tasksConfig.forEach((taskConfig: any) => {
            const condition = ConditionFactory.createCondition(taskConfig.condition);
            const task = new GameTask(
                taskConfig.id,
                taskConfig.title,
                taskConfig.description,
                taskConfig.type,
                taskConfig.reward,
                condition
            );
            this.taskMap.set(task.id, task);
        });

        // 设置后续任务
        tasksConfig.forEach((taskConfig: any) => {
            const task = this.taskMap.get(taskConfig.id);
            if (task) {
                taskConfig.nextTasks.forEach((nextTaskId: number) => {
                    const nextTask = this.taskMap.get(nextTaskId);
                    if (nextTask) {
                        task.nextTasks.push(nextTask);
                    }
                });
            }
        });
        // 添加任务到 tasks 数组
        this.tasks = Array.from(this.taskMap.values());
    }

    /*****************************************触发任务**************************************************************** */
    
    private onTrigger(evt: IEvent): void {
        this.activeTasks.forEach(task => {
            task.condition.onTrigger(evt); // 触发条件
            if (task.condition.check()) {
                this.completeTask(task.id); // 完成任务
            }
        });
    }
}
