import { BaseSystem } from "./BaseSystem";
import { UnitRenderComponent } from "../component/UnitRenderComponent";

export class RenderableSystem extends BaseSystem {


    update(deltaTime: number) {
        
        const components = this.getComponents(UnitRenderComponent);

        for (const component of components) {
            component.update(deltaTime);
        }
    }


}