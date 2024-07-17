import { Component, _decorator} from 'cc';

const { ccclass, property } = _decorator;
import { LanguageManager } from "./LanguageManager";

@ccclass('LocalizedLabel')
export class LocalizedLabel extends Component {
    @property
    private textKey: string = '';

    @property(Component)
    private targetLabel: Component = null;

    onLoad() {
        this.updateLanguage();
        LanguageManager.getInstance().node.on('language-changed', this.updateLanguage, this);
    }

    updateLanguage() {
        if (this.targetLabel && this.textKey) {
            const translatedText = LanguageManager.getInstance().translate(this.textKey);
            if ('string' in this.targetLabel) {
                this.targetLabel['string'] = translatedText;
            }
        }
    }

    onDestroy() {
        LanguageManager.getInstance().node.off('language-changed', this.updateLanguage, this);
    }
}



// languageManager.setLanguage('zh');
// const translatedText = languageManager.translate('greeting', { name: 'John' });
// {
//     "greeting": "你好，{name}！",
//     "menu.start": "开始游戏",
//     "menu.options": "选项"
// }