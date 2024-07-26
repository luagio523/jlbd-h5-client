import { Color, Graphics, Node, Label, Vec3, tween, Sprite, UITransform, resources, SpriteFrame, Animation, Vec2,UIOpacity } from 'cc';
import { AudioManager } from '../../../core/common/audio/AudioManager';

export class SkillAreaBase {
    protected node: Node;
    protected graphics: Graphics | null;
    protected sprite: Sprite | null;
    protected animation: Animation | null;
    protected color: Color;
    protected duration: number;
    protected fadeIn: boolean;
    protected flash: boolean;
    protected showCountdown: boolean;
    protected audioPath: string | null;
    protected countdownLabel: Label | null;
    protected useAnimation: boolean;
    protected originalSize: Vec2;
    protected uiOpacity: UIOpacity;

    constructor(node: Node, params: SkillAreaParams) {
        this.node = node;
        this.color = params.color;
        this.duration = params.duration;
        this.fadeIn = params.fadeIn;
        this.flash = params.flash;
        this.showCountdown = params.showCountdown;
        this.audioPath = params.audioPath;
        this.useAnimation = params.useAnimation;
        this.originalSize = params.originalSize || new Vec2(100, 100);

        
        // 添加 UIOpacity 组件
        this.uiOpacity = node.addComponent(UIOpacity);

        if (this.useAnimation) {
            this.sprite = node.addComponent(Sprite);
            this.animation = node.addComponent(Animation);
            this.loadAnimationAsset(params.animationPath);
        } else {
            this.graphics = node.addComponent(Graphics);
            this.graphics.fillColor = this.color;
        }

        if (this.showCountdown) {
            this.countdownLabel = node.addComponent(Label);
            this.countdownLabel.string = this.duration.toString();
            this.countdownLabel.fontSize = 20;
            this.countdownLabel.color = new Color(255, 255, 255, 255);
        }

        this.drawArea();
        this.applyEffects();
        setTimeout(() => this.removeArea(), this.duration * 1000);
    }

    protected drawArea() {
        // To be implemented by subclasses
    }

    private applyEffects() {
        if (this.fadeIn) {
            this.fadeInEffect();
        }
        if (this.flash) {
            this.flashEffect();
        }
        if (this.showCountdown) {
            this.startCountdown();
        }
        if (this.audioPath) {
            this.playAudio();
        }
    }

    fadeInEffect() {
        if (this.useAnimation) {
            this.uiOpacity!.opacity = 0;
            tween(this.uiOpacity)
                .to(0.5, { opacity: 255 })
                .start();
        } else {
            this.color.a = 0;
            this.graphics!.fillColor = this.color;
            tween(this.color)
                .to(0.5, { a: 255 }, { onUpdate: () => this.graphics!.fillColor = this.color })
                .start();
        }
    }

    private flashEffect() {
        tween(this.node)
            .repeatForever(
                tween()
                    .to(0.5, { opacity: 0 })
                    .to(0.5, { opacity: 255 })
            )
            .start();
    }

    public startCountdown() {
        let remainingTime = this.duration;
        setInterval(() => {
            remainingTime -= 1;
            if (this.countdownLabel) {
                this.countdownLabel.string = remainingTime.toString();
            }
        }, 1000);
    }

    public removeArea() {
        this.node.destroy();
    }

    public updatePosition(position: Vec3) {
        this.node.setPosition(position);
    }

    public updateShapeParameters(params: any) {
        // To be implemented by subclasses
    }

    protected playAudio() {
        AudioManager.getInstance().playSFX(this.audioPath);
    }

    loadAnimationAsset(animationPath: string) {
        resources.load(animationPath, SpriteFrame, (err, spriteFrame) => {
            if (err) {
                console.error('Failed to load animation asset:', err);
                return;
            }
            this.sprite!.spriteFrame = spriteFrame;
            // 设置动画相关属性
            // 这里需要根据你的动画系统进行适当的设置
        });
    }

    public setSize(width: number, height: number) {
        const uiTransform = this.node.getComponent(UITransform);
        if (uiTransform) {
            uiTransform.setContentSize(width, height);
        }
    }

    protected scaleToFit(targetWidth: number, targetHeight: number) {
        const scaleX = targetWidth / this.originalSize.x;
        const scaleY = targetHeight / this.originalSize.y;
        const scale = Math.min(scaleX, scaleY);
        this.node.setScale(new Vec3(scale, scale, 1));
    }
}

export interface SkillAreaParams {
    position: Vec3;
    color: Color;
    duration: number;
    fadeIn: boolean;
    flash: boolean;
    showCountdown: boolean;
    audioPath: string | null;
    useAnimation: boolean;
    animationPath?: string;
    originalSize?: Vec2;
}