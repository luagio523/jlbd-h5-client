import { _decorator, Asset, assetManager, BufferAsset, Component, JsonAsset, log, resources, TextAsset,  } from 'cc';

const { ccclass, property } = _decorator;


@ccclass('ConfigManager')
export class ConfigManager extends Component {
    private static instance: ConfigManager = null;
    private configs: Map<string, any> = new Map();

    private constructor() {
        super();
    }

    public static getInstance(): ConfigManager {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }

    public get(configName: string): any {
        return this.configs.get(configName) || null;
    }

    /**
     * 加载单独配置文件 loadSingle("config/config.json")
     * @param path 
     * @returns 
     */
    public async loadSingle(path: string): Promise<void> {
        path = this.removeExtension(path);
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
     * 加载配置文件目录 loadDirectory("config/")
     * @param path 
     * @returns 
     */
    public async loadDirectory(path: string): Promise<void> {
        path = this.removeExtension(path);
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
    public async loadZip(path: string): Promise<void> {
        path = this.removeExtension(path);
        return new Promise((resolve, reject) => {
            resources.load(path, BufferAsset, async (err, asset) => {
                console.log(path,err,asset);
                if (err) {
                    reject(err);
                    return;
                }

                try {
                    const zip = await JSZip.loadAsync(asset.buffer());
                    const promises = [];

                    zip.forEach((relativePath, file) => {
                        if (!file.dir  ) {
                            promises.push(
                                file.async('text').then(content => {
                                    this.parseText(content, file.name);
                                })
                            );
                        }
                    });
                    await Promise.all(promises);
                    resolve();
                } catch (e) {
                    reject(e);
                }
            });
        });
    }

    private removeExtension(filename: string): string {
        const lastDotIndex = filename.lastIndexOf('.');
        return lastDotIndex === -1 ? filename : filename.substring(0, lastDotIndex);
    }

    private parseAsset(asset: Asset): void {
        if (asset instanceof JsonAsset) {
            this.configs.set(asset.name, asset.json);
        } else {
            log(`Unsupported asset type: ${asset.constructor.name}`);
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

    public getConfig(path: string): any {
        return this.configs.get(path);
    }

    public getAllConfigs(): Map<string, any> {
        return new Map(this.configs);
    }

    public clear(): void {
        this.configs.clear();
    }
}