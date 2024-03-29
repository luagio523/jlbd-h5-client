import GameObject from "./GameObject";
/**
 * 状态条
 */
export class StatusBar extends GameObject{
    private bgSprite:cc.Sprite
    private barSprite:cc.Sprite
    public constructor(){
        super()
        this.init()
    }

    protected init(){
        let bgNode = new cc.Node  //背景条节点
        this.bgSprite = bgNode.addComponent(cc.Sprite)
        this.addChild(bgNode)

        let bloodNode = new cc.Node //前 状态条
        let barSprite = bloodNode.addComponent(cc.Sprite)
        bgNode.addChild(bloodNode)

        barSprite.type = cc.Sprite.Type.FILLED
        barSprite.fillStart = 0
        barSprite.fillRange = 0.1

        this.barSprite = barSprite
    }

    public udpateBarStyle(spriteFrame:cc.SpriteFrame ,bgFrame:cc.SpriteFrame = null){
        if(!spriteFrame) return 

        this.barSprite.spriteFrame = spriteFrame
        if(bgFrame){
             this.bgSprite.spriteFrame = bgFrame
        }
    }

    public updateVal(val:number){
        if(val < 0){
            val = 0
        }
        if(val > 1){
            val = 1
        }
        this.barSprite.fillRange = val 
    }
}