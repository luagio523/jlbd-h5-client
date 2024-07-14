import { ECSComponent } from "../ecs/ECSComponent";

class ComponentFactory {
    private static instance: ComponentFactory;
    private componentPools: Map<string, ECSComponent[]> = new Map();
  
    private constructor() {}
  
    static getInstance(): ComponentFactory {
        if (!ComponentFactory.instance) {
            ComponentFactory.instance = new ComponentFactory();
        }
        return ComponentFactory.instance;
    }
  
    createComponent(componentName: string): ECSComponent {
        let pool = this.componentPools.get(componentName);
        if (!pool) {
            pool = [];
            this.componentPools.set(componentName, pool);
        }
    
        if (pool.length > 0) {
            return pool.pop()!;
        } else {
            // 这里应该根据componentName创建相应的组件实例
            return null; // 示例中使用基类，实际使用时应该创建具体的组件类
        }
    }
  
    recycleComponent(componentName: string, component: ECSComponent): void {
        // component.reset();
        let pool = this.componentPools.get(componentName);
        if (!pool) {
            pool = [];
            this.componentPools.set(componentName, pool);
        }
        pool.push(component);
    }
  }