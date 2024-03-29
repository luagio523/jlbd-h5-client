import { ActType } from "../enum/Act";


export enum BodyAnimType {
    Frames = 0, //使用帧动画
    Dragon = 1, //使用龙骨
}
export class AnimUtil {

    static ActStringMap: Map<ActType, string> = new Map([
        [ActType.ACT_STAND, 's'],
        [ActType.ACT_IDLE, 's'],
        [ActType.ACT_ATTACK, 'a'],
        [ActType.ACT_RUN, 'r'],
        [ActType.ACT_JUMP, 'j'],
        [ActType.ACT_DEATH, 'd'],
        [ActType.ACT_HURT, 'h'],
        [ActType.ACT_CAST, 'c'],
    ]);

    public static getAct(type: ActType): string {
        return AnimUtil.ActStringMap.get(type) || 's';
    }
 

    /**
 * 获取序列帧
 * @param skin 
 * @param type 
 * @returns 
 */
    public static getFrameAnimName(skin: string, type: ActType): string {
        return skin + "_" + this.getAct(type)
    }

    /**
     * 获取龙骨动画 动作对应的名
     * @param skin 
     * @param type 
     * @returns 
     */
    public static getDragonAnimName(type: ActType): string {
        if (type == ActType.ACT_STAND) {
            return "Idle"
        }
        if (type == ActType.ACT_IDLE) {  //不为攻击时
            return "Idle"
        }
        if (type == ActType.ACT_ATTACK) {
            return "damage"
        }
        return null
    }

    /**
     * 获取动画名
     * @param animType 
     * @param skin 
     * @param type 
     * @returns 
     */
    public static getAnimName(animType: BodyAnimType, skin: string, type: ActType) {

        if (animType == BodyAnimType.Frames) {
            let animName = this.getFrameAnimName(skin, type)
            return animName
        } else if (animType == BodyAnimType.Dragon) {
            let animName = this.getDragonAnimName(type)
            return animName
        }

    }



}

