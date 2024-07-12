export class InputManager {
    private static instance: InputManager;
    private listeners: Map<string, Set<(eventType: string, event: any) => void>> = new Map();
    public readonly mouseEvents = ['mousedown', 'mousemove', 'mouseup'];
    public readonly touchEvents = ['touchstart', 'touchmove', 'touchend'];
    public readonly joystickEvents = ['joystick'];

    private constructor() {
        this.initializeEventListeners();
    }

    public static getInstance(): InputManager {
        if (!InputManager.instance) {
            InputManager.instance = new InputManager();
        }
        return InputManager.instance;
    }

    private initializeEventListeners(): void {
        this.mouseEvents.forEach(eventType => {
            this.listeners.set(eventType, new Set());
        });
        this.touchEvents.forEach(eventType => {
            this.listeners.set(eventType, new Set());
        });
        this.joystickEvents.forEach(eventType => {
            this.listeners.set(eventType, new Set());
        });
    }

    public addListener(eventType: string, callback: (eventType: string, event: any) => void): void {
        if (this.listeners.has(eventType)) {
            this.listeners.get(eventType)!.add(callback);
        }
    }

    public removeListener(eventType: string, callback: (eventType: string, event: any) => void): void {
        if (this.listeners.has(eventType)) {
            this.listeners.get(eventType)!.delete(callback);
        }
    }

    public addMouseListeners(callback: (eventType: string, event: any) => void): void {
        this.mouseEvents.forEach(eventType => {
            this.addListener(eventType, callback);
        });
    }

    public removeMouseListeners(callback: (eventType: string, event: any) => void): void {
        this.mouseEvents.forEach(eventType => {
            this.removeListener(eventType, callback);
        });
    }

    public addTouchListeners(callback: (eventType: string, event: any) => void): void {
        this.touchEvents.forEach(eventType => {
            this.addListener(eventType, callback);
        });
    }

    public removeTouchListeners(callback: (eventType: string, event: any) => void): void {
        this.touchEvents.forEach(eventType => {
            this.removeListener(eventType, callback);
        });
    }

    public addJoystickListeners(callback: (eventType: string, event: any) => void): void {
        this.joystickEvents.forEach(eventType => {
            this.addListener(eventType, callback);
        });
    }

    public removeJoystickListeners(callback: (eventType: string, event: any) => void): void {
        this.joystickEvents.forEach(eventType => {
            this.removeListener(eventType, callback);
        });
    }

    public handleInput(eventType: string, event: any): void {
        const callbacks = this.listeners.get(eventType);
        if (callbacks) {
            callbacks.forEach(callback => callback(eventType, event));
        }
    }

    public updateJoystickState(x: number, y: number): void {
        this.handleInput('joystick', { x, y });
    }
}


// export class InputManager {
//     private static instance: InputManager;
//     private listeners: Map<string, Set<(eventType: string, event: any) => void>> = new Map();
//     public readonly inputEvents = ['touchstart', 'touchmove', 'touchend', 'mousedown', 'mousemove', 'mouseup'];

//     private constructor() {
//         this.initializeEventListeners();
//     }

//     public static getInstance(): InputManager {
//         if (!InputManager.instance) {
//             InputManager.instance = new InputManager();
//         }
//         return InputManager.instance;
//     }

//     private initializeEventListeners(): void {
//         this.inputEvents.forEach(eventType => {
//             this.listeners.set(eventType, new Set());
//         });
//     }

//     public addListener(callback: (eventType: string, event: any) => void): void {
//         this.inputEvents.forEach(eventType => {
//             this.listeners.get(eventType)!.add(callback);
//         });
//     }

//     public removeListener(callback: (eventType: string, event: any) => void): void {
//         this.inputEvents.forEach(eventType => {
//             this.listeners.get(eventType)!.delete(callback);
//         });
//     }

//     //接受外部事件源的输入事件，并分发给监听者
//     public handleInput(eventType: string, event: any): void {
//         const callbacks = this.listeners.get(eventType);
//         if (callbacks) {
//             callbacks.forEach(callback => callback(eventType, event));
//         }
//     }


//     // 新增：处理摇杆输入
//     public handleJoystickInput(x: number, y: number): void {
//         const joystickEvent = { x, y };
//         this.handleInput('joystick', joystickEvent);
//     }
// }





// class Game {
//     private inputManager: InputManager;

//     constructor() {
//         this.inputManager = InputManager.getInstance();
//         this.setupInputHandling();
//     }

//     private setupInputHandling(): void {
//         const handleInput = (eventType: string, event: any) => {
//             this.inputManager.handleInput(eventType, event);
//         };

//         // 这里可以根据实际需求来决定如何触发handleInput
//         // 例如，如果你使用某个游戏引擎的输入系统：
//         // gameEngine.on('input', (eventType, event) => handleInput(eventType, event));

//         // 或者，如果你仍然想使用DOM事件：
//         this.inputEvents.forEach(eventType => {
//             document.addEventListener(eventType, (event) => handleInput(eventType, event));
//         });
//     }

//     // ... 其他游戏逻辑 ...
// }