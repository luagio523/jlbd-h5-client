import { _decorator, Component, AudioClip, AudioSource, game, sys, resources,  director } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager extends Component {
    private static instance: AudioManager;
    public static getInstance(): AudioManager {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
        }
        return AudioManager.instance;
    }

    @property(AudioSource)
    private bgmSource: AudioSource = null;

    @property([AudioSource])
    private sfxPool: AudioSource[] = [];

    @property
    private maxSfxInstances: number = 5;

    private bgmVolume: number = 1;
    private sfxVolume: number = 1;
    private isMuted: boolean = false;
    private bgmPaused: boolean = false;

    private currentBGMPath: string = '';
    private loadedSFX: Map<string, AudioClip> = new Map();

    

    onLoad() {
        if (AudioManager.instance) {
            this.node.destroy();
        } else {
            AudioManager.instance = this;
            director.addPersistRootNode(this.node);
            this.initAudioSources();
            this.loadSettings();
        }
    }

    private initAudioSources() {
        this.bgmSource = this.addComponent(AudioSource);

        for (let i = 0; i < this.maxSfxInstances; i++) {
            const source = this.addComponent(AudioSource);
            this.sfxPool.push(source);
        }
    }

    private loadSettings() {
        const bgmVolume = sys.localStorage.getItem('bgmVolume');
        const sfxVolume = sys.localStorage.getItem('sfxVolume');
        const isMuted = sys.localStorage.getItem('isMuted');

        this.bgmVolume = bgmVolume ? parseFloat(bgmVolume) : 1;
        this.sfxVolume = sfxVolume ? parseFloat(sfxVolume) : 1;
        this.isMuted = isMuted ? (isMuted === 'true') : false;

        this.applySettings();
    }

    private applySettings() {
        this.bgmSource.volume = this.isMuted ? 0 : this.bgmVolume;
        this.sfxPool.forEach(source => source.volume = this.isMuted ? 0 : this.sfxVolume);
    }

    private saveSettings() {
        sys.localStorage.setItem('bgmVolume', this.bgmVolume.toString());
        sys.localStorage.setItem('sfxVolume', this.sfxVolume.toString());
        sys.localStorage.setItem('isMuted', this.isMuted.toString());
    }

    public async playBGM(path: string, fade: boolean = false) {
        if (this.currentBGMPath === path && this.bgmSource.playing) {
            return;
        }

        this.stopBGM();

        try {
            const clip = await this.loadAudioClip(path);
            this.bgmSource.clip = clip;
            this.bgmSource.loop = true;

            if (fade) {
                this.bgmSource.volume = 0;
                this.bgmSource.play();
                this.fadeBGM(this.bgmVolume, 2);
            } else {
                this.bgmSource.volume = this.bgmVolume;
                this.bgmSource.play();
            }
            this.bgmPaused = false;
            this.currentBGMPath = path;
        } catch (error) {
            console.error(`Failed to load BGM: ${path}`, error);
        }
    }

    public stopBGM(fade: boolean = false) {
        if (fade) {
            this.fadeBGM(0, 2, () => {
                this.bgmSource.stop();
                this.unloadBGM();
            });
        } else {
            this.bgmSource.stop();
            this.unloadBGM();
        }
        this.bgmPaused = false;
    }

    public pauseBGM() {
        if (this.bgmSource.playing) {
            this.bgmSource.pause();
            this.bgmPaused = true;
        }
    }

    public resumeBGM() {
        if (this.bgmPaused) {
            this.bgmSource.play();
            this.bgmPaused = false;
        }
    }

    public isBGMPaused(): boolean {
        return this.bgmPaused;
    }

    private async fadeBGM(targetVolume: number, duration: number, onComplete?: () => void) {
        const startVolume = this.bgmSource.volume;
        const volumeDiff = targetVolume - startVolume;
        const startTime = Date.now();

        while (Date.now() - startTime < duration * 1000) {
            const elapsed = (Date.now() - startTime) / 1000;
            const t = elapsed / duration;
            this.bgmSource.volume = startVolume + volumeDiff * t;
            await new Promise(resolve => setTimeout(resolve, 16));
        }

        this.bgmSource.volume = targetVolume;
        if (onComplete) onComplete();
    }

    public async playSFX(path: string) {
        try {
            const clip = await this.loadAudioClip(path);
            const source = this.getAvailableSFXSource();
            if (!source) return;

            source.clip = clip;
            source.loop = false;
            source.volume = this.sfxVolume;
            source.play();
        } catch (error) {
            console.error(`Failed to load SFX: ${path}`, error);
        }
    }

    public pauseAllSFX() {
        this.sfxPool.forEach(source => {
            if (source.playing) {
                source.pause();
            }
        });
    }

    public resumeAllSFX() {
        this.sfxPool.forEach(source => {
            if (!source.playing) {
                source.play();
            }
        });
    }

    private getAvailableSFXSource(): AudioSource {
        for (const source of this.sfxPool) {
            if (!source.playing) {
                return source;
            }
        }
        return null;
    }

    public setBGMVolume(volume: number) {
        this.bgmVolume = Math.max(0, Math.min(1, volume));
        this.bgmSource.volume = this.isMuted ? 0 : this.bgmVolume;
        this.saveSettings();
    }

    public setSFXVolume(volume: number) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        this.sfxPool.forEach(source => source.volume = this.isMuted ? 0 : this.sfxVolume);
        this.saveSettings();
    }

    public setMute(mute: boolean) {
        this.isMuted = mute;
        this.applySettings();
        this.saveSettings();
    }

    private async loadAudioClip(path: string): Promise<AudioClip> {
        return new Promise((resolve, reject) => {
            if (this.loadedSFX.has(path)) {
                resolve(this.loadedSFX.get(path));
            } else {
                resources.load(path, AudioClip, (err, clip) => {
                    if (err) {
                        reject(err);
                    } else {
                        this.loadedSFX.set(path, clip);
                        resolve(clip);
                    }
                });
            }
        });
    }

    private unloadBGM() {
        if (this.currentBGMPath) {
            resources.release(this.currentBGMPath);
            this.currentBGMPath = '';
        }
    }

    public unloadSFX(path: string) {
        if (this.loadedSFX.has(path)) {
            const clip = this.loadedSFX.get(path);
            this.loadedSFX.delete(path);
            this.sfxPool.forEach(source => {
                if (source.clip === clip) {
                    source.stop();
                    source.clip = null;
                }
            });
            resources.release(path);
        }
    }

    public unloadAllSFX() {
        this.loadedSFX.forEach((clip, path) => {
            resources.release(path);
        });
        this.loadedSFX.clear();
        this.sfxPool.forEach(source => {
            source.stop();
            source.clip = null;
        });
    }


    public pauseAll() {
        // 暂停背景音乐
        if (this.bgmSource.playing) {
            this.bgmSource.pause();
            this.bgmPaused = true;
        }

        // 暂停所有音效
        this.sfxPool.forEach(source => {
            if (source.playing) {
                source.pause();
            }
        });
    }

    public resumeAll() {
        // 恢复背景音乐
        if (this.bgmPaused) {
            this.bgmSource.play();
            this.bgmPaused = false;
        }

        // 恢复所有音效
        this.sfxPool.forEach(source => {
            if (!source.playing) {
                source.play();
            }
        });
    }
}