import { Node, Vec3 } from "cc";

class EffectUtil {


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
}