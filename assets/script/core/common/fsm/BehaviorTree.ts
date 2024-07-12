// 纯lua实现的一个简单的行为树
// 编写AI形式如下,可用思维导图制作后写个脚本导出
// SEL:AI
//     SEQ:去球场打球
//         CON:不是情人节:isNotValentinesDay
//         ACT:去球场:gotoCourt
//         ACT:打球:playBall
//     SEL:约会
//         SEL:买花
//             SEQ:回家拿钱
//                 CON:女友没花:hasnotFlowerGF
//                 CON:自己没花没带够钱:hasnotFlowerSelf:100
//                 ACT:走回家:goHome 
//                 ACT:拿钱:fetchMoney
//             SEQ:去花店买花
//                 CON:女友没花:hasnotFlowerGF
//                 CON:自己没花:hasnotFlowerSelf
//                 ACT:走去花店:gotoFlowerShop
//                 ACT:买花:buyFlower
//         SEQ:见女友
//             ACT:去找女友:gotoGF
//             CON:女友还在:isHereGF
//             CON:女友没花:hasnotFlowerGF
//             ACT:送花:giveFlower

// SEL:怪物AI
//     SEL:检测是否休息或追击
//         SEQ:如果天黑就休息
//             CON:现在是夜晚吗:是否夜晚
//             ACT:休息:休息
//         SEQ:发现主角并攻击
//             SEL:选择攻击主角或宠物
//                 SEQ:如果主角宠物出现则攻击宠物
//                     CON:主角宠物在视野中吗:宠物是否在视线中
//                     ACT:追踪并攻击宠物:追踪并攻击宠物
//                 SEQ:追踪并攻击主角
//                     CON:已在追逐或主角在视野中:是否追逐或在视线中
//                     ACT:向主角移动:向主角移动
//                     SEQ:攻击
//                         CON:到达主角位置:是否到达主角位置
//                         ACT:开始攻击主角:开始攻击主角

// 使用方式如下,其中entity为人物model对象,上面定义的方法实现在model中
// local tree = BehaviorTree.new(ai_string)
// tree:behave(entity)
// 要每帧调用的


enum EVALUATE_TYPE {
    SELECTOR = "SEL",
    PARALLEL = "PAR",
    SEQUENCE = "SEQ",
    CONDITIONAL = "CON",
    BEHAVIOR = "ACT",
}

type NodeType = EVALUATE_TYPE | string;

interface INode {
    bttype: NodeType;
    bttypeParam?: string;
    children?: INode[];
    fun?: string;
    param?: string;
    // More fields can be added if needed
}


// 定义一个接口用于行为执行
interface IBehaviorExecutor {
    condition(entity: any, conditionName: string, ...params: any[]): boolean;
    action(entity: any, actionName: string, ...params: any[]): boolean;
}

class BehaviorTree {
    private fulltree: INode;

    private behaviorExecutor: IBehaviorExecutor;

    constructor(fulltree: string | INode, behaviorExecutor: IBehaviorExecutor) {
        if (typeof fulltree === 'string') {
            this.fulltree = this.createAItable(fulltree);
        } else {
            this.fulltree = fulltree;
        }
        this.behaviorExecutor = behaviorExecutor;
    }

    private createAItable(aistring: string): INode {
        const aiarray: string[] = aistring.split("\n").map(s => s.trim());
        const result: INode = { bttype: "ROOT" }; // Dummy root node
        const stack: Array<INode & { level: number }> = [{ ...result, level: 0 }];
        
        aiarray.forEach(line => {
            if (line) {
                const level = (line.match(/^\t*/)[0].length) + 1;
                const infos = line.trim().split(':').map(s => s.toUpperCase());
                const [bttype, name, fun, param] = infos;
                let current = stack[stack.length - 1];
                
                while (current.level >= level) {
                    stack.pop();
                    current = stack[stack.length - 1];
                }
                
                const newNode: INode = { bttype, fun, param };
                if (!current.children) {
                    current.children = [];
                }

                current.children.push(newNode);
                
                if ([EVALUATE_TYPE.SELECTOR, EVALUATE_TYPE.SEQUENCE, EVALUATE_TYPE.PARALLEL].includes(bttype as EVALUATE_TYPE)) {
                    stack.push({ ...newNode, level, children: [] });
                }
            }
        });
        
        return result.children[0]; // We return the first child of our dummy root node as the actual root
    }

    public behave(entity: any) {
        return this.behaveNode(this.fulltree, entity);
    }

    private behaveNode(node: INode, entity: any): boolean {
        switch (node.bttype) {
            case EVALUATE_TYPE.CONDITIONAL:
                return this.condition(node, entity);
            case EVALUATE_TYPE.BEHAVIOR:
                return this.action(node, entity);
            case EVALUATE_TYPE.SELECTOR:
                return node.children.some(child => this.behaveNode(child, entity));
            case EVALUATE_TYPE.SEQUENCE:
                return node.children.every(child => this.behaveNode(child, entity));
            case EVALUATE_TYPE.PARALLEL:
                return this.parallel(node, entity);
            default:
                return false; // In case of an unknown type, return false
        }
    }


    private condition(node: INode, entity: any): boolean {
        return this.behaviorExecutor.condition(entity, node.fun, node.param);
    }

    private action(node: INode, entity: any): boolean {
        return this.behaviorExecutor.action(entity, node.fun, node.param);
    }

    // private condition(node: INode, entity: any): boolean {
    //     if (node.fun in entity) {
    //         return entity[node.fun](node.param);
    //     } else {
    //         throw new Error(`Condition function ${node.fun} not found in entity.`);
    //     }
    // }

    // private action(node: INode, entity: any): boolean {
    //     if (node.fun in entity) {
    //         return entity[node.fun](node.param) !== false;
    //     } else {
    //         throw new Error(`Action function ${node.fun} not found in entity.`);
    //     }
    // }

    private parallel(node: INode, entity: any): boolean {
        if (node.children) {
            const results = node.children.map(child => this.behaveNode(child, entity));
            const count = results.filter(result => result).length;
            const bttypeParam = node.bttypeParam || "ALL";
            switch (bttypeParam) {
                case "ALL":
                    return count === node.children.length;
                case "TRUE":
                    return true;
                case "FALSE":
                    return false;
                default:
                    const targetCount = parseInt(bttypeParam, 10);
                    if (!isNaN(targetCount)) {
                        return count >= targetCount;
                    }
                    return false;
            }
        }
        return false;
    }
}
