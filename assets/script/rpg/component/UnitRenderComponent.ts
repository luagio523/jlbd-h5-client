import { Node } from "cc";
import { ECSComponent } from "../ecs/ECSComponent";
import { Unit } from "../render/unit/Unit";
import { ActType } from "../enum/Act";
import { ActionOptions } from "../base/UnitAnimationState";
import { ecsclass } from "../ecs/__private";
ecsclass("UnitRenderComponent")
export class UnitRenderComponent extends ECSComponent {
    public unit: Unit = null;
    private actionOptions: ActionOptions 
    public constructor(unit?: Unit) {
        super();
        this.unit = unit;
    }

    public initialize(unit:Unit,model:string, modelName:string,gender:number,frameRate:number ): void {
        this.unit = unit;
        this.actionOptions  ={
            model: model,
            modelName: modelName,
            gender: gender,
            frameRate: frameRate,
            action: ActType.ACT_IDLE,
            direction: 0,
        }
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


    public changeAct(act: ActType, direction: number,times?:number): void {
        this.actionOptions.action = act;
        this.actionOptions.direction = direction;
        this.actionOptions.times = times;
        this.unit.playAction(this.actionOptions);
    }

}