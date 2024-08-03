
import { _decorator, Component, resources } from 'cc';
import { ConfigManager } from '../../core/common/config/ConfigManager';
import { DropGroup, DropItem, DropItemGroup, RandomType } from './Drop';
const { ccclass } = _decorator;



export class DropManager {
    private static instance: DropManager;
    private configs: DropGroup[];
    private timeRuleValidator: TimeRuleValidator;

    public static getInstance(): DropManager {
        if (!DropManager.instance) {
            DropManager.instance = new DropManager();
        }
        return DropManager.instance;
    }

    public constructor() {
        this.configs = [];
        this.timeRuleValidator = new TimeRuleValidator();
    }

    public async load(jsonPath: string) {
        let jsonAsset = await ConfigManager.getInstance().loadJSON(jsonPath, true);
        const dropsConfig: any = jsonAsset.json; // 获取 JSON 数据
        this.configs = dropsConfig;
        this.cacheGroupProbabilities();
        this.cacheItemProbabilities();
    }

    private cacheGroupProbabilities(): void {
        for (const config of this.configs) {
            let totalGroupProbability = 0;
            for (const group of config.itemGroups) {
                if (group.randomType === RandomType.weight) {
                    totalGroupProbability += group.rate;
                }
            }
            config.cachedGroupRate = totalGroupProbability;
        }
    }

    private cacheItemProbabilities(): void {
        for (const config of this.configs) {
            for (const group of config.itemGroups) {
                // 仅在 randomType 为 weight 时缓存物品总权重
                if (group.randomType === RandomType.weight) {
                    let totalItemProbability = 0;
                    for (const item of group.items) {
                        totalItemProbability += item.rate;
                    }
                    group.cachedItemRate = totalItemProbability;
                }
            }
        }
    }

    public dropItems(configId: string): DropItem[] {
        const config = this.configs.find(c => c.id === configId);
        if (!config) return [];

        const droppedItems: DropItem[] = [];

        for (const group of config.itemGroups) {
            const random = Math.random() * (config.cachedGroupRate || 1);
            let cumulativeGroupProbability = 0;

            if (group.randomType === RandomType.weight) {
                cumulativeGroupProbability += group.rate;
                if (random < cumulativeGroupProbability) {
                    const itemsDropped = this.selectItemFromGroup(group);
                    droppedItems.push(...itemsDropped);
                }
            }
        }

        return droppedItems;
    }

    private selectItemFromGroup(group: DropItemGroup): DropItem[] {
        const droppedItems: DropItem[] = [];
        let cumulativeItemProbability = 0;

        // 仅在 randomType 为 weight 时使用 cachedItemRate
        if (group.randomType === RandomType.weight) {
            for (const item of group.items) {
                cumulativeItemProbability += item.rate;
                if (Math.random() < (item.rate / (group.cachedItemRate || 1))) {
                    droppedItems.push({ ...item });
                }
            }
        } else if (group.randomType === RandomType.independent || group.randomType === RandomType.independentMultiple) {
            // 对于独立随机，直接使用 item.rate
            for (const item of group.items) {
                if (Math.random() < (item.rate / 100)) { // 假设 rate 是 0-100
                    droppedItems.push({ ...item });
                }
            }
        }

        const mergedItems: DropItem[] = [];
        const itemMap: { [key: string]: DropItem } = {};

        for (const item of droppedItems) { // 合并相同物品
            if (itemMap[item.id]) {
                itemMap[item.id].amount = (itemMap[item.id].amount || 1) + (item.amount || 1);
            } else {
                itemMap[item.id] = { ...item, amount: item.amount || 1 };
                mergedItems.push(itemMap[item.id]);
            }
        }

        return mergedItems;
    }


    /**
     * 根据规则判定是否在时间范围内
     * @param ruler 
     * @param currentDate 
     * @returns 
     */
    public isTimeInRange(ruler: string, currentDate: Date): boolean {
        return this.timeRuleValidator.isTimeInRange(ruler, currentDate);
    }
}


// export class DropManager   {
//     private static instance: DropManager;
//     private configs: DropConfig[];

//     public static getInstance(): DropManager {
//         if (!DropManager.instance) {
//             DropManager.instance = new DropManager();
//         }
//         return DropManager.instance;
//     }
//     public constructor() {
//         this.configs = [];
//     }
 
//     public async load(jsonPath:string) {
//         let jsonAsset = await ConfigManager.getInstance().loadJSON(jsonPath, true);

//         const dropsConfig:any = jsonAsset.json; // 获取 JSON 数据

//         this.configs = dropsConfig

//         this.cacheGroupProbabilities();
//         this.cacheItemProbabilities();
//     }

//     private cacheGroupProbabilities(): void {
//         for (const config of this.configs) {
//             const totalGroupProbability = config.groups.reduce((total, group) => total + group.probability, 0);
//             config.cachedGroupProbability = totalGroupProbability;
//         }
//     }

//     private cacheItemProbabilities(): void {
//         for (const config of this.configs) {
//             for (const group of config.groups) {
//                 const totalItemProbability = group.items.reduce((total, item) => total + item.weight, 0);
//                 group.cachedItemProbability = totalItemProbability;
//             }
//         }
//     }

//     public dropItems(configId: string): DropItem[] {
//         const config = this.configs.find(c => c.id === configId);
//         if (!config) return [];

//         const droppedItems: DropItem[] = [];
//         const totalGroupProbability = config.cachedGroupProbability || 0;

//         for (const group of config.groups) {
//             const random = Math.random() * totalGroupProbability;
//             let cumulativeGroupProbability = 0;

//             cumulativeGroupProbability += group.probability;
//             if (random < cumulativeGroupProbability) {
//                 const itemsDropped = this.selectItemFromGroup(group);
//                 droppedItems.push(...itemsDropped);
//             }
//         }

//         return droppedItems;
//     }

//     private selectItemFromGroup(group: DropGroup): DropItem[] {
//         const droppedItems: DropItem[] = [];
      
//         let cumulativeItemProbability = 0;

//         if (group.randomType === 'independent') {
//             for (const item of group.items) {
//                 cumulativeItemProbability += item.weight;
//                 if (Math.random() < (item.weight / (group.cachedItemProbability || 1))) {
//                     droppedItems.push({ ...item });
//                 }
//             }
//         } else if (group.randomType === 'roundTable') {
//             const itemRandom = Math.random() * (group.cachedItemProbability || 0);
//             const totalItems = group.items.length;
//             const index = Math.floor(itemRandom / (group.cachedItemProbability || 1) * totalItems);
//             const droppedItem = group.items[index];
//             if (droppedItem) {
//                 droppedItems.push({ ...droppedItem });
//             }
//         } else if (group.randomType === 'independentMultiple') {
//             for (const item of group.items) {
//                 cumulativeItemProbability += item.weight;
//                 if (Math.random() < (item.weight / (group.cachedItemProbability || 1))) {
//                     droppedItems.push({ ...item });
//                 }
//             }
//         }

//         const mergedItems: DropItem[] = [];
//         const itemMap: { [key: string]: DropItem } = {};

//         for (const item of droppedItems) { //合并相同物品
//             if (itemMap[item.id]) {
//                 itemMap[item.id].amount = (itemMap[item.id].amount || 1) + (item.amount || 1);
//             } else {
//                 itemMap[item.id] = { ...item, amount: item.amount || 1 };
//                 mergedItems.push(itemMap[item.id]);
//             }
//         }

//         return mergedItems;
//     }
// }