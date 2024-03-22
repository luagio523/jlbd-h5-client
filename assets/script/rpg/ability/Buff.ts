import { ECSEntity } from "../ecs/ECSEntity";
import { Modifier } from "./Modifier";

export class Buff extends Modifier{
    public source: ECSEntity ;
    public constructor(duration:number){
        super(duration)
    }
}