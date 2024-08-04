import { Enum } from "cc";


export enum RandomType {
    none,
    independent,
    weight,
}

export interface DropItem {
    id: number;
    rate: number; // 权重/概率
    type: number; // 物品类型
    amount?: number; // 数量或金额
}
export interface DropItemGroup {
    id: number; // 物品组ID
    items: DropItem[];
    rate: number; // 掉落组概率
    randomType: RandomType; // 随机方式
    cachedItemRate?: number; // 缓存的物品总权重
    ruler?: string; //规则
}
export interface DropGroup {
    id: number; // 掉落组ID
    itemGroups: DropItemGroup[];
    randomType: RandomType; // 随机方式
    cachedGroupRate?: number; // 缓存的掉落组总概率
}



