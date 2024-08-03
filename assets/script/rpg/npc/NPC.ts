interface NPC {
    id: string;
    name: string;
    type: string;
    level: number;
    alignment: string;
    appearance: string;
    health: number;
    attack: number;
    defense: number;
    speed: number;
    magic: number;
    skills: Skill[];
    dialogues: Dialogue[];
    quests: Quest[];
    trades: Trade[];
  }
  
  interface Skill {
    name: string;
    description: string;
  }
  
  interface Dialogue {
    trigger: string;
    text: string;
    options: DialogueOption[];
  }
  
  interface DialogueOption {
    text: string;
    result: string;
  }
  
  interface Quest {
    id: string;
    name: string;
    description: string;
    type: string;
    conditions: string[];
    rewards: Reward[];
  }
  
  interface Reward {
    type: string;
    value: number;
  }
  
  interface Trade {
    id: string;
    name: string;
    type: string;
    price: number;
    description: string;
    attributes: { [key: string]: number };
  }
  