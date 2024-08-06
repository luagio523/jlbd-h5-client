export interface Command {
    execute(): void;
    undo(): void;
    redo(): void;
}



// class MoveCommand implements Command {
//     private receiver: any;
//     private x: number;
//     private y: number;
//     private previousX: number;
//     private previousY: number;
  
//     constructor(receiver: any, x: number, y: number) {
//       this.receiver = receiver;
//       this.x = x;
//       this.y = y;
//       this.previousX = receiver.x;
//       this.previousY = receiver.y;
//     }
  
//     execute(): void {
//       this.previousX = this.receiver.x;
//       this.previousY = this.receiver.y;
//       this.receiver.moveTo(this.x, this.y);
//     }
  
//     undo(): void {
//       this.receiver.moveTo(this.previousX, this.previousY);
//     }
  
//     redo(): void {
//       this.execute();
//     }
//   }