export class RedDotManager {
	private static instance: RedDotManager;
	private redDotTree: RedDotTree;

	private constructor() {
		this.redDotTree = new RedDotTree();
	}

	static getInstance(): RedDotManager {
		if (!RedDotManager.instance) {
			RedDotManager.instance = new RedDotManager();
		}
		return RedDotManager.instance;
	}

	updateRedDot(path: string, value: number): void {
		this.redDotTree.updateNode(path, value);
	}

	getRedDotValue(path: string): number {
		return this.redDotTree.getValue(path);
	}

	subscribeRedDot(path: string, callback: RedDotCallback): () => void {
		return this.redDotTree.subscribe(path, callback);
	}

	clearRedDot(path: string): void {
		this.redDotTree.clearNode(path);
	}

	getAllRedDotValues(): Record<string, number> {
		return this.redDotTree.getAllValues();
	}

	resetRedDotSystem(): void {
		this.redDotTree.reset();
	}

	saveRedDotState(): string {
		return this.redDotTree.getState();
	}

	loadRedDotState(state: string): void {
		this.redDotTree.loadState(state);
	}

	batchUpdateRedDots(updates: Record<string, number>): void {
		for (const path in updates) {
			this.updateRedDot(path, updates[path]);
		}
	}
}
  
//   // 使用示例
//   const redDotManager = RedDotManager.getInstance();
  
//   // 更新红点
//   redDotManager.updateRedDot('mail.unread', 5);
//   redDotManager.updateRedDot('quest.daily', 3);
//   redDotManager.updateRedDot('quest.weekly', 1);
  
//   // 获取红点值
//   console.log(redDotManager.getRedDotValue('mail')); // 5
//   console.log(redDotManager.getRedDotValue('quest')); // 4
  
//   // 订阅红点变化
//   const unsubscribe = redDotManager.subscribeRedDot('quest', (value) => {
// 	console.log('Quest red dot value changed:', value);
//   });
  
//   redDotManager.updateRedDot('quest.daily', 4);
//   // 输出: Quest red dot value changed: 5
  
//   // 取消订阅
//   unsubscribe();
  
//   // 清除红点
//   redDotManager.clearRedDot('mail.unread');
  
//   // 获取所有红点值
//   console.log(redDotManager.getAllRedDotValues());
  
//   // 重置红点系统
//   redDotManager.resetRedDotSystem();
  
//   // 保存和加载红点状态
//   const state = redDotManager.saveRedDotState();
//   redDotManager.loadRedDotState(state);
  
//   // 批量更新红点
//   redDotManager.batchUpdateRedDots({
// 	'mail.unread': 2,
// 	'quest.daily': 1,
// 	'quest.weekly': 0
//   });