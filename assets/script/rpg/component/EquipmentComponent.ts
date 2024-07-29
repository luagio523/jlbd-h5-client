import { ItemKV } from "../data/kv/ItemKV";
import { ECSComponent } from "../ecs/ECSComponent";
import { InventorySlot } from "../enum/Item";
import { ecsclass } from "../ecs/__private";


ecsclass("EquipmentComponent")
export class EquipmentComponent extends ECSComponent {
    private equipment: Map<InventorySlot, ItemKV | null> = new Map<InventorySlot, ItemKV | null>();

    constructor() {
        super();
        this.initializeEquipment();
    }

    private initializeEquipment(): void {
        Object.keys(InventorySlot).forEach((key) => {
            const slot = InventorySlot[key as keyof typeof InventorySlot];
            if (typeof slot === 'number') {
                this.equipment.set(slot, null);
            }
        });
    }

    public equip(item: ItemKV): boolean {
        const slot = item.GetItemSlots()[0];
        if (this.canEquip(slot)) {
            this.unequip(slot);
            this.equipment.set(slot, item);
            return true;
        }
        return false;
    }

    public unequip(slot: InventorySlot): void {
        this.equipment.set(slot, null);
    }

    public getEquippedItem(slot: InventorySlot): ItemKV | null {
        return this.equipment.get(slot) || null;
    }

    public canEquip(slot: InventorySlot): boolean {
        return this.equipment.get(slot) === null;
    }

    // public updateHeroAttributes(heroData: HeroData): void {
    //     for (const [slot, item] of this.equipment) {
    //         if (item) {
    //             this.applyItemAttributes(heroData, item);
    //         }
    //     }
    // }

    // private applyItemAttributes(heroData: HeroData, item: ItemKV): void {
    //     for (const { attribute, value } of item.GetItemAttributes()) {
    //         switch (attribute) {
    //             case ItemAttribute.STRENGTH:
    //                 heroData.SetBaseStrength(heroData.GetBaseStrength() + value);
    //                 break;
    //             case ItemAttribute.AGILITY:
    //                 heroData.SetBaseAgility(heroData.GetBaseAgility() + value);
    //                 break;
    //             case ItemAttribute.INTELLIGENCE:
    //                 heroData.SetBaseIntelligence(heroData.GetBaseIntelligence() + value);
    //                 break;
    //             // 添加其他属性的应用逻辑
    //         }
    //     }
    // }
}