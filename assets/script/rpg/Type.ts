export enum AbilityBehavior {
    DOTA_ABILITY_BEHAVIOR_HIDDEN = 1 << 0, //可以被单位拥有，但不能施放，也不会显示在HUD上。
    DOTA_ABILITY_BEHAVIOR_PASSIVE = 1 << 1, //不能像上面那样施放，但这个会显示在能力HUD上。
    DOTA_ABILITY_BEHAVIOR_NO_TARGET = 1 << 2, //不需要施放目标，按下按钮后技能就会发射。
    DOTA_ABILITY_BEHAVIOR_UNIT_TARGET = 1 << 3, //需要一个施法目标。
    DOTA_ABILITY_BEHAVIOR_POINT = 1 << 4, //可以在鼠标光标所在的任何地方施放（如果单击一个单位，它只会在该单位站立的地方施放）。
    DOTA_ABILITY_BEHAVIOR_AOE = 1 << 5, //绘制技能生效的半径。有点像 POINT，但有一个效果区域显示。
    DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE = 1 << 6, //可能可以施放或有施放方案但无法学习（这些通常是暂时的能力，如技术人员的炸弹爆炸）。
    DOTA_ABILITY_BEHAVIOR_CHANNELLED = 1 << 7, //通道能力。如果用户移动或沉默，该能力就会中断。
    DOTA_ABILITY_BEHAVIOR_ITEM = 1 << 8, //能力与物品相关。
    DOTA_ABILITY_BEHAVIOR_TOGGLE = 1 << 9, //可以即时切换。
    DOTA_ABILITY_BEHAVIOR_DIRECTIONAL = 1 << 10, //具有来自英雄的方向，例如米拉纳斯之箭或帕吉的钩子。
    DOTA_ABILITY_BEHAVIOR_IMMEDIATE = 1 << 11, //无需进入动作队列即可立即使用。
    DOTA_ABILITY_BEHAVIOR_AUTOCAST = 1 << 12, //可以自动施放。
    DOTA_ABILITY_BEHAVIOR_NOASSIST = 1 << 13, //技能没有十字线辅助。
    DOTA_ABILITY_BEHAVIOR_AURA = 1 << 14, //能力是一种光环。除了标记该能力之外，没有真正使用过。
    DOTA_ABILITY_BEHAVIOR_ATTACK = 1 << 15, //是一次攻击，无法击中免疫攻击的目标。
    DOTA_ABILITY_BEHAVIOR_DONT_RESUME_MOVMENT = 1 << 16, //完成后不应恢复移动。仅适用于无目标、非即时能力。
    DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES = 1 << 17, //root时无法使用
    DOTA_ABILITY_BEHAVIOR_UNRESTRICTED = 1 << 18, //命令受限时允许使用
    DOTA_ABILITY_BEHAVIOR_IGNORE_PSEUDO_QUEUE = 1 << 19, //可以在击晕、施法或强制时执行-攻击。仅适用于切换能力。
    DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL = 1 << 20, //可以在不中断通道的情况下执行。
    DOTA_ABILITY_BEHAVIOR_DONT_ALERT_TARGET = 1 << 22, //对敌人施放目标时不警告敌人。
    DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK = 1 << 23, //技能完成后不应恢复对先前目标的命令攻击。仅适用于无目标、非直接能力和单位目标能力。
    DOTA_ABILITY_BEHAVIOR_NORMAL_WHEN_STOLEN = 1 << 24, //技能被盗时仍使用其正常施法点。
    DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING = 1 << 25, //技能忽略后摆伪队列。
    DOTA_ABILITY_BEHAVIOR_RUNE_TARGET = 1 << 26, //目标符文。
}



export enum UnitTargetTeam {

}
  
export enum UnitTargetType {

}


export enum UnitTargetFlags {

}


export enum AbilityType {
    BASIC = 0,
    ULTIMATE = 1,
    ATTRIBUTES = 2,
    HIDDEN = 3,
}


export enum DamageType {
    
}

  

  // 用法示例
//   const behaviorString = "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE";
//   const behaviorValue = ParseAbilityBehavior(behaviorString);
//   console.log(behaviorValue); // 输出实际的数值




