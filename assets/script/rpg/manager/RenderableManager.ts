import { AnimResourceType } from "../../core/animation/Type";
import { Character } from "../render/character/Character";
import { Footprint } from "../render/character/Footprint";
import { DamageNumber } from "../render/effect/DamageNumber";


export class RenderableManager {
    private static instance: RenderableManager;
    private damageNumberPool: DamageNumber[] = [];
    private footprintPool: Footprint[] = [];
    private constructor() {}

    public initialize() {}

    public static getInstance(): RenderableManager {
        if (!RenderableManager.instance) {
            RenderableManager.instance = new RenderableManager();
        }
        return RenderableManager.instance;
    }
    /**
     * 创建角色UI对象
     * 无需回收，由更上层处理
     * @param type 
     * @returns 
     */
    public async createCharacter(type: AnimResourceType): Promise<Character> {
        let character: Character;
        character = await Character.create(type);
        await character.setup();

        return character;
    }

    /**
     * 创建伤害数字对象
     * @param fontSize 
     * @returns 
     */
    public async createDamageNumber(fontSize: number = 12): Promise<DamageNumber> {
        let damageNumber: DamageNumber;

        if (this.damageNumberPool.length > 0) {
            damageNumber = this.damageNumberPool.pop()!;
        } else {
            damageNumber = await DamageNumber.create(fontSize);
            await damageNumber.setup();
        }

        return damageNumber;
    }
    /**
     * 回收伤害数字对象
     * @param damageNumber 
     */
    public recycleDamageNumber(damageNumber: DamageNumber) {
        damageNumber.reset();
        this.damageNumberPool.push(damageNumber);
    }



    public async createFootprint(): Promise<Footprint> {
        let footprint: Footprint;

        if (this.footprintPool.length > 0) {
            footprint = this.footprintPool.pop()!;
        } else {
            footprint = await Footprint.create();
            await footprint.setup();
        }

        return footprint;
    }

    public recycleFootprint(footprint: Footprint) {
        footprint.reset();
        this.footprintPool.push(footprint);
    }
}
