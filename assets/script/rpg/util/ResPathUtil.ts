import { Prefab } from "cc";
import { ActResourceType } from "../base/ActAnimationState";

export class ResPathUtil {
    private static readonly BASE_PATHS = {
        MAP: "map/",
        ANIM: "anim/",
        SKILL_EFF: "anim/skillEff/",
        UI_EFF: "anim/eff/",
        DRAGON_BODY: "anim/dragonbody/",
        BODY: "anim/body/",
        Prefab:"prefab/"
    };

    public static readonly DEFAULT_SHADOW = "images/shadow/1";

    public static getTileImagePath(name: string, x: number, y: number): string {
        return `${this.BASE_PATHS.MAP}${name}/image/${y}_${x}/spriteFrame`;
    }

    public static getMapThumbnailPath(name: string): string {
        return `${this.BASE_PATHS.MAP}${name}/small/spriteFrame`;
    }

    public static getMapMiniPath(name: string): string {
        return `${this.BASE_PATHS.MAP}${name}/pk_preview/spriteFrame`;
    }

    public static getMap(mapId: string): string {
        return `${this.BASE_PATHS.MAP}${mapId}/${mapId}`;
    }

    public static getSkillEffPath(effName: string = ""): string {
        return `${this.BASE_PATHS.SKILL_EFF}${effName}`;
    }

    public static getUIEffPath(effName: string = ""): string {
        return `${this.BASE_PATHS.UI_EFF}${effName}`;
    }

    public static getDragonBodyPath(name: string): string {
        return `${this.BASE_PATHS.DRAGON_BODY}${name}`;
    }

    public static getBodyPath(name: string): string {
        return `${this.BASE_PATHS.BODY}${name}`;
    }
    /**
     * 支持四种不同的资源类型
     * @param type 
     * @returns 
     */
    public static getBodyActPrefabPath(type: ActResourceType): string {
        let base =`${this.BASE_PATHS.Prefab}body/Character`
        switch (type) {
            case ActResourceType.ACT1:
                return base+"1";
            case ActResourceType.ACT2:
                return base+"1";
            case ActResourceType.ACT3:
                return base+"3";
            case ActResourceType.ACT4:
                return base+"4";
            default:
                throw new Error('Unsupported player type');
        }
        return ;
    }
}