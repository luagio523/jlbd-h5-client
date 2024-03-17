import { BaseSystem } from "./BaseSystem";

export class AttackSystem extends BaseSystem{

    constructor() {
        
    }

    attack(target: Entity, damage: number): void {
        // 模拟攻击动画
        const animationState = target.getComponent<AnimationState>('animationState');
        animationState.current = "attack";

        // 执行掉血
        const health = target.getComponent<Health>('health');
        health.value -= damage;

        console.log(`Attacked entity ${target.id}, new health is ${health.value}`);
    }

    update(): void {
        // 更新所有实体的动画状态
        this.entities.forEach(entity => {
            const animationState = entity.getComponent<AnimationState>('animationState');
            // 重置动画状态为默认值，例如 'idle'
            animationState.current = "idle";
        });
    }
}







// 实体（Entity）是组件（Component）的容器，相当于一个标识或者ID，它本身没有实际的功能或者数据。
// 组件（Component）则包含数据，但不包含逻辑。例如位置、速度、健康值等。
// 系统（System）管理逻辑和行为，它会遍历拥有特定组件的实体来执行游戏逻辑。

// // 创建主角实体并添加组件
// const hero = new Entity();
// hero.id = 'hero';
// hero.addComponent('position', new Position());
// hero.addComponent('health', new Health());
// hero.addComponent('animationState', new AnimationState());

// // 定义系统，并添加到游戏系统列表中
// const entities = [hero]; // 此处仅以单个英雄为例
// const attackSystem = new AttackSystem(entities);

// // 假设这是响应一个点击事件的函数
// function onClickAttack(target: Entity): void {
//     attackSystem.attack(target, 10); // 假设每次攻击扣除10点血
// }

// // 游戏的主循环
// function gameLoop(): void {
//     // 在这里我们会调用所有系统的更新方法
//     attackSystem.update();

//     // 更多的游戏逻辑...

//     requestAnimationFrame(gameLoop);
// }

// // 开始游戏循环
// gameLoop();

// // 当玩家点击攻击按钮时调用
// onClickAttack(hero);