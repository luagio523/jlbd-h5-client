import { Node, Vec2, Vec3 } from "cc";

export class EffectUtil {


    static adjustAnimationBetweenCharacters(sourceNode: Node, targetNode: Node, animeNode: Node) {
        // 获取两个角色的世界位置
        let sourcePosition = sourceNode.worldPosition;
        let targetPosition = targetNode.worldPosition;

        // 计算方向向量
        let direction = targetPosition.subtract(sourcePosition);

        // 计算角度（以弧度为单位）
        let angle = Math.atan2(direction.y, direction.x);

        // 将角度转换为欧拉角（以度为单位），这个值可以用来旋转节点
        let angleDegrees = angle * (180 / Math.PI);

        // 计算两者之间的距离
        let distance = direction.length();

        // 调整 animeNode 的位置到 sourceNode
        animeNode.setPosition(sourcePosition);

        // 调整 animeNode 的 scaleX 来适应距离，而 scaleY 和 scaleZ 保持不变
        let originalScaleX = animeNode.scale.x;  // 假设动画的原始 scaleX 是 1
        animeNode.setScale(distance / originalScaleX, 1, 1);

        // 旋转 animeNode 的 z 轴以对齐两个角色的位置
        animeNode.eulerAngles = new Vec3(0, 0, angleDegrees);

    }


    /**
     * 计算技能发射方向向量
     * @param forward 前进方向向量
     * @param angle 相隔角度（度）
     * @param count 技能数量
     * @returns 发射方向向量数组
     */
    static  calculateSkillDirections(forward: Vec2, angle: number, count: number): Vec2[] {
        const directions: Vec2[] = [];

        if (count === 1) {
            // 单个技能，直接沿前进方向发射
            directions.push(forward.clone().normalize());
        } else if (count * angle <= 360) {
            // 未布满周身，按前进方向对称分布
            const totalAngle = (count - 1) * angle;
            const startAngle = -totalAngle / 2;
            
            for (let i = 0; i < count; i++) {
                const currentAngle = startAngle + i * angle;
                const dir = new Vec2();
                const rad = currentAngle * Math.PI / 180;
                dir.x = forward.x * Math.cos(rad) - forward.y * Math.sin(rad);
                dir.y = forward.x * Math.sin(rad) + forward.y * Math.cos(rad);
                directions.push(dir.normalize());
            }
        } else {
            // 布满周身，按照数量平均分布在周身
            const stepAngle = 360 / count;
            for (let i = 0; i < count; i++) {
                const dir = new Vec2();
                const rad = i * stepAngle * Math.PI / 180;
                dir.x = forward.x * Math.cos(rad) - forward.y * Math.sin(rad);
                dir.y = forward.x * Math.sin(rad) + forward.y * Math.cos(rad);
                directions.push(dir.normalize());
            }
        }

        return directions;
    }
}




//  /**
//      * 发射技能
//      * @param forward 前进方向
//      * @param angle 相隔角度
//      * @param count 技能数量
//      */
//  public shootSkills(forward: Vec2, angle: number, count: number) {
//     const directions = calculateSkillDirections(forward, angle, count);
//     directions.forEach(direction => {
//         this.spawnSkill(direction);
//     });
// }

// /**
//  * 生成技能对象
//  * @param direction 发射方向
//  */
// private spawnSkill(direction: Vec2) {
//     const skillNode = new Node('Skill');
//     this.parentNode.addChild(skillNode);
//     skillNode.setPosition(this.parentNode.position);
//     // 将方向向量转换为适当的旋转
//     const angle = Math.atan2(direction.y, direction.x);
//     skillNode.setRotationFromEuler(0, 0, angle * 180 / Math.PI);
//     // 这里可以添加技能的具体逻辑，例如添加组件、设置速度等
// }