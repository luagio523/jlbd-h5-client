import { DataReader } from "../ability/DataReader";
import { InventorySlot, ItemAttributeType } from "../enum/Item";
import { ItemType } from "../item/Item";

export class ItemData extends DataReader {
    protected itemName: string;
    protected itemId: number;
    protected itemType: ItemType;
    protected itemCost: number;
    protected itemDescription: string;
    protected itemIcon: string;
    protected itemAttributes: ItemAttribute[];
    protected itemRecipe: string[];
    protected itemComponents: string[];
    protected itemSlots: InventorySlot[];

    public deserialize(data: any): void {
        this.itemName = data.ItemName;
        this.itemId = data.ItemID;
        this.itemType = this.parseEnumValue(ItemType, data.ItemType);
        this.itemCost = parseFloat(data.ItemCost);
        this.itemDescription = data.ItemDescription;
        this.itemIcon = data.ItemIcon;

        this.itemAttributes = this.parseItemAttributeTypes(data.ItemAttributeTypes);
        this.itemRecipe = data.ItemRecipe ? data.ItemRecipe.split(',') : [];
        this.itemComponents = data.ItemComponents ? data.ItemComponents.split(',') : [];
        this.itemSlots = this.parseItemSlots(data.ItemSlots);
    }

    private parseItemAttributeTypes(attributesData: any): ItemAttribute[] {
        const attributes: ItemAttribute[] = [];
        for (const key in attributesData) {
            if (attributesData.hasOwnProperty(key)) {
                const attribute = this.parseEnumValue(ItemAttributeType, key);
                const value = parseFloat(attributesData[key]);
                attributes.push({ attribute, value });
            }
        }
        return attributes;
    }

    private parseItemSlots(slotsData: string): InventorySlot[] {
        const slots: InventorySlot[] = [];
        const slotStrings = slotsData.split(',');
        for (const slotString of slotStrings) {
            slots.push(this.parseEnumValue(InventorySlot, slotString));
        }
        return slots;
    }

    public GetItemName(): string {
        return this.itemName;
    }

    public GetItemId(): number {
        return this.itemId;
    }

    public GetItemType(): ItemType {
        return this.itemType;
    }

    public GetItemCost(): number {
        return this.itemCost;
    }

    public GetItemDescription(): string {
        return this.itemDescription;
    }

    public GetItemIcon(): string {
        return this.itemIcon;
    }

    public GetItemAttributeTypes(): ItemAttribute[] {
        return this.itemAttributes;
    }

    public GetItemRecipe(): string[] {
        return this.itemRecipe;
    }

    public GetItemComponents(): string[] {
        return this.itemComponents;
    }

    public GetItemSlots(): InventorySlot[] {
        return this.itemSlots;
    }
}



export interface ItemAttribute {
    attribute: ItemAttributeType;
    value: number;
}