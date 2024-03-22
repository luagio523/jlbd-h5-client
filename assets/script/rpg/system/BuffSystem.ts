import {BuffComponent } from "../component/BuffComponent";
import { ECSEntity } from "../ecs/ECSEntity";
import { BaseSystem } from "./BaseSystem";

export class BuffSystem extends BaseSystem {
    // public update(delta: number) {
    //     // 遍历所有包含 Buff 组件的实体
    //     for (let entity of this.getEntitiesWithComponent(BuffComponent)) {
    //         let buffComponent = entity.getComponent(BuffComponent);

    //         // 遍历实体的所有 Buff
    //         for (let i = buffComponent.buffs.length - 1; i >= 0; i--) {
    //             let buff = buffComponent.buffs[i];
                
    //             // 将 Buff 持续时间减去流逝的时间
    //             buff.duration -= delta;

    //             // 如果 Buff 的持续时间已经结束，将其移除并触发相应的效果
    //             if (buff.duration <= 0) {
    //                 if (buff.expirationModifier) {
    //                     buff.expirationModifier(entity, buff);
    //                 }
    //                 buffComponent.buffs.splice(i, 1);
    //             }
    //         }
    //     }
    // }

    // public applyBuff(target: ECSEntity, newBuff: Buff) {
    //     let buffComponent = target.getComponent(BuffComponent);

    //     // 判断 Buff 是否可以叠加
    //     if(newBuff.stackable){
    //         let existingBuff = buffComponent.buffs.find(
    //             buff => buff.id === newBuff.id
    //         );

    //         // 如果找到相同的 Buff 并且没有超过叠加限制
    //         if (existingBuff && existingBuff.stackingStrategy === StackingStrategy.SIMPLE) {
    //             existingBuff.intensity += newBuff.intensity;
    //             existingBuff.duration = Math.max(existingBuff.duration, newBuff.duration);
    //         } else {
    //             // 否则直接添加新的 Buff
    //             buffComponent.buffs.push(newBuff);
    //         }
    
    //     } else {
    //         // 如果 Buff 不支持叠加，直接添加
    //         buffComponent.buffs.push(newBuff);
    //     }
            
    //     // 触发 Buff 的应用效果
    //     if (newBuff.applyModifier) {
    //         newBuff.applyModifier(target, newBuff);
    //     }
    // }
}

// export class BuffSystem extends BaseSystem{
//     update(deltaTime: number) {
//         const entities = this.getEntitiesWithComponent(BuffComponent);
        
//         for (const entity of entities) {
//             const buffComponent = entity.getComponent(BuffComponent);
//             for (let i = buffComponent.buffs.length - 1; i >= 0; i--) {
//                 const buff = buffComponent.buffs[i];

//                 // 应用buff效果
//                 this.applyBuff(entity, buff);

//                 // 更新buff持续时间
//                 buff.duration -= deltaTime;

//                 // 如果buff到期了，将其移除
//                 if (buff.duration <= 0) {
//                     buffComponent.buffs.splice(i, 1);
//                 }
//             }
//         }
//     }

//     applyBuff(entity:ECSEntity, buff:Buff) {
//         // switch(buff.type) {
//         //     case 'IncreaseHealth':
//         //         this.increaseHealth(entity, buff.intensity);
//         //         break;
//         //     case 'DamageOverTime':
//         //         this.applyDamageOverTime(entity, buff.intensity);
//         //         break;
//         //     case 'SpeedBoost':
//         //         this.increaseSpeed(entity, buff.intensity);
//         //         break;
//         //     // 其他buff类型
//         // }
//         // ... 其他buff应用逻辑 ...
//     }

//     // 增加实体的生命值
//     increaseHealth(entity, intensity) {
//         // 相应地增加生命值
//     }

//     // 对实体应用持续伤害
//     applyDamageOverTime(entity, intensity) {
//         // 每次更新，减少一点生命值
//     }

//     // 增加实体的移动速度
//     increaseSpeed(entity, intensity) {
//         // 修改移动速度属性
//     }

// }