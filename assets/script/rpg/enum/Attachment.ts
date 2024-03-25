export enum ParticleAttachment {
    PATTACH_INVALID = -1, // 无效的附着点，一般用于初始化或错误处理
    PATTACH_ABSORIGIN = 0, // 附着于单位的原点位置
    PATTACH_ABSORIGIN_FOLLOW = 1, // 附着于单位的原点位置，并跟随单位移动
    PATTACH_CUSTOMORIGIN = 2, // 附着于自定义原点位置
    PATTACH_CUSTOMORIGIN_FOLLOW = 3, // 附着于自定义原点位置，并跟随移动
    PATTACH_POINT = 4, // 附着于单位的特定点，如骨骼或挂点
    PATTACH_POINT_FOLLOW = 5, // 附着于单位的特定点，并跟随单位移动
    PATTACH_EYES_FOLLOW = 6, // 附着于单位的眼睛位置，并跟随其移动
    PATTACH_OVERHEAD_FOLLOW = 7, // 附着于单位头顶上方，并随单位移动
    PATTACH_WORLDORIGIN = 8, // 附着于世界的原点位置
    PATTACH_ROOTBONE_FOLLOW = 9, // 附着于单位的根骨骼，并跟随其移动
    PATTACH_RENDERORIGIN_FOLLOW = 10, // 附着于单位的渲染原点，并跟随其移动
    PATTACH_MAIN_VIEW = 11, // 附着于玩家的主视角
    PATTACH_WATERWAKE = 12, // 附着于水面效果（水纹），通常用于水面运动效果
    PATTACH_CENTER_FOLLOW = 13, // 附着于单位的中心点，并跟随其移动
    PATTACH_CUSTOM_GAME_STATE_1 = 14, // 可用于自定义游戏状态附着点，具体效果由游戏逻辑决定
    PATTACH_HEALTHBAR = 15, // 附着于单位的生命条
    MAX_PATTACH_TYPES = 16, // 最大附着类型数，用于数组或循环的上限
}


export enum ProjectileAttachment {
    DOTA_PROJECTILE_ATTACHMENT_NONE = 0,      // 投射物不附着于任何特定点，可能就是单位的原点或者是世界中的某个点
    DOTA_PROJECTILE_ATTACHMENT_ATTACK_1 = 1,    //投射物从单位的第一个攻击点发射，例如右手或主要攻击手
    DOTA_PROJECTILE_ATTACHMENT_ATTACK_2 = 2,    // 投射物从单位的第二个攻击点发射，例如左手或副手（如果有的话）
    DOTA_PROJECTILE_ATTACHMENT_HITLOCATION = 3,   // 投射物会以目标单位受击的位置为附着点
    DOTA_PROJECTILE_ATTACHMENT_ATTACK_3 = 4,    // 投射物从单位的第三个攻击点发射，比如一个次要的攻击点或额外的攻击点
    DOTA_PROJECTILE_ATTACHMENT_ATTACK_4 = 5,    // 投射物从单位的第四个攻击点发射，是附加的可能很少使用的攻击点
    DOTA_PROJECTILE_ATTACHMENT_LAST = 6,         // 标记枚举的结束，用于循环或数组的极限值，并非实际的附着点
}