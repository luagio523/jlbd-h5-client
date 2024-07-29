export  const DialogueEvent = {
    ShowDialogue: "showDialogue",
    PlayAnimation: "playAnimation",
    ShowChoice: "showChoice",
    DialogueComplete: "dialogueComplete"
};



// 定义对话类型的接口
export interface Dialogue {
    speaker: string; // 发言者
    text: string; // 对话文本
    avatar: string; // 角色头像的路径
    background: string; // 背景图的路径
    position: "left" | "right"; // 发言者位置
}

// 定义动画类型的接口
export interface DialogueAnimation {
    animation: string; // 动画的路径或名称
}

// 定义选择类型的接口
export interface DialogueChoice {
    question: string; // 选择问题
    options: ChoiceOption[]; // 选择项
}

// 定义选择项的接口
export interface ChoiceOption {
    text: string; // 选项文本
    nextSegment: string; // 选择后跳转到的段落ID
}

