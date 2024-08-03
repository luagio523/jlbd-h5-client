import { ECSEntity } from '../ecs/ECSEntity';
import { NPCInteraction } from '../npc/NPCInteraction';
import { TriggerConditions } from '../trigger/TriggerCondition';
import { ConfigManager } from '../../core/common/config/ConfigManager';
import { DialogueManager } from '../../core/dialogue/DialogueManager';
import { NPCInteractiveComponent } from '../component/NPCInteractiveComponent';

export class InteractionManager {
    private static instance: InteractionManager;
    private configManager: ConfigManager = ConfigManager.getInstance();

    private constructor() { }

    public static getInstance(): InteractionManager {
        if (!this.instance) {
            this.instance = new InteractionManager();
        }
        return this.instance;
    }

    // 加载对话数据
    public async getNPCInteractions(npcId: string): Promise<NPCInteraction[]> {
        const jsonAsset = await this.configManager.loadJSON(npcId, true);
        const dialogues = this.parseInteractions(jsonAsset.json);
        return dialogues;
    }

    private parseInteractions(data: any): NPCInteraction[] {
        return data.triggers.map(item => {
            new NPCInteraction(TriggerConditions[item.trigger.type](item.trigger.value), data.priority, item.segmentId);
        });
    }

    checkInteractions(npc: ECSEntity, context: any) {
        const component = npc.getComponent(NPCInteractiveComponent);
        let highestPriorityInteraction: NPCInteraction | null = null;
        for (const interaction of component.interactions) {
            if (interaction.condition(npc, context)) {
                // 如果找到有效的交互，检查优先级
                if (!highestPriorityInteraction || interaction.priority > highestPriorityInteraction.priority) {
                    highestPriorityInteraction = interaction;
                }
            }
        }
        // 如果找到优先级最高的交互，触发它
        if (highestPriorityInteraction) {
            this.triggerInteraction(highestPriorityInteraction);
        }

    }


    private triggerInteraction(interaction: NPCInteraction): void {
        DialogueManager.getInstance().startDialogue(interaction.segmentId);
    }


    // handleInteraction(player) {

    // }

    // isPlayerInteracting(npc, player) {
    //     // 判断玩家是否与 NPC 互动
    //     // 返回 true 或 false
    // }

    // updateInteractions(deltaTime) {
    //     // 更新与交互相关的状态和行为

    // }
}
