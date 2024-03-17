import { ECSComponent } from "../ecs/ECSComponent";

export class HealthComponent extends ECSComponent {
    constructor(public value: number) {super()}
}