type KVValue = string | KV[];

export class KV {
  key: string;
  value: KVValue;
  comment: string;
  keep: boolean;

  constructor(key: string = "", value: KVValue = "", comment: string = "") {
    this.key = key;
    this.value = value;
    this.comment = comment;
    this.keep = false;
  }

  getKV(key: string, caseSensitive: boolean = true): KV | null {
    if (Array.isArray(this.value)) {
      const compareKey = caseSensitive ? key : key.toUpperCase();
      for (const kv of this.value) {
        if (caseSensitive ? kv.key === key : kv.key.toUpperCase() === compareKey) {
          return kv;
        }
      }
    }
    return null;
  }

  get(key?: string, caseSensitive: boolean = true): KVValue | null {
    if (key === undefined) return this.value;
    const kv = this.getKV(key, caseSensitive);
    return kv ? kv.value : null;
  }

  isList(): boolean {
    return Array.isArray(this.value);
  }

  set(key: string, value: KVValue): this {
    const kv = this.getKV(key, false);
    if (kv) {
      kv.value = value;
    } else if (Array.isArray(this.value)) {
      this.value.push(new KV(key, value));
    } else {
      this.value = [new KV(key, value)];
    }
    return this;
  }

  delete(key: string, caseSensitive: boolean = true): void {
    if (Array.isArray(this.value)) {
      const compareKey = caseSensitive ? key : key.toUpperCase();
      this.value = this.value.filter(kv => 
        caseSensitive ? kv.key !== key : kv.key.toUpperCase() !== compareKey
      );
    }
  }

  clone(keepEmpty: boolean = true): KV {
    return KV.parse(this.toString(keepEmpty));
  }

  toString(saveFunc?: ((kv: KV) => boolean) | boolean): string {
    let _func: ((kv: KV) => boolean) | null = null;

    if (typeof saveFunc === "function") {
      _func = saveFunc;
    } else if (saveFunc === false) {
      _func = (kv: KV) => kv.value !== "";
    }

    return this._toString(null, 0, _func);
  }

  private _toString(data: string | null, level: number, saveFunc: ((kv: KV) => boolean) | null): string {
    let _data = data || "";
    const indent = "  ".repeat(level);

    const write = (text: string) => {
      _data += indent + text + "\n";
    };

    // Comment
    if (this.comment) {
      this.comment.split("\n").forEach(line => {
        write("// " + line);
      });
    }

    // Key - Value
    if (typeof this.value === "string") {
      write(`"${this.key}"\t"${this.escapeValue(this.value)}"`);
    } else if (this.value.length === 0) {
      write(`"${this.key}"\t{}`);
    } else {
      write(`"${this.key}"`);
      write("{");
      this.value.forEach(subKV => {
        if (!saveFunc || saveFunc(subKV) !== false) {
          _data = subKV._toString(_data, level + 1, saveFunc) + "\n";
        }
      });
      write("}");
    }

    return _data.replace(/\n$/, "");
  }

  private escapeValue(value: string): string {
    return value
      .replace(/\\"/g, '"')
      .replace(/"/g, '\\"')
      .replace(/\r\n/g, "\\n")
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\n");
  }

  static parse(text: string): KV {
    const STATE_NORMAL = 0, STATE_COMMENT = 1, STATE_KEY = 2, STATE_KEY_END = 3,
          STATE_VALUE = 4, STATE_VALUE_END = 5, STATE_VALUE_LIST = 6;

    let state = STATE_NORMAL;
    let key = "", value: KVValue = "", comment = "";
    const stack: KV[] = [];
    let currentKV: KV | null = null;

    const processChar = (char: string, index: number) => {
      switch (state) {
        case STATE_NORMAL:
          if (char === '/' && text[index + 1] === '/') {
            state = STATE_COMMENT;
          } else if (char === '"') {
            state = STATE_KEY;
          }
          break;
        case STATE_COMMENT:
          if (char === '\n') {
            state = STATE_NORMAL;
          } else {
            comment += char;
          }
          break;
        case STATE_KEY:
          if (char === '"') {
            state = STATE_KEY_END;
          } else {
            key += char;
          }
          break;
        case STATE_KEY_END:
          if (char === '"') {
            state = STATE_VALUE;
            value = "";
          } else if (char === '{') {
            state = STATE_VALUE_LIST;
            value = [];
            if (currentKV) stack.push(currentKV);
            currentKV = new KV(key, value, comment);
            key = "";
            comment = "";
          }
          break;
        case STATE_VALUE:
          if (char === '"') {
            state = STATE_VALUE_END;
            if (currentKV) {
              currentKV.set(key, value as string);
            } else {
              currentKV = new KV(key, value, comment);
            }
            key = "";
            comment = "";
          } else if (char === '\\' && text[index + 1] === '"') {
            value += '"';
            index++;
          } else {
            value += char;
          }
          break;
        case STATE_VALUE_LIST:
          if (char === '}') {
            state = STATE_VALUE_END;
            if (stack.length > 0) {
              const parentKV = stack.pop()!;
              if (Array.isArray(parentKV.value)) {
                parentKV.value.push(currentKV!);
              }
              currentKV = parentKV;
            }
          }
          break;
        case STATE_VALUE_END:
          if (char === '/' && text[index + 1] === '/') {
            state = STATE_COMMENT;
          } else if (char === '"') {
            state = STATE_KEY;
            key = "";
          }
          break;
      }
    };

    for (let i = 0; i < text.length; i++) {
      processChar(text[i], i);
    }

    return currentKV || new KV();
  }
}

