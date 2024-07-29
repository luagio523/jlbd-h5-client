import { Vec2 } from "cc";
import { ECSComponent } from "../ecs/ECSComponent";
import { ecsclass } from "../ecs/__private";

ecsclass("MovableComponent")
export class MovableComponent extends ECSComponent {
    private baseSpeed: number;
    private speed: number;
    private acceleration: number;
    private maxSpeed: number;

    constructor(baseSpeed: number, maxSpeed: number) {
        super();
        this.baseSpeed = baseSpeed;
        this.speed = baseSpeed;
        this.acceleration = 0;
        this.maxSpeed = maxSpeed;
    }

    public getBaseSpeed(): number {
        return this.baseSpeed;
    }

    public getSpeed(): number {
        return this.speed;
    }

    public setAcceleration(acceleration: number): void {
        this.acceleration = acceleration;
    }

    public updateSpeed(newSpeed: number, dt: number): void {
        this.speed = Math.max(0, Math.min(newSpeed, this.maxSpeed));
        
        if (this.acceleration !== 0) {
            this.speed += this.acceleration * dt;
            this.speed = Math.max(0, Math.min(this.speed, this.maxSpeed));
        }
    }
}