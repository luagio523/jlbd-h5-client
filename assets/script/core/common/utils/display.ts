import { Vec2, view } from "cc"
import { MathUtil } from "./MathUtil"

/**
 * 兼容cocos display
 */
export default class display{
    /////////////////////////////////////设计分辨率//////////////////////////////////////////////
    private static  _width:any
    public static get width():number{
        if(!this._width){
            this._width = winSize.width
        }
        return this._width
    }
    private static  _height:any
    public static get height():number{
        if(!this._height){
            this._height = winSize.height
        }
        return this._height
    }

    private static  _center:Vec2
    public static get center():Vec2{
        if(!display._center){
            display._center = new Vec2(display.width/2, display.height/2)
        }
        return display._center
    }

    public static get viewWidth():number {
        return view.getFrameSize().width;
    }

    public static get viewHeight():number {
        return view.getFrameSize().height;
    }
    ////////////////////////////////////////////////////////////////////////////////////
    /**
     * 更新适配
     * @param adaptRect 
     */
    public static resetAdapt(adaptRect){
        display._adaptWidth = adaptRect.width; //设置adaptWidth
        display._adaptHeight = adaptRect.height;//设置 adaptHeight
        display._skewX = adaptRect.x
        display._skewY = adaptRect.y
        display._adaptCenter = new Vec2(display.adaptWidth/2,display.adaptHeight/2)

        display._adaptScaleX = adaptRect.width / display.width;
        display._adaptScaleY = adaptRect.height / display.height;

        display._maxDistance = MathUtil.getDistance(0, 0, display._adaptWidth, display._adaptHeight);

        this._baseX = display._skewX;
        this._baseY = display._skewY;
        this._maxX = display._adaptWidth + display._skewX;
        this._maxY = display._adaptHeight + display._skewY;
    }

    //////////////////////////////////////////////适配之后///////////////////////////////////////////////////

    private static _baseX:number;
    public static get baseX() {
        return this._baseX;
    }
    private static _baseY:number;
    public static get baseY() {
        return this._baseY;
    }
    private static _maxX:number;
    public static get maxX() {
        return this._maxX;
    }
    private static _maxY:number;
    public static get maxY() {
        return this._maxY;
    }

    private static _adaptWidth:any
    public static set adaptWidth(value) {
        this._adaptWidth = value
    }
    public static get adaptWidth() {
        return this._adaptWidth || this.width;
    }

    private static _adaptHeight:any
    public static set adaptHeight(value) {
        this._adaptHeight = value
    }
    public static get adaptHeight() {
        return this._adaptHeight|| this.height;
    }

    

    private static  _adaptCenter:Vec2
    public static get adaptCenter():Vec2{
        if(!display._adaptCenter){
            display._adaptCenter = new Vec2(display.adaptWidth/2,display.adaptHeight/2)
        }
        return display._adaptCenter
    }

    
    /**坐标 映射 X方向*/
    private static _adaptScaleX:any
    public static get scaleX() {
        if(!this._adaptScaleX){
            this._adaptScaleX = this.adaptWidth / this.width;
        }
        return this._adaptScaleX
    }

    /**坐标 映射 Y方向*/
    private static _adaptScaleY:any
    public static get scaleY() {
        if(!this._adaptScaleY){
            this._adaptScaleY = this.adaptHeight / this.height;
        }
        return this._adaptScaleY
    }

    /**实际屏幕偏移坐标 */
    private static _skewX:any
    public static set skewX(value) {
        this._skewX = value
    }
    public static get skewX() {
        if(!this._skewX) {
            this._skewX = (this.width - this.adaptWidth) / 2;
        }
        return this._skewX
    }

    /**实际屏幕偏移坐标 */
    private static _skewY:any
    public static set skewY(value) {
        this._skewY = value
    }
    public static get skewY() {
        if(!this._skewY) {
            this._skewY = (this.height - this._adaptHeight) / 2;
        }
        return this._skewY
    }

    private static _maxDistance:number;
    public static get maxDistance():number {
        return this._maxDistance;
    }

    private static _adaptOffset:number=20;
    public static get AdaptOffset():number {
        return this._adaptOffset;
    }
    public static set AdaptOffset(val) {
        this._adaptOffset = Math.max(val, 20);
    }

}