import { UIOpacity } from "cc";
import { ECSComponent } from "../ecs/ECSComponent";
import { UnitTargetFlag, UnitTargetTeam, UnitTargetType } from "../enum/Unit";

/**
 * 单位状态
 */
export enum UnitState
{
    /**
     * 无
     */
    none = 0,

    /**
     * 待机
     */
    idle = 1,

    /**
     * 行走
     */
    walk = 2,

    /**
     * 攻击
     */
    attack = 3,

    /**
     * 死亡
     */
    death = 4,
}



import { ecsclass } from "../ecs/__private";
ecsclass("UnitComponent")
export class UnitComponent extends ECSComponent {
    public state: UnitState = UnitState.none;
    public moveSpeed: number = 200;

    /**
     * 设置单位方向
     * 
     * 方向值范围为 0-7，方向值设定如下，0是下，1是左下，2是左，3是左上，4是上，5是右上，6是右，7是右下
     * 
     *        4
     *      3   5
     *    2   *   6
     *      1   7
     *        0
     * 
     */
    public direction: number = 0;

    public uiOpacity: UIOpacity = null;

    // 添加单位目标标志、队伍和类型
    public unitTargetFlag: UnitTargetFlag = UnitTargetFlag.UNIT_TARGET_FLAG_NONE;
    public unitTargetTeam: UnitTargetTeam = UnitTargetTeam.UNIT_TARGET_TEAM_NONE;
    public unitTargetType: UnitTargetType = UnitTargetType.UNIT_TARGET_NONE;

    constructor() {
        super();
        // 可以在这里添加初始化逻辑
    }

    // 可以添加一些辅助方法
    public setDirection(newDirection: number): void {
        if (newDirection >= 0 && newDirection <= 7) {
            this.direction = newDirection;
        } else {
            console.warn("Invalid direction value. It should be between 0 and 7.");
        }
    }

    public setState(newState: UnitState): void {
        this.state = newState;
    }

    public setMoveSpeed(speed: number): void {
        if (speed >= 0) {
            this.moveSpeed = speed;
        } else {
            console.warn("Move speed cannot be negative.");
        }
    }

    // 可以添加其他需要的方法
}