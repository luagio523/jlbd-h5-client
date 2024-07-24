class TextureAtlasParser implements IAnimationParser {
    private animations: { [model: string]: { [action: string]: any[] } } = {};

    /**
     * 解析合图资源
     * @param resource - 加载的合图资源
     */
    public parse(resource: any) {
        // 假设 resource 是一个包含 frames 的对象
        const frames = resource.frames;

        for (const frameName in frames) {
            // 解析模型名和动作名
            const match = this.parseFrameName(frameName);
            if (match) {
                const { model, action } = match;
                if (!this.animations[model]) {
                    this.animations[model] = {};
                }
                if (!this.animations[model][action]) {
                    this.animations[model][action] = [];
                }
                // 添加帧信息到对应的模型和动作
                this.animations[model][action].push({
                    name: frameName,
                    frame: frames[frameName],
                    rect: frames[frameName].frame,
                    offset: frames[frameName].offset,
                    rotated: frames[frameName].rotated,
                    sourceColorRect: frames[frameName].sourceColorRect,
                    sourceSize: frames[frameName].sourceSize,
                });
            }
        }
    }

    /**
     * 根据帧名解析模型名和动作名
     * @param frameName - 帧名
     * @returns 返回包含模型名和动作名的对象
     */
    private parseFrameName(frameName: string): { model: string; action: string } | null {
        const regex = /^(?<model>\w+)_(?<action>\w+)_(\d+)\.png$/; // 假设帧名格式为 "Model_Action_0.png"
        const match = frameName.match(regex);
        if (match && match.groups) {
            return {
                model: match.groups.model,
                action: match.groups.action,
            };
        }
        return null;
    }

    /**
     * 根据模型名和动作名获取对应的序列帧列表
     * @param model - 模型名
     * @param action - 动作名
     * @returns 返回对应的序列帧列表
     */
    public getAnimation(model: string, action: string): any[] {
        if (this.animations[model] && this.animations[model][action]) {
            return this.animations[model][action];
        }
        return []; // 如果没有找到，返回空数组
    }
}