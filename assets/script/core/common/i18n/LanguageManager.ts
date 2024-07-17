import { _decorator, Component, sys, resources, JsonAsset } from 'cc';
import { LocalizedLabel } from './LocalizedLabel';

const { ccclass, property } = _decorator;

type LanguageData = { [key: string]: string };

@ccclass('LanguageManager')
export class LanguageManager extends Component {
    private static instance: LanguageManager = null;
    private currentLanguage: string = 'en';
    private languageData: LanguageData = {};

    @property
    private defaultLanguage: string = 'en';

    @property([])
    private supportedLanguages: string[] = ['en', 'zh', 'ja'];

    public static getInstance(): LanguageManager {
        if (!LanguageManager.instance) {
            // const node = new Node('LanguageManager');
            // LanguageManager.instance = node.addComponent(LanguageManager);
            // director.addPersistRootNode(node);
            LanguageManager.instance = new LanguageManager();
        }
        return LanguageManager.instance;
    }

    onLoad() {
        this.loadLanguagePreference();
    }

    private loadLanguagePreference() {
        const savedLanguage = sys.localStorage.getItem('selectedLanguage');
        if (savedLanguage && this.supportedLanguages.includes(savedLanguage)) {
            this.currentLanguage = savedLanguage;
        } else {
            this.currentLanguage = this.defaultLanguage;
        }
        this.loadLanguageData();
    }

    private loadLanguageData() {
        resources.load(`languages/${this.currentLanguage}`, JsonAsset, (err, asset) => {
            if (err) {
                console.error(`Failed to load language data for ${this.currentLanguage}:`, err);
                return;
            }
            this.languageData = asset.json;
            this.updateAllLanguageComponents();
        });
    }

    public setLanguage(lang: string) {
        if (this.supportedLanguages.includes(lang) && lang !== this.currentLanguage) {
            this.currentLanguage = lang;
            sys.localStorage.setItem('selectedLanguage', lang);
            this.loadLanguageData();
        }
    }

    public getCurrentLanguage(): string {
        return this.currentLanguage;
    }

    public getSupportedLanguages(): string[] {
        return this.supportedLanguages.slice();
    }

    public translate(key: string, params: { [key: string]: string | number } = {}): string {
        let text = this.languageData[key] || key;
        for (const [param, value] of Object.entries(params)) {
            text = text.replace(`{${param}}`, value.toString());
        }
        return text;
    }

    private updateAllLanguageComponents() {
        // 更新 Cocos Creator UI 组件
        this.updateCreatorUIComponents();
        
        // 更新 FairyGUI 组件
        this.updateFairyGUIComponents();
        
        // 触发自定义事件，以便其他脚本可以响应语言变化
        this.node.emit('language-changed', this.currentLanguage);
    }

    private updateCreatorUIComponents() {
        // 查找所有带有 LocalizedLabel 组件的节点并更新它们
        const localizedLabels = this.node.getComponentsInChildren(LocalizedLabel);
        localizedLabels.forEach(label => label.updateLanguage());
    }

    private updateFairyGUIComponents() {
        // 假设 FairyGUI 有一个全局方法来更新所有UI组件的语言
        // 这里需要根据实际的 FairyGUI 实现来调整
        // if (window['fairygui'] && typeof window['fairygui'].updateAllLanguages === 'function') {
        //     window['fairygui'].updateAllLanguages();
        // }
    }
}

