import { Vec2 } from "cc";
import { ECSComponent } from "../ecs/ECSComponent";
import { ecsclass } from "../ecs/__private";
ecsclass("TransformComponent")
export class TransformComponent extends ECSComponent {
    position: Vec2;
    rotation: number;
    heading: Vec2;
    targetPosition: Vec2;
    turnRate: number;

    constructor() {
        super();
        this.position = Vec2.ZERO;
        this.rotation = 0;
        this.heading = new Vec2(0,1).rotate( this.rotation);
        this.turnRate = 1;
    }

    setTargetPosition(target: Vec2): void {
        this.targetPosition = target;
    }

    updatePosition(deltaTime: number, speed: number): void {
        if (this.targetPosition) {
            const movement = this.heading.multiplyScalar(speed * deltaTime);
            this.position = this.position.add(movement);
        }
    }

    updateHeading(deltaTime: number): void {
        if (this.targetPosition) {
            const desiredDirection = this.targetPosition.subtract(this.position).normalize();
            const angle = this.heading.signAngle(desiredDirection);
            const maxRotation = this.turnRate * deltaTime;
            
            if (Math.abs(angle) > maxRotation) {
                this.heading = this.heading.rotate(Math.sign(angle) * maxRotation);
            } else {
                this.heading = desiredDirection;
            }
            
            this.rotation = Math.atan2(this.heading.y, this.heading.x);
        }
    }
}