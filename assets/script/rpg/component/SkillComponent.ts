// 技能组件，定义技能的属性
class SkillComponent {
    skillId: string;
    isCasting: boolean = false; 
    isCharging: boolean = false;
    chargeTime: number = 0; // 长按充能时间
}