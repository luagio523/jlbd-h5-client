export abstract class DataReader {
    protected parseEnumValue<T>(enumObj: T, value: string): number {
        return value.split('|').reduce((acc, val) => acc | (enumObj[val.trim()] || 0), 0);
    }
    protected abstract parseJsonData(data: any): void ;
}