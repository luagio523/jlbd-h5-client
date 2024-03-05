import TimeFrame from "./TimerFrame";
import RenderFrame from "./RenderFrame";
import BaseFrame from "./BaseFrame";
/**
 * 倾向于渲染、特效、动画 60fps，游戏、交互、物理 30fps，AI 10fps.....
 */
export default class FrameMgr{
    private static inst:FrameMgr;

    private _aiFrame:BaseFrame

    private _physicFrame:BaseFrame

    private _logicFrame:BaseFrame

    private _renderFrame:BaseFrame

    private constructor()
    {
      
    }

    public getRenderFrame():BaseFrame{
        if(this._renderFrame == null){
            this._renderFrame = new RenderFrame(25)
        }
        return this._renderFrame
    }

    public getLogicFrame():BaseFrame{
        if(this._logicFrame == null){
            this._logicFrame = new RenderFrame(35)
        }
        return this._logicFrame
    }

    public getPhysicFrame():BaseFrame{
        if(this._physicFrame == null){
            this._physicFrame = new RenderFrame(26)
        }
        return this._physicFrame
    }

    public getAIFrame():BaseFrame{
        if(this._aiFrame == null){
            this._aiFrame = new TimeFrame(10)
        }
        return this._aiFrame
    }


    public update(dt){
        if(this._aiFrame){
            this._aiFrame.update(dt)
        }
        if(this._physicFrame){
            this._physicFrame.update(dt)
        }
        if(this._logicFrame){
            this._logicFrame.update(dt)
        }
        if(this._renderFrame){
            this._renderFrame.update(dt)
        }
    }

    public clear(){
        if(this._aiFrame){
            this._aiFrame.clear()
        }
        if(this._physicFrame){
            this._physicFrame.clear()
        }
        if(this._logicFrame){
            this._logicFrame.clear()
        }
        if(this._renderFrame){
            this._renderFrame.clear()
        }
    }

    static ins():FrameMgr
    {
        if(!this.inst)
        {
            this.inst = new FrameMgr();
        }
        return this.inst;
    }
}