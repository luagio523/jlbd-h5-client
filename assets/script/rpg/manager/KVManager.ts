import { _decorator, Component } from 'cc';
import { KVNode, KVReader } from '../../core/common/reader/KVReader';

const { ccclass, property } = _decorator;

@ccclass('KVManager')
export class KVManager extends Component {
    private static instance: KVManager | null = null;
    private cache: Map<string, KVNode> = new Map();

    public static getInstance(): KVManager {
        if (!KVManager.instance) {
            KVManager.instance = new KVManager();
        }
        return KVManager.instance;
    }

    public async getKVData(filePath: string): Promise<KVNode> {
        if (this.cache.has(filePath)) {
            return this.cache.get(filePath)!;
        }

        const kvData = await KVReader.readKVFile(filePath);
        this.cache.set(filePath, kvData);
        return kvData;
    }

    public async getUnit(unitName: string): Promise<KVNode | undefined> {
        const unitsKV = await this.getKVData('config/npc_units_custom');
        return unitsKV['DOTAUnits'][unitName] as KVNode;
    }

    public async getHero(heroName: string): Promise<KVNode | undefined> {
        let key = 'hero_'+heroName.toLowerCase();
        const heroesKV = await this.getKVData('config/npc_heroes_custom');
        return heroesKV['DOTAHeroes'][key] as KVNode;
    }

    public async getItem(itemName: string): Promise<KVNode | undefined> {        
        const itemsKV = await this.getKVData('config/npc_items_custom');
        return itemsKV['DOTAItems'][itemName] as KVNode;
    }
    
    public async getAbility(abilityName: string): Promise<KVNode | undefined> {
        const abilitiesKV = await this.getKVData('config/npc_abilities_custom');
        return abilitiesKV['DOTAAbilities'][abilityName] as KVNode;
    }

    // 可以添加更多特定的获取方法，如 getItem, getHero 等
}