import { Enum } from "cc";


export enum RandomType {
    none,
    independent,
    weight,
    independentMultiple,
}

export interface DropItem {
    id: string;
    rate: number; // 权重/概率
    type: number; // 物品类型
    amount?: number; // 数量或金额
}
export interface DropItemGroup {
    id: string;
    items: DropItem[];
    rate: number; // 掉落组概率
    randomType: RandomType; // 随机方式
    cachedItemRate?: number; // 缓存的物品总权重
    ruler?: string; //规则
}
export interface DropGroup {
    id: string;
    itemGroups: DropItemGroup[];
    cachedGroupRate?: number; // 缓存的掉落组总概率
}



