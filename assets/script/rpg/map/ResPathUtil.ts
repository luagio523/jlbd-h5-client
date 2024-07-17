export class ResPathUtil {
    private static readonly BASE_PATHS = {
        MAP: "map/",
        ANIM: "anim/",
        SKILL_EFF: "anim/skillEff/",
        UI_EFF: "anim/eff/",
        DRAGON_BODY: "anim/dragonbody/",
        BODY: "anim/body/"
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
}