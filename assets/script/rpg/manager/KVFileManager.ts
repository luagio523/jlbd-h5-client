export default class KVFileManager {
    private static instance: KVFileManager;
    public static getInstance(): KVFileManager {
        if (!KVFileManager.instance) {
            KVFileManager.instance = new KVFileManager();
        }
        return KVFileManager.instance;
    }


    public getKVData(key: string): any {
        return 
    }
}