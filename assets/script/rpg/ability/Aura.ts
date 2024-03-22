import { UnitTargetType } from "../type/Unit";
import { Modifier } from "./Modifier";
 // Aura类继承自Modifier
export class Aura extends Modifier {
    public auraRadius: number;
    public affects: UnitTargetType;

    constructor(duration:number) {
        super(duration);
    }
}

