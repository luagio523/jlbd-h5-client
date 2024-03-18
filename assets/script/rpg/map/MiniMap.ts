import { Graphics, Node, log } from "cc"
import GameImage from "./GameImage"
import { ResPathUtil } from "./ResPathUtil"

export default class MiniMap extends Node{
    private mapImage:GameImage

    public showPath:boolean = true


    public static MINI_WIDHT = 445
    public static MINI_HEIGHT = 445

    public constructor(){
        super()
        this.mapImage = new GameImage
        this.addChild(this.mapImage)

        let roadNode:Node = new Node

        this.addChild(roadNode)

        this.pathGraphic = roadNode.addComponent(Graphics)

        
    }
    public updateMap(name:string){
        this.mapImage.source = ResPathUtil.GetMapMiniPath(name)
    }

    public updateRoadPath(paths:Array<any>){
        // if(!this.active) return 

        // let graphics = this.pathGraphic
        // if(!graphics) return 
        // if(!this.showPath) return 
        // if(!paths || paths.length <= 0){
        //     return 
        // }

        // log(" draw hei hei ")


		// graphics.clear();

        // graphics.strokeColor = Color.RED
        // graphics.lineWidth = 2
        

        // let scaleX = this.mapImage.scaleX
        // let scaleY = this.mapImage.scaleY

        // for (let index = 0; index < paths.length; index++) {
        //     if(index == 0){
        //         graphics.moveTo(paths[index].nX*scaleX,paths[index].nY*scaleY);
        //     }else{
        //         log("line  to ",paths[index].nX*scaleX,paths[index].nY*scaleY)
        //         graphics.lineTo(paths[index].nX*scaleX,paths[index].nY*scaleY);
        //     }
        // }

        // graphics.stroke()

    }

   

    public setSize(width:number,height:number){
        let scaleX = width/MiniMap.MINI_WIDHT
        let scaleY = height/MiniMap.MINI_HEIGHT
        this.mapImage.setScale(scaleX,scaleY)
    }

    /**
     * 点击小地图
     * @param x 
     * @param y 
     */
    public checkTouch(event:Touch):boolean{
        // 点击
        // let point = this.mapImage.convertToNodeSpaceAR(event.get)

        // log(point,"check touch")

        // let mapPoint = GameLogic.ins().mapView.convertToNodeSpaceAR(event.getLocation()) //世界坐标 转换为地图坐标
        // GameLogic.ins().mapView.lookPoint(mapPoint.x,mapPoint.y)

        return false
    }


   
} 