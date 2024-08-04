import { _decorator, Component, resources } from 'cc';
import { ConfigManager } from '../../core/common/config/ConfigManager';
import { DropGroup, DropItem, DropItemGroup, RandomType } from './Drop';
import { ProbabilityCalculator } from '../calculator/ProbabilityCalculator';
const { ccclass } = _decorator;

export class DropManager {
    private static instance: DropManager;
    private dropGroups: Map<number, DropGroup>; // 使用 number 作为键
    private itemGroups: Map<number, DropItemGroup>; // 存储物品组
    private timeRuleValidator: TimeRuleValidator;
    private probabilityCalculator: ProbabilityCalculator;

    public static getInstance(): DropManager {
        if (!DropManager.instance) {
            DropManager.instance = new DropManager();
        }
        return DropManager.instance;
    }

    public constructor() {
        this.dropGroups = new Map();
        this.itemGroups = new Map(); // 初始化物品组 Map
        this.timeRuleValidator = new TimeRuleValidator();
    }

    public async load(dropGroupPath: string, dropItemGroupPath: string) {
        const [dropGroupConfig, dropItemGroupConfig] = await Promise.all([
            ConfigManager.getInstance().loadJSON(dropGroupPath, true),
            ConfigManager.getInstance().loadJSON(dropItemGroupPath, true)
        ]);

        this.loadDropGroupConfig(dropGroupConfig);
        this.loadDropItemGroupConfig(dropItemGroupConfig);

        this.cacheGroupProbabilities();
        this.cacheItemProbabilities();
    }

    private loadDropGroupConfig(config: any[]): void {
        config.forEach((group: DropGroup) => {
            this.dropGroups.set(group.id, group); // 使用 number 作为键
        });
    }

    private loadDropItemGroupConfig(config: any[]): void {
        config.forEach((itemGroup: DropItemGroup) => {
            this.itemGroups.set(itemGroup.id, itemGroup); // 将物品组存储到 itemGroups Map
        });

        // 现在将物品组与对应的 DropGroup 关联起来
        this.dropGroups.forEach((group) => {
            group.itemGroups.forEach((itemGroupRef) => {
                const itemGroup = this.itemGroups.get(itemGroupRef.id);
                if (itemGroup) {
                    itemGroupRef.items = itemGroup.items; // 将物品组中的物品添加到 itemGroupRef 中
                    itemGroupRef.randomType = itemGroup.randomType; // 将 DropGroup 的 randomType 赋值给 itemGroupRef
                    itemGroupRef.ruler = itemGroup.ruler; // 将 DropGroup 的 ruler 赋值给 itemGroupRef
                }
            });
        });
    }

