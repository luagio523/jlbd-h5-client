//发生在拥有modifer 的实体 status 变化时触发的事件
export enum ModifierEvent {
    // `OnSpellTargetReady`: 当施法目标就绪时触发。
    MODIFIER_EVENT_ON_SPELL_TARGET_READY = 180,

    // `OnAbilityStart`: 当一个技能开始施法时触发。
    MODIFIER_EVENT_ON_ABILITY_START = 190,

    /**
     * 方法名称：`OnAbilityExecuted`
     * 在一个技能被执行时，此方法被调用。
     */
    MODIFIER_EVENT_ON_ABILITY_EXECUTED = 191,

    // `OnAbilityFullyCast`: 当一个技能完成施法时（有效释放）触发。
    MODIFIER_EVENT_ON_ABILITY_FULLY_CAST = 192,

    /**
     * 方法名称：`OnBreakInvisibility`
     * 在破解隐身时，此方法被调用。
     */
    MODIFIER_EVENT_ON_BREAK_INVISIBILITY = 193,

    /**
     * 方法名称：`OnAbilityEndChannel`
     * 在技能通道结束时，此方法被调用。
     */
    MODIFIER_EVENT_ON_ABILITY_END_CHANNEL = 194,

    /**
     * 方法名称：`OnProcessUpgrade`
     * 在处理升级时，此方法被调用。
     */
    MODIFIER_EVENT_ON_PROCESS_UPGRADE = 195,

    /**
     * 方法名称：`OnRefresh`
     * 在刷新时，此方法被调用。
     */
    MODIFIER_EVENT_ON_REFRESH = 196,

    /**
     * 方法名称：`OnTakeDamage`
     * 当承受伤害时，此方法被调用。
     */
    MODIFIER_EVENT_ON_TAKEDAMAGE = 197,

    /**
     * 方法名称：`OnDamagePrevented`
     * 当伤害被阻止时，此方法被调用。
     */
    MODIFIER_EVENT_ON_DEATH_PREVENTED = 198,

    /**
     * 方法名称：`OnStateChanged`
     * 当状态改变时，此方法被调用。
     */
    MODIFIER_EVENT_ON_STATE_CHANGED = 199,

    /**
     * 方法名称：`OnOrbEffect`
     * 在执行Orb Effect时，此方法被调用。
     */
    MODIFIER_EVENT_ON_ORB_EFFECT = 200,

    /**
     * 方法名称：`OnProcessCleave`
     * 在处理Cleave时，此方法被调用。
     */
    MODIFIER_EVENT_ON_PROCESS_CLEAVE = 201,

    /**
     * 方法名称：`OnDamageCalculated`
     * 当伤害计算后，此方法被调用。
     */
    MODIFIER_EVENT_ON_DAMAGE_CALCULATED = 202,

    /**
     * 方法名称：`OnMagicDamageCalculated`
     * 当魔法伤害计算后，此方法被调用。
     */
    MODIFIER_EVENT_ON_MAGIC_DAMAGE_CALCULATED = 203,

    /**
     * 方法名称：`OnAttacked`
     * 当被攻击时，此方法被调用。
     */
    MODIFIER_EVENT_ON_ATTACKED = 204,

    /**
     * 方法名称：`OnDeath`
     * 当角色死亡时，此方法被调用。
     */
    MODIFIER_EVENT_ON_DEATH = 205,

    /**
     * 方法名称：`OnDeathCompleted`
     * 当角色死亡完成时，此方法被调用。
     */
    MODIFIER_EVENT_ON_DEATH_COMPLETED = 206,

    /**
     * 方法名称：`OnRespawn`
     * 当角色重生时，此方法被调用。
     */
    MODIFIER_EVENT_ON_RESPAWN = 207,

    /**
     * 方法名称：`OnSpentMana`
     * 当花费法力值时，此方法被调用。
     */
    MODIFIER_EVENT_ON_SPENT_MANA = 208,

    /**
     * 方法名称：`OnSpentHealth`
     * 当花费生命值时，此方法被调用。
     */
    MODIFIER_EVENT_ON_SPENT_HEALTH = 209,

