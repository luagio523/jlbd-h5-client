import { ECSEntity } from "../ecs/ECSEntity";
import { Item } from "./Item";

//消耗品
export class Consumable extends Item {
    // this.effect = effect; // 消耗品的效果
    public apply(entity:ECSEntity):void{

    }
}