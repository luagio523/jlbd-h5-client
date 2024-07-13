// 枚举类型定义
export enum ItemType {
    NONE = 0,
    CONSUMABLE = 1,
    WEAPON = 2,
    ARMOR = 3,
    ACCESSORY = 4,
    RECIPE = 5
}

export enum ItemAttributeType {
    STRENGTH = 0,
    AGILITY = 1,
    INTELLIGENCE = 2,
    HEALTH = 3,
    MANA = 4,
    ARMOR = 5,
    ATTACK_DAMAGE = 6,
    ATTACK_SPEED = 7,
    MOVEMENT_SPEED = 8,
    MAGIC_RESISTANCE = 9
}

export enum InventorySlot {
    ITEM_SLOT_1 = 0,
    ITEM_SLOT_2 = 1,
    ITEM_SLOT_3 = 2,
    ITEM_SLOT_4 = 3,
    ITEM_SLOT_5 = 4,
    ITEM_SLOT_6 = 5,
    ITEM_SLOT_7 = 6,
    ITEM_SLOT_8 = 7,
    ITEM_SLOT_9 = 8,
    STASH_SLOT_1 = 9,
    STASH_SLOT_2 = 10,
    STASH_SLOT_3 = 11,
    STASH_SLOT_4 = 12,
    STASH_SLOT_5 = 13,
    STASH_SLOT_6 = 14,
    ITEM_TP_SCROLL = 15,
    ITEM_NEUTRAL_SLOT = 16,
    ITEM_TRANSIENT_ITEM = 17,
    ITEM_TRANSIENT_RECIPE = 18,
    ITEM_TRANSIENT_CAST_ITEM = 20,
}