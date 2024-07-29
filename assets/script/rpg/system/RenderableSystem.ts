import { BaseSystem } from "./BaseSystem";
import { UnitRenderComponent } from "../component/UnitRenderComponent";

export class RenderableSystem extends BaseSystem {


    update(deltaTime: number) {
        console.log("RenderableSystem update",deltaTime);
        const components = this.getComponents(UnitRenderComponent);
        for (const component of components) {
            component.update(deltaTime);
        }
    }


}