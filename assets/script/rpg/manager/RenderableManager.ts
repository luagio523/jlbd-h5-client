import { AnimResourceType } from "../../core/animation/Type";
import { CharacterRenderer } from "../render/character/CharacterRenderer";


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
        let characterRenderer = new CharacterRenderer();
        characterRenderer.initialize(type);
        await characterRenderer.setupCharacter();

        // const actionOptions: ActionOptions = {
        //     modelName: 'Thief',
        //     action: ActType.ACT_WALK,
        // };
        return characterRenderer;
    }



}
