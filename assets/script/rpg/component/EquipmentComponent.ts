import { ECSComponent } from "../ecs/ECSComponent";
import { Equipment } from "../item/Equipment";

export class EquipmentComponent extends ECSComponent {
    public weapons: Array<Equipment> = [];
    public armors: Array<Equipment> = [];
    public accessories: Array<Equipment> = [];

    // ...其他方法和属性，比如添加装备、删除装备等
}