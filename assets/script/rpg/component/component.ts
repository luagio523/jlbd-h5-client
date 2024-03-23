// class HealthComponent {
//     constructor(public value: number) {}
// }

// class AttackComponent {
//     constructor(public damage: number, public critChance: number, public critMultiplier: number) {}
// }

// // 如果需要一个专门的暴击组件
// class CritComponent {
//     constructor(public chance: number, public multiplier: number) {}
// }





// 在ECS框架下，这些方法应该被拆分到和他们的功能相关的组件中。这是我对你提到的方法的理解，并以此进行的拆分：
// AbilityControlComponent：这个组件可以包括控制和调度技能的相关功能，例如使用技能、技能效果开始、技能效果结束、切换技能等。因此，以下方法可以放置在这个组件中：
// OnAbilityPhaseInterrupted()
// OnAbilityPhaseStart()
// OnSpellStart()
// OnToggle()
// AbilityEffectComponent：这个组件可以处理技能效果，例如技能是否中断、英雄的状态更改等。所以，可以将以下方法放置在这个组件中：
// OnChannelFinish(interrupted: boolean)
// OnChannelThink(interval: number)
// OnOwnerDied()
// OnOwnerSpawned()
// AbilityUpgradeComponent：这个组件负责技能的升级和英雄的等级提升。所以下列方法应该放在这个组件中：
// OnHeroLevelUp()
// OnUpgrade()
// OnHeroCalculateStatBonus()
// AbilityPingComponent：这个组件可以用来处理 "ping"相关操作，在多人游戏中，ping通常会用来标记地图上的特殊地点。所以，可以将下列方法放在这个组件中：
// OnAbilityPinged(playerId: PlayerID, ctrlHeld: boolean)
// 这种分组方式既根据方法的功能来划分，又保证了每个组件的职责尽可能简单和清晰。









// 在ECS模式中，"系统"（System）负责处理游戏逻辑和更新所有的组件。在上述示例中，我们在组件内部监听了事件，这是一种偏向于组件内部逻辑处理的方式。
// 但是，如果你希望在"系统"级别处理事件，也是可以的。你可以在合适的"系统"中监听SpellStartEvent事件，然后在事件发生时，遍历所有的实体并添加或者更新对应的组件。
// 例如：
// typescript
// class SpellStartSystem extends System {
//     update(): void {
//         // 监听 SpellStartEvent
//         EventSystem.addEventListener(SpellStartEvent, (event) => {
//             // 通过 event 获取到施法的技能实体
//             let entity = event.getAbilityEntity();

//             // 对 entity 所有的组件进行更新
//             entity.getComponent(DamageComponent).calculateAndApplyDamage(event);
//             entity.getComponent(HealingComponent).calculateAndApplyHealing(event);
//             entity.getComponent(ParticleEffectComponent).createEffect(event);
//             entity.getComponent(SoundEffectComponent).playSound(event);
//         });
//     }
// }
// 在上述代码中，SpellStartSystem系统通过监听SpellStartEvent，并在事件触发时获取到相应的技能实体，然后处理各个组件的逻辑。
// 两种方法各有所长，具体使用哪种方式需要根据你的具体需求，以及你的整体架构来决定。如果你的项目中已经有了一套成熟的事件系统，那么在系统层面处理事件可能更好。反之，如果你更倾向于在组件内部处理逻辑，那么在组件层面监听事件也是不错的选择。





// 在Dota 2的游戏设计中，不是每一个技能都需要一个独立的系统。你通常会为游戏中的不同类型的操作（如移动、攻击、释放技能等）设计系统。每个系统负责一类操作的逻辑处理，这样，你可以避免为每个技能单独创建系统，而是让技能共享系统。
// 对于技能的实现，你可以这样做：
// 定义技能的KV文件：就像之前展示的那样，为每个技能定义一个KV文件，在其中指定技能的属性和行为。
// 创建通用的技能系统：定义一个或数个技能系统来处理技能释放的通用逻辑。例如，你可以有一个系统来处理所有的点目标技能，另一个系统处理所有的单位目标技能，再另一个处理所有的无目标（自由施放）技能。
// 定义技能逻辑的脚本：在Lua脚本中，你可以为定义在KV文件中的技能编写实际的逻辑。这些脚本会使用到之前定义的系统来处理技能特有的行为。
// 注册和激活技能：在游戏的初始化阶段，将技能组件注册到对应的系统，并在游戏运行时激活技能，通用的系统将负责根据组件信息处理具体的逻辑。
// 使用这种方法，你可以有效地重用系统来为多种技能服务，降低了编码的复杂性和工作量。在技能特别独特，无法被通用系统处理时，才考虑创建特定的系统。
// 这里是一个简化的例子：
// 技能系统示例：
// lua
// -- 系统注册
// function Activate()
//     AbilitySystem:Init()  -- 进行系统初始化，比如注册事件监听或初始化数据
// end

// -- 技能系统
// AbilitySystem = {}

// function AbilitySystem:Init()
//     ListenToGameEvent("npc_spawned", Dynamic_Wrap(AbilitySystem, "OnNpcSpawned"), nil)
//     -- 更多的初始化和事件监听可以在这里配置
// end

// function AbilitySystem:OnNpcSpawned(event)
//     local npc = EntIndexToHScript(event.entindex)

//     if npc:IsRealHero() and npc.bFirstSpawned == nil then
//         npc.bFirstSpawned = true
//         -- 初始化英雄的各项技能，如果有特殊逻辑，在这里处理
//         -- 例如添加通用的技能修改组件到英雄，或者为快速施法技能设置触发器
//     end
// end

// function AbilitySystem:ExecuteAbility(abilityData)
//     -- 根据 abilityData 执行技能逻辑，例如创建投射物、应用效果等
// end
// 这里的 AbilitySystem 是一个简化的系统例子，实际游戏可能包括更多复杂的组件和系统互动。技能的 KV 文件用于数据驱动技能的定义，Lua 脚本利用这些数据来执行具体的技能逻辑，还有系统代码来管理所有技能的执行。
// 在这种设计模式中，虽然每个技能都拥有独立的KV文件定义其属性，但在代码层面它们通常可以共用一个或几个系统来管理技能的生命周期和特定的逻辑处理，只有当技能有独特的逻辑时才会需要额外的系统或复杂的处理。