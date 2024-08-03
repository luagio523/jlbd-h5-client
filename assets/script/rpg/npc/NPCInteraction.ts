import { TriggerCondition } from "../trigger/Trigger";

export class NPCInteraction {
	segmentId: string; // 语段
	condition: TriggerCondition; // 使用触发条件
	priority: number; // 优先级
	constructor( condition: TriggerCondition, priority:number, segmentId: string) {
		this.condition = condition;
		this.segmentId = segmentId;
		this.priority = priority;
	 }
}