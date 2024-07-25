// import { Vec3 } from "cc";
// import { DLinkListNode, DoublyLinkedList } from "../core/common/collection/LinkList";
// import { BaseEntity } from "./BaseEntity";

// //timeHandler的双向链表
// class EntityDLinkList<T extends BaseEntity> extends DoublyLinkedList<T> {
//     private nodes: Map<number, DLinkListNode<T>> = new Map();

//     append(data: T): DLinkListNode<T> {
//         const newNode = this.push(data);
//         this.nodes.set(data.entityIndex, newNode); // 在字典中添加
//         return newNode;
//     }
    
//     getNodeByKey(key: number): DLinkListNode<T> {
//         return this.nodes.get(key);
//     }

//     deleteNodeByKey(key: number): DLinkListNode<T> {
//         const node = this.nodes.get(key); // 从字典中获取
//         if (node === undefined) {
//             return null;
//         }
//         this.nodes.delete(key); // 从字典中删除
//         this.deleteNode(node); // 使用父类的deleteNode方法
//         return node 
//     }
// }

// class CEntities{
//     protected entities:EntityDLinkList<BaseEntity>

//     public constructor(){
//         this.entities = new EntityDLinkList<BaseEntity>
//     }

//     public CreateByClassname(className: string): BaseEntity{
//         return null 
//     }

//     public FindAllByClassname(className:string):BaseEntity[]{
//         let entities = new Array<BaseEntity>()
//         let node: DLinkListNode<BaseEntity> = this.entities.head;
//         while (node) {
//             let entity = node.data 
//             //判断类名
//             if (entity.constructor.name == className ){
//                 entities.push(node.data)
//             }
//             node = node.next;
//         }

//         return entities
//     }

//     public FindAllByClassnameWithin(className: string, location: Vec3, radius: number):BaseEntity[]{
//         let entities = new Array<BaseEntity>()
//         let node: DLinkListNode<BaseEntity> = this.entities.head;
//         while (node) {
//             let entity = node.data 
//             //判断类名
//             if (entity.constructor.name == className ){
//                 entities.push(node.data)
//             }
//             node = node.next;
//         }

//         return entities
//     }
// }

// // class  CEntities {
// //     /**
// //      * Creates an entity by classname.
// //      */
// //     CreateByClassname(className: string): CBaseEntity;
// //     /**
// //      * Finds all entities by class name. Returns an array containing all the found
// //      * entities.
// //      */
// //     FindAllByClassname(className: string): CBaseEntity[];
// //     /**
// //      * Find entities by class name within a radius.
// //      */
// //     FindAllByClassnameWithin(className: string, location: Vector, radius: number): CBaseEntity[];
// //     /**
// //      * Find entities by model name.
// //      */
// //     FindAllByModel(modelName: string): CBaseEntity[];
// //     /**
// //      * Find all entities by name. Returns an array containing all the found entities
// //      * in it.
// //      */
// //     FindAllByName(name: string): CBaseEntity[];
// //     /**
// //      * Find entities by name within a radius.
// //      */
// //     FindAllByNameWithin(name: string, location: Vector, radius: number): CBaseEntity[];
// //     /**
// //      * Find entities by targetname.
// //      */
// //     FindAllByTarget(target: string): CBaseEntity[];
// //     /**
// //      * Find entities within a radius.
// //      */
// //     FindAllInSphere(location: Vector, radius: number): CBaseEntity[];
// //     /**
// //      * Find entities by class name. Pass 'null' to start an iteration, or reference to
// //      * a previously found entity to continue a search.
// //      */
// //     FindByClassname(previous: CBaseEntity | undefined, className: string): CBaseEntity | undefined;
// //     /**
// //      * Find entities by class name nearest to a point.
// //      */
// //     FindByClassnameNearest(className: string, location: Vector, radius: number): CBaseEntity | undefined;
// //     /**
// //      * Find entities by class name within a radius. Pass 'null' to start an iteration,
// //      * or reference to a previously found entity to continue a search.
// //      */
// //     FindByClassnameWithin(
// //         previous: CBaseEntity | undefined,
// //         className: string,
// //         location: Vector,
// //         radius: number,
// //     ): CBaseEntity | undefined;
// //     /**
// //      * Find entities by model name. Pass 'null' to start an iteration, or reference to
// //      * a previously found entity to continue a search.
// //      */
// //     FindByModel(previous: CBaseEntity | undefined, modelName: string): CBaseEntity | undefined;
// //     /**
// //      * Find entities by model name within a radius. Pass 'null' to start an iteration,
// //      * or reference to a previously found entity to continue a search.
// //      */
// //     FindByModelWithin(
// //         previous: CBaseEntity | undefined,
// //         modelName: string,
// //         location: Vector,
// //         radius: number,
// //     ): CBaseEntity | undefined;
// //     /**
// //      * Find entities by name. Pass 'null' to start an iteration, or reference to a
// //      * previously found entity to continue a search.
// //      */
// //     FindByName(previous: CBaseEntity | undefined, name: string): CBaseEntity | undefined;
// //     /**
// //      * Find entities by name nearest to a point.
// //      */
// //     FindByNameNearest(name: string, location: Vector, radius: number): CBaseEntity | undefined;
// //     /**
// //      * Find entities by name within a radius. Pass 'null' to start an iteration, or
// //      * reference to a previously found entity to continue a search.
// //      */
// //     FindByNameWithin(
// //         previous: CBaseEntity | undefined,
// //         name: string,
// //         location: Vector,
// //         radius: number,
// //     ): CBaseEntity | undefined;
// //     /**
// //      * Find entities by targetname. Pass 'null' to start an iteration, or reference to
// //      * a previously found entity to continue a search.
// //      */
// //     FindByTarget(previous: CBaseEntity | undefined, target: string): CBaseEntity | undefined;
// //     /**
// //      * Find entities within a radius. Pass 'null' to start an iteration, or reference
// //      * to a previously found entity to continue a search.
// //      */
// //     FindInSphere(previous: CBaseEntity | undefined, location: Vector, radius: number): CBaseEntity | undefined;
// //     /**
// //      * Begin an iteration over the list of entities.
// //      *
// //      * @both
// //      */
// //     First(): CBaseEntity;
// //     /**
// //      * Get the local player controller (backcompat).
// //      *
// //      * @both
// //      */
// //     GetLocalPlayer(): CDOTAPlayerController;
// //     /**
// //      * Get the local player controller.
// //      *
// //      * @both
// //      */
// //     GetLocalPlayerController(): object;
// //     /**
// //      * Get the local player pawn.
// //      *
// //      * @both
// //      */
// //     GetLocalPlayerPawn(): object;
// //     /**
// //      * Continue an iteration over the list of entities, providing reference to a
// //      * previously found entity.
// //      *
// //      * @both
// //      */
// //     Next(previous: CBaseEntity | undefined): CBaseEntity | undefined;
// //     __kind__: 'instance';
// // }