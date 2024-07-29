import { Node } from "cc";
import { ECSComponent } from "../ecs/ECSComponent";
import { ActType } from "../enum/Act";
import { Unit } from "../render/unit/Unit";

export class UnitRenderComponent extends ECSComponent {
    public unit: Unit = null;
    public constructor(unit?: Unit) {
        super();
        this.initialize(unit);
    }

    public initialize(unit?: Unit): void {
        if (unit == null) {
            return
        }
        this.unit = unit;
    }

   

    public getNode(): Node {
        return this.unit.getNode();
    }


    public update(dt: number): void {
        this.unit.update(dt);
    }

    public setPosition(x: number, y: number): void {
        this.unit.setPosition(x, y);
    }


}