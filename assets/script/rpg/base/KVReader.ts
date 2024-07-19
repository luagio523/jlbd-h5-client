import { TextAsset, resources } from 'cc';

export interface KVNode {
    [key: string]: string | number | boolean | KVNode | null;
}

export class KVReader {
    public static async readKVFile(filePath: string): Promise<KVNode> {
        return new Promise<KVNode>((resolve, reject) => {
            resources.load(filePath, TextAsset, (err, textAsset) => {
                if (err) {
                    reject(err);
                    return;
                }
                const content = textAsset.text;
                const parsed = this.parseKV(content);
                resolve(parsed);
            });
        });
    }

    private static parseKV(content: string): KVNode {
        const lines = content.split('\n');
        const root: KVNode = {};
        const stack: KVNode[] = [root];
        let currentKey: string | null = null;

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();

            if (line === '' || line.startsWith('//')) continue; //处理空行和注释行

            const commentIndex = line.indexOf('//'); //处理行内注释
            let comment = '';
            if (commentIndex !== -1) {
                comment = line.slice(commentIndex).trim();
                line = line.slice(0, commentIndex).trim();
            }

            if (line === '{') {
                if (currentKey) {
                    const newNode: KVNode = {};
                    stack[stack.length - 1][currentKey] = newNode;
                    stack.push(newNode);
                    currentKey = null;
                }
            } else if (line === '}') {
                stack.pop();
            } else {
                const match = line.match(/^"(.+)"\s+(.*)$/);
                if (match) {
                    const key = match[1];
                    let value: string | number | boolean | null = match[2].trim();

                    if (value === '') {
                        value = null;
                    } else if (value.startsWith('"') && value.endsWith('"')) {
                        value = value.slice(1, -1);
                    } else if (value === 'true' || value === 'false') {
                        value = value === 'true';
                    } else if (!isNaN(Number(value))) {
                        value = Number(value);
                    }

                    stack[stack.length - 1][key] = value;
                } else {
                    currentKey = line.replace(/"/g, '');
                }
            }
        }

        return root;
    }
}