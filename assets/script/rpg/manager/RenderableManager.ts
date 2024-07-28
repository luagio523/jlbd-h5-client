import { AnimResourceType } from "../../core/animation/Type";
import { CharacterRenderer } from "../render/character/CharacterRenderer";

export interface CharacterParams {
    type:AnimResourceType
    Width:number
    Height:number
}

export class RenderableManager {
    private static instance: RenderableManager;

    private constructor() {}

    public initialize() {
    }

    public static getInstance(): RenderableManager {
        if (!RenderableManager.instance) {
            RenderableManager.instance = new RenderableManager();
        }
        return RenderableManager.instance;
    }

    public async createCharacterRender(type:AnimResourceType):Promise<CharacterRenderer> {
        let characterRenderer = new CharacterRenderer(type);
        await characterRenderer.setup();

        // const actionOptions: ActionOptions = {
        //     modelName: 'Thief',
        //     action: ActType.ACT_WALK,
        // };
        return characterRenderer;
    }



}
