import { ECSEntity } from "../ecs/ECSEntity";
import { Item } from "./Item";

export class Material extends Item {
    // 材料项可能不需要特别复杂的逻辑，只需要继承基础属性
    public apply(entity:ECSEntity):void{

    }
}