    /**
     * 方法名称：`OnTeleporting`
     * 在传送前时，此方法被调用。
     */
    MODIFIER_EVENT_ON_TELEPORTING = 210,

    /**
     * 方法名称：`OnTeleported`
     * 在传送后时，此方法被调用。
     */
    MODIFIER_EVENT_ON_TELEPORTED = 211,

    // `OnSetLocation`: 当单位位置被强制改变时触发。
    MODIFIER_EVENT_ON_SET_LOCATION = 212,

    // `OnHealthGained`: 当单位获得生命值时触发。
    MODIFIER_EVENT_ON_HEALTH_GAINED = 213,

    // `OnManaGained`: 当单位获得法力值时触发。
    MODIFIER_EVENT_ON_MANA_GAINED = 214,

    /**
     * 方法名称：`OnTakeDamageKillCredit`
     * 当取得因伤害导致的击杀积分时，此方法被调用。
     */
    MODIFIER_EVENT_ON_TAKEDAMAGE_KILLCREDIT = 215,

    /**
     * 方法名称：`OnHeroKilled`
     * 当英雄被击杀时，此方法被调用。
     */
    MODIFIER_EVENT_ON_HERO_KILLED = 216,

    /**
     * 方法名称：`OnHealReceived`
     * 当接收到治疗时，此方法被调用。
     */
    MODIFIER_EVENT_ON_HEAL_RECEIVED = 217,

    /**
     * 方法名称：`OnBuildingKilled`
     * 当建筑被摧毁时，此方法被调用。
     */
    MODIFIER_EVENT_ON_BUILDING_KILLED = 218,

    /**
     * 方法名称：`OnModelChanged`
     * 当模型发生改变时，此方法被调用。
     */
    MODIFIER_EVENT_ON_MODEL_CHANGED = 219,

    /**
     * 方法名称：`OnModifierAdded`
     * 当有新的修改器被添加时，此方法被调用。
     */
    MODIFIER_EVENT_ON_MODIFIER_ADDED = 220,
     // `OnDominated`: 当单位被支配或控制时触发。
    MODIFIER_EVENT_ON_DOMINATED = 242,

     // `OnKill`: 当单位杀死另一个单位时触发。
    MODIFIER_EVENT_ON_KILL = 243,
 
     // `OnAssist`: 当单位协助杀死敌方单位时触发。
    MODIFIER_EVENT_ON_ASSIST = 244,

      // `OnAttackFinished`: 当单位的攻击动作完成后触发。
    MODIFIER_EVENT_ON_ATTACK_FINISHED = 247,
    // `OnAttackRecordDestroy`: 当攻击记录被销毁时触发。
    MODIFIER_EVENT_ON_ATTACK_RECORD_DESTROY = 255,

    // `OnProjectileObstructionHit`: 当投射物撞击到障碍物时触发。
    MODIFIER_EVENT_ON_PROJECTILE_OBSTRUCTION_HIT = 256,

      // `OnAttackCancelled`: 当单位的攻击被取消时触发。
    MODIFIER_EVENT_ON_ATTACK_CANCELLED = 258,
      // `OnAttemptProjectileDodge`: 尝试躲避投射物时触发。
    MODIFIER_EVENT_ON_ATTEMPT_PROJECTILE_DODGE = 265,
      // `OnPreDebuffApplied`: 在负面效果应用之前触发。
    MODIFIER_EVENT_ON_PREDEBUFF_APPLIED = 266,
      // `OnSpellAppliedSuccessfully`: 当技能成功施放并命中目标后触发。
    MODIFIER_EVENT_SPELL_APPLIED_SUCCESSFULLY = 275,
     // `OnForceProcMagicStick`: 强制触发魔棒（Magic Stick）或者类似物品的效果。
    MODIFIER_EVENT_ON_FORCE_PROC_MAGIC_STICK = 287,
    // `OnDamageHPLoss`: 当单位承受伤害导致生命值降低时触发。
    MODIFIER_EVENT_ON_DAMAGE_HPLOSS = 289,

}