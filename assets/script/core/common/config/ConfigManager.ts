import { _decorator, Asset, assetManager, BufferAsset, Component, JsonAsset, log, path, resources, TextAsset,  } from 'cc';

const { ccclass, property } = _decorator;


@ccclass('ConfigManager')
export class ConfigManager extends Component {
    private static instance: ConfigManager = null;
    private configs: Map<string, any> = new Map();

    public static readonly PATH_CONFIG_DIRECTORY = 'config/';

    private constructor() {
        super();
    }

    public static getInstance(): ConfigManager {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }

    

    /**
     * 加载单独配置文件 loadSingle("config/config.json")
     * @param path 
     * @returns 
     */
    public async loadSingle(path: string): Promise<void> {
        path = this.getConfigPath(path);
        return new Promise((resolve, reject) => {
            resources.load(path, Asset, (err, asset) => {
                if (err) {
                    reject(err);
                    return;
                }
                this.parseAsset(asset);
                resolve();
            });
        });
    }

    /**
     * 获取资源路径
     * @param path 
     * @returns 
     */
    private getConfigPath(path: string): string {
        path = this.removeExtension(path);
        if (path.startsWith(ConfigManager.PATH_CONFIG_DIRECTORY)) {
            return path;
        }
        return `${ConfigManager.PATH_CONFIG_DIRECTORY}${path}`;
    }

    /**
     * 加载配置文件目录 loadDirectory("config/")
     * @param path 
     * @returns 
     */
    public async loadDirectory(path: string): Promise<void> {
        path = this.getConfigPath(path);
        return new Promise((resolve, reject) => {
            resources.loadDir(path, Asset, (err, assets) => {
                if (err) {
                    reject(err);
                    return;
                }
                assets.forEach(asset => {
                    this.parseAsset(asset);
                });

                resolve();
            });
        });
    }
    /**
     * 加载配置zip包 loadSingle("config/cfg.zip")
     * @param path 
     * @returns 
     */
    public async loadZip(path: string,releaseZip:boolean = true): Promise<void> {
        path = this.getConfigPath(path);
        return new Promise<void>(async (resolve, reject) => {
            let asset: BufferAsset | null = null;
            try {
                // 加载资源
                asset = await this.loadBufferAsset(path);
                log(`Loaded zip file: ${path}`);
                // 处理 ZIP 内容
                const zip = await JSZip.loadAsync(asset.buffer());
                await this.processZipContents(zip);
                resolve();
            } catch (error) {
                error("Error processing zip content:", error);
                reject(error);
            } finally {
                // 释放资源
                if (asset && releaseZip) {
                    resources.release(path);
                }
            }
        });
    }

    private loadBufferAsset(path: string): Promise<BufferAsset> {
        return new Promise((resolve, reject) => {
            resources.load(path, BufferAsset, (err, asset) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(asset);
                }
            });
        });
    }

    private async processZipContents(zip: JSZip): Promise<void> {
        const promises = [];
        zip.forEach((_, file) => {
            if (!file.dir) {
                promises.push(
                    file.async('text').then(content => {
                        this.parseText(content, file.name);
                    })
                );
            }
        });
        await Promise.all(promises);
    }

    private removeExtension(filename: string): string {
        const lastDotIndex = filename.lastIndexOf('.');
        return lastDotIndex === -1 ? filename : filename.substring(0, lastDotIndex);
    }

    private parseAsset(asset: Asset): void {
        if (asset instanceof JsonAsset) {
            this.configs.set(asset.name, asset.json);
        } else {
            // log(`Unsupported asset type: ${asset.constructor.name}`);
        }
    }

    private parseText(content: string, name: string): any {
        if (name.endsWith('.json')) {
            const key = this.removeExtension(name);
            this.configs.set(key, JSON.parse(content));
        }  else {
            throw new Error(`Unsupported file format: ${name}`);
        }
    }

    public get(configName: string): any {
        return this.configs.get(configName) || null;
    }

    
    public getAllConfigs(): Map<string, any> {
        const jsonConfigs = new Map<string, any>();
        this.configs.forEach((value, key) => {
            jsonConfigs.set(key, value.json);
        });
        return jsonConfigs;
    }

    public releaseSingle(configName: string): boolean {
        const item = this.configs.get(configName);
        if (item) {
            const path = this.getConfigPath(configName);
            if (resources.get(path)){
                resources.release(path);
            }
            this.configs.delete(configName);
            return true;
        }
        return false;
    }

    public releaseAll(): void {
        this.configs.forEach((_, configName) => {
            this.releaseSingle(configName);
        });
        this.configs.clear();
    }

    public clear(): void {
        this.configs.clear();
    }
}