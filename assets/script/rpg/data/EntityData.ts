import { Vec2 } from "cc";
import { EntityType } from "../enum/Type";




export class EntityData{
    name: string;
    type: EntityType;
    pos:Vec2;
    public static create(type: EntityType,name: string, pos:Vec2): EntityData {
        return new EntityData(type, name, pos);
    }
    public constructor(type: EntityType, name: string,pos:Vec2 ) {
        this.pos = pos;
        this.name = name;
        this.type = type;   
    }
}