    private cacheGroupProbabilities(): void {
        for (const config of this.dropGroups.values()) {
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
        for (const config of this.dropGroups.values()) {
            for (const group of config.itemGroups) {
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

    public dropItems(configId: number): DropItem[] {
        const config = this.dropGroups.get(configId);
        if (!config) return [];

        const droppedItems: DropItem[] = [];

        // 首先判断随机方式
        if (config.randomType === RandomType.weight) {
            // 权重随机：选择一个 itemGroup
            const selectedGroup = this.selectWeightedGroup(config.itemGroups, group => group.rate,config.cachedGroupRate);
            if (selectedGroup) {
                const itemsDropped = this.selectItemFromGroup(selectedGroup);
                droppedItems.push(...itemsDropped);
            }
        } else if (config.randomType === RandomType.independent ) {
            // 独立随机：遍历每个 itemGroup
            for (const group of config.itemGroups) {
                if (this.shouldDropItem(group.rate)) { // 假设 group.rate 是 0-100
                    // 如果选择该组，掉落物品
                    const itemsDropped = this.selectItemFromGroup(group);
                    droppedItems.push(...itemsDropped);
                }
            }
        }

        return droppedItems;
    }

    // 通用的权重选择方法
    private selectWeightedGroup<T>(items: T[], getRate: (item: T) => number, totalWeight?: number): T | null {
        return this.probabilityCalculator.selectWeightedGroup<T>(items, getRate, totalWeight);
    }

    // 提取出判断物品是否掉落的方法
    private shouldDropItem(rate: number): boolean {
        return this.probabilityCalculator.roll(rate);
    }

    private selectItemFromGroup(group: DropItemGroup): DropItem[] {
        const droppedItems: DropItem[] = [];

        if (group.randomType === RandomType.weight) {
            // 使用通用权重选择逻辑
            const selectedItem = this.selectWeightedGroup(group.items, item => item.rate,group.cachedItemRate);
            if (selectedItem) {
                droppedItems.push({ ...selectedItem });
            }
        } else if (group.randomType === RandomType.independent ) {
            for (const item of group.items) {
                if (this.shouldDropItem(item.rate)) { // 使用提取的方法判断是否掉落
                    droppedItems.push({ ...item });
                }
            }
        }

        return this.mergeDroppedItems(droppedItems);
    }

    

    // 合并相同物品的方法
    private mergeDroppedItems(droppedItems: DropItem[]): DropItem[] {
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



// import { _decorator } from 'cc';
// import { ConfigManager } from '../../core/common/config/ConfigManager';
// import { DropGroup, DropItem, DropItemGroup, RandomType } from './Drop';
// const { ccclass } = _decorator;

// export class DropManager {
//     private static instance: DropManager;
//     private dropGroups: Map<number, DropGroup>; // 使用 number 作为键
//     private itemGroups: Map<number, DropItemGroup>; // 存储物品组
//     private timeRuleValidator: TimeRuleValidator;

//     public static getInstance(): DropManager {
//         if (!DropManager.instance) {
//             DropManager.instance = new DropManager();
//         }
//         return DropManager.instance;
//     }

//     public constructor() {
//         this.dropGroups = new Map();
//         this.itemGroups = new Map(); // 初始化物品组 Map
//         this.timeRuleValidator = new TimeRuleValidator();
//     }

//     public async load(dropGroupPath: string, dropItemGroupPath: string) {
//         const [dropGroupConfig, dropItemGroupConfig] = await Promise.all([
//             ConfigManager.getInstance().loadJSON(dropGroupPath, true),
//             ConfigManager.getInstance().loadJSON(dropItemGroupPath, true)
//         ]);

//         this.loadDropGroupConfig(dropGroupConfig);
//         this.loadDropItemGroupConfig(dropItemGroupConfig);

//         this.cacheGroupProbabilities();
//         this.cacheItemProbabilities();
//     }

//     private loadDropGroupConfig(config: any[]): void {
//         config.forEach((group: DropGroup) => {
//             this.dropGroups.set(group.id, group); // 使用 number 作为键
//         });
//     }

//     private loadDropItemGroupConfig(config: any[]): void {
//         config.forEach((itemGroup: DropItemGroup) => {
//             this.itemGroups.set(itemGroup.id, itemGroup); // 将物品组存储到 itemGroups Map
//         });

//         // 现在将物品组与对应的 DropGroup 关联起来
//         this.dropGroups.forEach((group) => {
//             group.itemGroups.forEach((itemGroupRef) => {
//                 const itemGroup = this.itemGroups.get(itemGroupRef.id);
//                 if (itemGroup) {
//                     itemGroupRef.items = itemGroup.items; // 将物品组中的物品添加到 itemGroupRef 中
//                     itemGroupRef.randomType = itemGroup.randomType; // 将 DropGroup 的 randomType 赋值给 itemGroupRef
//                     itemGroupRef.ruler = itemGroup.ruler; // 将 DropGroup 的 ruler 赋值给 itemGroupRef
//                 }
//             });
//         });
//     }

//     private cacheGroupProbabilities(): void {
//         for (const config of this.dropGroups.values()) {
//             let totalGroupProbability = 0;
//             for (const group of config.itemGroups) {
//                 if (group.randomType === RandomType.weight) {
//                     totalGroupProbability += group.rate;
//                 }
//             }
//             config.cachedGroupRate = totalGroupProbability;
//         }
//     }

//     private cacheItemProbabilities(): void {
//         for (const config of this.dropGroups.values()) {
//             for (const group of config.itemGroups) {
//                 if (group.randomType === RandomType.weight) {
//                     let totalItemProbability = 0;
//                     for (const item of group.items) {
//                         totalItemProbability += item.rate;
//                     }
//                     group.cachedItemRate = totalItemProbability;
//                 }
//             }
//         }
//     }

//     public dropItems(configId: number): DropItem[] {
//         const config = this.dropGroups.get(configId);
//         if (!config) return [];
    
//         const droppedItems: DropItem[] = [];
    
//         // 首先判断随机方式
//         if (config.randomType === RandomType.weight) {
//             // 权重随机：选择一个 itemGroup
//             const random = Math.random() * (config.cachedGroupRate || 1);
//             let cumulativeGroupProbability = 0;
    
//             for (const group of config.itemGroups) {
//                 cumulativeGroupProbability += group.rate;
//                 if (random < cumulativeGroupProbability) {
//                     // 选择这个组并掉落物品
//                     const itemsDropped = this.selectItemFromGroup(group);
//                     droppedItems.push(...itemsDropped);
//                     break; // 找到一个组后退出循环
//                 }
//             }
//         } else if (config.randomType === RandomType.independent ) {
//             // 独立随机：遍历每个 itemGroup
//             for (const group of config.itemGroups) {
//                 // 使用统一的方法来判断是否选择该组
//                 if (this.shouldDropItem(group.rate)) {
//                     // 如果选择该组，掉落物品
//                     const itemsDropped = this.selectItemFromGroup(group);
//                     droppedItems.push(...itemsDropped);
//                 }
//             }
//         }
    
//         return droppedItems;
//     }

//     private selectItemFromGroup(group: DropItemGroup): DropItem[] {
//         const droppedItems: DropItem[] = [];

//         if (group.randomType === RandomType.weight) {
//             let cumulativeItemProbability = 0;
//             const random = Math.random() * (group.cachedItemRate || 1);
//             for (const item of group.items) {
//                 cumulativeItemProbability += item.rate;
//                 if (random < cumulativeItemProbability) {
//                     droppedItems.push({ ...item });
//                 }
//             }
//         } else if (group.randomType === RandomType.independent ) {
//             for (const item of group.items) {
//                 if (this.shouldDropItem(item.rate)) { // 使用提取的方法判断是否掉落
//                     droppedItems.push({ ...item });
//                 }
//             }
//         }

//         return this.mergeDroppedItems(droppedItems);
//     }

//     // 提取出判断物品是否掉落的方法
//     private shouldDropItem(rate: number): boolean {
//         return Math.random() < (rate / 100); // 假设 rate 是 0-100
//     }

//     // 合并相同物品的方法
//     private mergeDroppedItems(droppedItems: DropItem[]): DropItem[] {
//         const mergedItems: DropItem[] = [];
//         const itemMap: { [key: string]: DropItem } = {};

//         for (const item of droppedItems) { // 合并相同物品
//             if (itemMap[item.id]) {
//                 itemMap[item.id].amount = (itemMap[item.id].amount || 1) + (item.amount || 1);
//             } else {
//                 itemMap[item.id] = { ...item, amount: item.amount || 1 };
//                 mergedItems.push(itemMap[item.id]);
//             }
//         }

//         return mergedItems;
//     }

//     /**
//      * 根据规则判定是否在时间范围内
//      * @param ruler 
//      * @param currentDate 
//      * @returns 
//      */
//     public isTimeInRange(ruler: string, currentDate: Date): boolean {
//         return this.timeRuleValidator.isTimeInRange(ruler, currentDate);
//     }
// }

