import {  Node } from 'cc';
import { SkillAreaBase, SkillAreaParams } from './SkillArea';
import { CircleArea, CircleAreaParams } from './CircleArea';
import { RectangleArea, RectangleAreaParams } from './RectangleArea';
import { SectorArea, SectorAreaParams } from './SectorArea';
import { PolygonArea, PolygonAreaParams } from './PolygonArea';
import { PathArea, PathAreaParams } from './PathArea';
/**
 * 技能指示区域类型
 * 用于boss技能的指示区域
 */
export enum SkillAreaType {
    Circle,
    Rectangle,
    Sector,
    Polygon,
    Path
}


export class SkillAreaFactory {
    static createArea(type: SkillAreaType, node: Node, params: SkillAreaParams): SkillAreaBase {
        switch (type) {
            case SkillAreaType.Circle:
                return new CircleArea(node, params as CircleAreaParams);
            case SkillAreaType.Rectangle:
                return new RectangleArea(node, params as RectangleAreaParams);
            case SkillAreaType.Sector:
                return new SectorArea(node, params as SectorAreaParams);
            case SkillAreaType.Polygon:
                return new PolygonArea(node, params as PolygonAreaParams);
            case SkillAreaType.Path:
                return new PathArea(node, params as PathAreaParams);
            default:
                throw new Error('Unknown SkillArea type');
        }
    }
}





// 1. 圆形提示区域
// 用途: 通常用于范围攻击，例如爆炸或AOE（范围伤害）技能。
// 实现方式: 在BOSS施放技能前，在目标区域显示一个透明或半透明的圆形图案，提示玩家即将受到攻击。
// 2. 矩形提示区域
// 用途: 适用于直线型技能，如冲击波、直线射击等。
// 实现方式: 在技能路径上显示一个长方形或矩形区域，提示玩家技能的行进方向。
// 3. 扇形提示区域
// 用途: 用于扇形范围的技能，如喷火、扇形砍击等。
// 实现方式: 在BOSS面前显示一个扇形区域，提示玩家技能的覆盖范围。
// 4. 多边形提示区域
// 用途: 用于复杂的技能形状，例如多段攻击或不规则形状的技能。
// 实现方式: 根据技能形状在地面绘制多边形区域，提示玩家技能的具体形状和范围。
// 5. 路径提示区域
// 用途: 用于移动型技能，如追踪导弹或路径攻击。
// 实现方式: 在技能移动路径上显示一条线或箭头，提示玩家技能的行进轨迹。
// 提示区域的实现技巧
// 1. 使用透明度和颜色
// 透明度: 使用半透明的颜色可以让提示区域不影响玩家视野，同时还能清晰地显示技能范围。
// 颜色: 通常使用红色或橙色来表示危险区域，绿色或蓝色表示安全区域。
// 2. 动画效果
// 渐变动画: 提示区域可以使用渐变动画来增加紧迫感，例如从透明到不透明的渐变。
// 闪烁效果: 在技能即将释放时，提示区域可以闪烁，以引起玩家注意。
// 3. 时间提示
// 倒计时: 在提示区域内显示倒计时数字，让玩家清楚知道技能何时释放。
// 音效提示: 配合音效提示，可以增强玩家的反应速度。
// 4. 动态调整
// 实时更新: 如果技能范围会随时间变化，提示区域也需要实时更新，例如逐渐扩大或缩小。
// 跟随玩家: 某些技能可能会跟随玩家移动，提示区域也需要动态调整位置。