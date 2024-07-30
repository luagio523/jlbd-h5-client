import { BaseSystem } from "./BaseSystem";
import { UnitRenderComponent } from "../component/UnitRenderComponent";
import { TransformComponent } from "../component/TransformComponent";

export class RenderableSystem extends BaseSystem {


    update(deltaTime: number) {
        const entities = this.getEntitiesWithComponents(UnitRenderComponent,TransformComponent)
        for (const entity of entities) {
            const unitRender = entity.getComponent(UnitRenderComponent);
            const transform = entity.getComponent(TransformComponent);
            unitRender.setPosition(transform.position.x, transform.position.y);
            unitRender.update(deltaTime);
        }
    }


}