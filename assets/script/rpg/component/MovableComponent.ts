import { Vec2 } from "cc";
import { ECSComponent } from "../ecs/ECSComponent";
import { ecsclass } from "../ecs/__private";

ecsclass("MovableComponent")
export class MovableComponent extends ECSComponent {
    private baseSpeed: number;
    private speed: number;
    private acceleration: number;
    private maxSpeed: number;
    private speedPerSecond: number;

    constructor() {
        super();
        
    }

    public initialize(baseSpeed: number=0): void {
        this.baseSpeed = baseSpeed;
        this.speed = this.baseSpeed;
        this.acceleration = 0;
        this.maxSpeed = 522;
    }

    public getBaseSpeed(): number {
        return this.baseSpeed;
    }
   

   // 获取每秒速度
    public getSpeedPerSecond(): number {
        return this.speedPerSecond;
    }

    public setAcceleration(acceleration: number): void {
        this.acceleration = acceleration;
    }

    public updateSpeed(newSpeed: number): void {
        this.speed = newSpeed;
        this.speedPerSecond = 75+this.speed / 100;
    }

    public accelerateSpeed( dt: number): void {
        if (this.acceleration !== 0) {
            this.speed += this.acceleration * dt;
            this.speed = Math.max(0, Math.min(this.speed, this.maxSpeed));
        }
    }
}