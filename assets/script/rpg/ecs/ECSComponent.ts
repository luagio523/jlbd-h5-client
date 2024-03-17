
/**
 * 组件
 */
export abstract class ECSComponent  {
    /**
     * 组件的类名
     */
    get name(): string {
        return this.constructor.name;
    }

    /**
     * 组件的所有者实体 ID
     */
    entityId = "";
}
