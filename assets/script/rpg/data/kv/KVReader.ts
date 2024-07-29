export abstract class KVReader {
    protected parseEnumValue<T>(enumObj: T, value: string): number {
        if (!value) {
            return 0; //default value
        }
        return value.split('|').reduce((acc, val) => acc | (enumObj[val.trim()] || 0), 0);
    }
    protected abstract deserialize(data: any): void ;
}