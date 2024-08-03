import { ECSEntity } from "../ecs/ECSEntity";

export type TriggerCondition = (entity: ECSEntity, context: any) => boolean;

export type ConditionGroup = {
    type: 'AND' | 'OR';
    conditions: (TriggerCondition | ConditionGroup)[];
};


export class Trigger {
    id: string;
    conditionGroup: ConditionGroup;
    actions: ((entity: ECSEntity, context: any) => void)[];

    constructor(id: string) {
        this.id = id;
        this.conditionGroup = { type: 'AND', conditions: [] };
        this.actions = [];
    }

    addCondition(condition: TriggerCondition, groupType: 'AND' | 'OR' = 'AND'): Trigger {
        if (this.conditionGroup.type !== groupType) {
            this.conditionGroup = { type: groupType, conditions: [this.conditionGroup, condition] };
        } else {
            this.conditionGroup.conditions.push(condition);
        }
        return this;
    }

    addConditionGroup(group: ConditionGroup): Trigger {
        this.conditionGroup.conditions.push(group);
        return this;
    }

    addAction(action: (entity: ECSEntity, context: any) => void): Trigger {
        this.actions.push(action);
        return this;
    }

    check(entity: ECSEntity, context: any): boolean {
        if (this.evaluateConditionGroup(this.conditionGroup, entity, context)) {
            this.execute(entity, context);
            return true;
        }
        return false;
    }

    private evaluateConditionGroup(group: ConditionGroup, entity: ECSEntity, context: any): boolean {
        if (group.type === 'AND') {
            return group.conditions.every(condition => 
                condition instanceof Function ? condition(entity, context) : this.evaluateConditionGroup(condition, entity, context)
            );
        } else { // OR
            return group.conditions.some(condition => 
                condition instanceof Function ? condition(entity, context) : this.evaluateConditionGroup(condition, entity, context)
            );
        }
    }

    execute(entity: ECSEntity, context: any) {
        console.log(`Executing trigger ${this.id}`);
        this.actions.forEach(action => action(entity, context));
    }
}








// const doorTrigger = new Trigger('door-trigger')
//     .addCondition(TriggerConditions.ENTER)
//     .addCondition(TriggerConditions.IN_RANGE(5))
//     .addConditionGroup({
//         type: 'OR',
//         conditions: [
//             TriggerConditions.HAS_ITEM('key'),
//             (entity, context) => context.door.isUnlocked()
//         ]
//     })
//     .addAction((entity, context) => {
//         if (context.door.isUnlocked()) {
//             console.log('Player opened the unlocked door!');
//         } else {
//             console.log('Player opened the door with the key!');
//             entity.getComponent('Inventory').removeItem('key');
//             context.door.unlock();
//         }
//         context.door.open();
//     });

// 在这个例子中：
// 玩家必须进入区域（ENTER）。
// 玩家必须在门的范围内（IN_RANGE）。
// 玩家必须满足以下条件之一：
// 拥有钥匙（HAS_ITEM('key')）
// 门已经解锁（context.door.isUnlocked()）

// const complexTrigger = new Trigger('complex-trigger')
//     .addCondition(TriggerConditions.ENTER)
//     .addConditionGroup({
//         type: 'OR',
//         conditions: [
//             {
//                 type: 'AND',
//                 conditions: [
//                     TriggerConditions.HAS_ITEM('key'),
//                     TriggerConditions.IN_RANGE(5)
//                 ]
//             },
//             {
//                 type: 'AND',
//                 conditions: [
//                     (entity, context) => entity.getComponent('Skills').hasSkill('lockpicking'),
//                     TriggerConditions.IN_RANGE(2)
//                 ]
//             }
//         ]
//     })
//     .addAction((entity, context) => {
//         // 执行开门动作
//     });

// 这个触发器会在玩家进入区域，并且满足以下条件之一时触发：
// 玩家有钥匙且在5单位范围内
// 玩家有开锁技能且在2单位范围内