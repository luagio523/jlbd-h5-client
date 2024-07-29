import { BaseSystem } from "./BaseSystem";
import { RenderableComponent } from "../component/UnitRenderComponent";

export class RenderableSystem extends BaseSystem {


    update(deltaTime: number) {
        const components = this.getComponents(RenderableComponent);
        for (const component of components) {
            component.update(deltaTime);
        }
    }


}