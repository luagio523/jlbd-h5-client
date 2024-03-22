import { ECSEntity } from "../ecs/ECSEntity";
import { BaseSystem } from "./BaseSystem";





// export class AbilitySystem extends BaseSystem {
//     process(ecsWorld:ECSWorld, delta:number) {
//         const entities = ecsWorld.queryEntities({all:[AbilityComponent]});

//         for(let entity of entities) {
//             const abilityComponent = entity.getComponent(AbilityComponent);
            
//             // 遍历所有技能
//             for(let ability of abilityComponent.abilityList) {
                
//                 // 这里写你的技能触发条件，比如按下了对应的按键
//                 // 如果技能被触发了，你可能需要处理的逻辑
//                 // 例如：
//                 if (ability.triggered) {
//                     ability.triggerAbility(delta);
//                 }

//                 // 这里写你的技能冷却条件，比如用了技能之后一段时间
//                 // 如果技能需要冷却，你可能需要处理的逻辑
//                 // 例如：
//                 if (!ability.checkCooldown(delta)) {
//                     console.log('Ability is on cooldown.')
//                 }
                
//                 // 这里写你的刷新条件，比如满足一些条件或者获得了某些 Buff
//                 // 如果技能需要被刷新，你可能需要处理的逻辑
//                 // 例如：
//                 if (someCondition) { // 请替换为实际的条件
//                     ability.resetCooldown();
//                 }
//             }
//         }
//     }
// }