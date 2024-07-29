import { BaseSystem } from "./BaseSystem";
import { RenderableComponent } from "../component/RenderableComponent";

export class RenderableSystem extends BaseSystem {


    update(deltaTime: number) {
        const components = this.getComponents(RenderableComponent);
        for (const component of components) {
            component.update(deltaTime);
        }
    }


}