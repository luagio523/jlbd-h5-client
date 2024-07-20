import { EventTarget, warn } from "cc";

export interface LanguageConfig {
    nameParts: string[][];  // 每个数组代表一个部分的可能值
    separators?: string[];  // 可选的分隔符
    titles?: string[];      // 可选的头衔
    numberRange?: [number, number];  // 可选的数字范围 [最小值, 最大值]
}

export interface NameConfig {
    [language: string]: LanguageConfig;
}

export class NameGenerator  {
    private config: NameConfig | null = null;
    private nameCache: Map<string, Set<string>> = new Map();
    private maxCombinations: Map<string, number> = new Map();

    public initialize(config: NameConfig): void {
        this.config = config;
        this.clearCache();
        this.calculateAllMaxCombinations();
    }

    public unloadConfig(): void {
        this.config = null;
        this.clearCache();
        this.maxCombinations.clear();
    }
    

    public generateName(language: string, isGameName: boolean = false): string {
        this.ensureConfigLoaded();
        this.ensureLanguageSupported(language);

        const langConfig = this.config![language];
        const maxCombinations = this.maxCombinations.get(language)!;
        const currentCombinations = this.nameCache.get(language)?.size || 0;

        if (currentCombinations >= maxCombinations) {
            warn(`All possible name combinations (${maxCombinations}) for ${language} have been exhausted.`);
            this.clearCache();
        }

        let name: string;
        do {
            name = this.generateBaseName(langConfig);
            if (langConfig.numberRange) {
                name += this.generateNumber(langConfig.numberRange);
            }
        } while (this.nameCache.get(language)?.has(name));

        this.addToCache(language, name);

        if (isGameName && langConfig.titles && langConfig.titles.length > 0) {
            const title = this.getRandomElement(langConfig.titles);
            return `${name} ${title}`;
        }

        return name;
    }


    private calculateMaxCombinations(config: LanguageConfig): number {
        let combinations = 1;
        for (const part of config.nameParts) {
            combinations *= part.length;
        }
        if (config.numberRange) {
            const [min, max] = config.numberRange;
            combinations *= (max - min + 1);
        }
        return combinations;
    }

    private generateBaseName(config: LanguageConfig): string {
        const parts = config.nameParts.map(part => this.getRandomElement(part));
        if (config.separators && config.separators.length > 0) {
            const separator = this.getRandomElement(config.separators);
            return parts.join(separator);
        }
        return parts.join('');
    }

    private generateNumber(range: [number, number]): string {
        const [min, max] = range;
        return Math.floor(Math.random() * (max - min + 1) + min).toString();
    }

    private getRandomElement<T>(array: T[]): T {
        return array[Math.floor(Math.random() * array.length)];
    }

    public clearCache(): void {
        this.nameCache.clear();
    }

    private ensureConfigLoaded(): void {
        if (!this.config) {
            throw new Error("Name configuration is not loaded. Please call loadConfig() first.");
        }
    }

    private ensureLanguageSupported(language: string): void {
        if (!this.config![language]) {
            throw new Error(`Language not supported: ${language}`);
        }
    }

    private addToCache(language: string, name: string): void {
        if (!this.nameCache.has(language)) {
            this.nameCache.set(language, new Set());
        }
        this.nameCache.get(language)!.add(name);
    }


    private calculateAllMaxCombinations(): void {
        this.maxCombinations.clear();
        for (const [language, langConfig] of Object.entries(this.config!)) {
            const maxCombos = this.calculateMaxCombinations(langConfig);
            this.maxCombinations.set(language, maxCombos);
        }
    }
   

    public getMaxCombinations(language: string): number | undefined {
        return this.maxCombinations.get(language);
    }

   


    public release(): void {
        this.unloadConfig();
    }
}






// const config: NameConfig = {
//     chinese: {
//         nameParts: [
//             ["李", "王", "张"],
//             ["小", "大", "老"],
//             ["明", "华", "强"]
//         ],
//         titles: ["大师", "勇士", "智者"]
//     },
//     english: {
//         nameParts: [
//             ["Brave", "Swift", "Wise"],
//             ["Heart", "Blade", "Storm"]
//         ],
//         separators: [" ", "-"],
//         titles: ["Master", "Warrior", "Sage"],
//         numberRange: [1, 99]
//     },
//     fantasy: {
//         nameParts: [
//             ["Aer", "Dae", "Fyr"],
//             ["wyn", "mor", "leth"],
//             ["ian", "iel", "or"]
//         ],
//         separators: ["'", "-"],
//         numberRange: [100, 999]
//     }
// };

// const nameGen = NameGenerator.getInstance();
// nameGen.loadConfig(config);

// console.log(nameGen.generateName("chinese"));  // 可能输出：李小华
// console.log(nameGen.generateName("english"));  // 可能输出：Swift-Blade 42
// console.log(nameGen.generateName("fantasy"));  // 可能输出：Aer'leth-or 789
// console.log(nameGen.generateName("chinese", true));  // 可能输出：王老明 大师

// nameGen.unloadConfig();
// nameGen.release();
