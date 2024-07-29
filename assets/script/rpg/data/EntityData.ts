import { EntityType } from "../enum/Type";




export class EntityData{
    name: string;
    id: number;
    type: EntityType;
    public static create(name: string, id: number, type: EntityType): EntityData {
        return new EntityData(name, id, type);
    }
    public constructor(name: string, id: number, type: EntityType) {
        this.name = name;
        this.id = id;
        this.type = type;   
    }
}

