import { Node } from "cc";

export class DropLayer extends Node {
    // private drops: DropItem[] = [];

    // constructor() {
    //     super('DropLayer');
    // }

    // addDrop(drop: DropItem): void {
    //     this.drops.push(drop);
    //     this.addChild(drop.node);
    //     this.sortDrops();
    // }

    // removeDrop(drop: DropItem): void {
    //     const index = this.drops.indexOf(drop);
    //     if (index !== -1) {
    //         this.drops.splice(index, 1);
    //         this.removeChild(drop.node);
    //     }
    // }

    // private sortDrops(): void {
    //     this.drops.sort((a, b) => b.node.position.y - a.node.position.y);
    //     this.drops.forEach((drop, index) => {
    //         drop.node.setSiblingIndex(index);
    //     });
    // }
}