interface IAnimationParser {
    parse(resource: any): void;
    getAnimation(action: ActType, direction: number): any;
}


class TextureAtlasParser implements IAnimationParser {
    private frames: { [key: string]: any } = {};

    public parse(resource: any) {
        this.frames = resource.frames; // 假设资源格式符合要求
    }

    public getAnimation(action: ActType, direction: number): any {
        // 根据动作和方向返回合图帧
        // 具体实现依赖于合图的结构
    }
}



class SpriteSheetParser implements IAnimationParser {
    private animations: { [key: string]: any } = {};

    public parse(resource: any) {
        this.animations = resource.mc; // 假设资源格式符合要求
    }

    public getAnimation(action: ActType, direction: number): any {
        const actionName = this.getActionName(action);
        return this.animations[`body803_1_${direction}${actionName}`];
    }

    private getActionName(action: ActType): string {
        switch (action) {
            case ActType.ACT_IDLE: return '_0';
            case ActType.ACT_WALK: return '_1';
            case ActType.ACT_RUN: return '_2';
            case ActType.ACT_ATTACK: return '_a';
            // 添加其他动作的映射
            default: return '_0';
        }
    }
}






// // 创建资源解析器
// const spriteSheetParser = new SpriteSheetParser();
// spriteSheetParser.parse({
//     mc: {
//         body803_1_0a: {
//             frameRate: 12,
//             frames: [
//                 { res: "00024", x: -100, y: -190 },
//                 { res: "00025", x: -189, y: -209 },
//                 // 省略其他帧
//             ]
//         }
//     }
// });

// // 创建 BodyPlayer
// const bodyPlayer = new BodyPlayer(spriteSheetParser);
// bodyPlayer.setAction(ActType.ACT_ATTACK);
// bodyPlayer.setDirection(0); // 设置方向为0