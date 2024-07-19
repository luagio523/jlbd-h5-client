import { _decorator, Asset, assetManager, BufferAsset, Component, JsonAsset, resources, TextAsset,  } from 'cc';

const { ccclass, property } = _decorator;


@ccclass('ConfigManager')
export class ConfigManager extends Component {
    private static instance: ConfigManager = null;
    private configs: Map<string, any> = new Map();
    private static readonly CONFIG_PATH = 'config/';

    private constructor() {
        super();
    }

    public static getInstance(): ConfigManager {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }

    public async loadConfig(name?: string): Promise<void> {
        let path = this.getConfigPath(name);
        if (path.endsWith('.zip')) {
            await this.loadZipConfig(path);
        } else if (path.endsWith('.json') ) {
            await this.loadSingleConfig(path);
        } else {
            await this.loadDirectory(path);
        }
    }

    public getConfigPath(name?: string): string {
        if (name === undefined || name === null || name === '') {
            return ConfigManager.CONFIG_PATH;
        }
        return `${ConfigManager.CONFIG_PATH}${name}`;
    }

    public get(configName: string): any {
        return this.configs.get(configName) || null;
    }

    private async loadSingleConfig(path: string): Promise<void> {
        return new Promise((resolve, reject) => {
            resources.load(path, TextAsset, (err, asset) => {
                if (err) {
                    reject(err);
                    return;
                }

                const data = this.parseConfig(asset.text, path);
                this.configs.set(path, data);
                resolve();
            });
        });
    }

    private async loadZipConfig(path: string): Promise<void> {
        return new Promise((resolve, reject) => {
            resources.load(path, BufferAsset, async (err, asset) => {
                if (err) {
                    reject(err);
                    return;
                }

                try {
                    const zip = await JSZip.loadAsync(asset.buffer());
                    const promises = [];

                    zip.forEach((relativePath, file) => {
                        if (!file.dir && relativePath.endsWith('.json') ) {
                            promises.push(
                                file.async('text').then(content => {
                                    const data = this.parseConfig(content, relativePath);
                                    this.configs.set(file.name, data);
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

    

    private async loadDirectory(path: string): Promise<void> {
        return new Promise((resolve, reject) => {
            resources.loadDir(path, Asset, (err, assets) => {
                if (err) {
                    reject(err);
                    return;
                }
                assets.forEach(asset => {
                    const assetName = asset.name;
                    if (asset instanceof JsonAsset) {
                        this.configs.set(assetName, asset.json);
                    }else{
                        if (asset instanceof TextAsset){
                            // kv file
                        }
                    }

                });

                resolve();
            });
        });
    }
    

    private parseConfig(content: string, path: string): any {
        if (path.endsWith('.json')) {
            return JSON.parse(content);
        }  else {
            throw new Error(`Unsupported file format: ${path}`);
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