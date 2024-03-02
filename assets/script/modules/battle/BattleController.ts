import { Controller, ns } from "../../mvc/init"; 
import BattleModel from "./BattleModel"; 
import BattleView from "./BattleView"; 
import LockView from "./LockView"; 
import MapBigView from "./MapBigView"; 
import MsgView from "./MsgView"; 
const {ccclass} = cc._decorator;@ccclass 
export default class BattleController extends Controller{ 
     
    public onRegister(){ 
 
    } 
    /*---------------------------------[notices]------------------------------------*/ 
    public  noticeBattleViewShow(notification:any){

    }  
     
    public  noticeShowBlood(notification:any){

    }  
     
    public  noticeShowDropItem(notification:any){

    }  
     
    public  noticeUpdateCharRoleInfo(notification:any){

    }  
     
    public  noticeUpdateGold(notification:any){

    }  
     
    public  noticeUpdateEquip(notification:any){

    }  
     
    public  noticeReceiveItem(notification:any){

    }  
     
    public  noticeUpdateStatistic(notification:any){

    }  
     
    public  noticeLockViewShow(notification:any){

    }  
     
    public  noticeMapBigViewShow(notification:any){

    }  
     
    public  noticeSendChatMsg(notification:any){

    }  
     
    public  noticeBossBorth(notification:any){

    }  
     
    public  noticeShowTombstone(notification:any){

    }  
     
    public  noticeHideTombstone(notification:any){

    }  
     
    public  noticeEnterArea(notification:any){

    }  
     
    public  noticeLeaveArea(notification:any){

    }  
     
    public  noticeBossHpUpdate(notification:any){

    }  
     
    public  noticeRoleResurrection(notification:any){

    }  
     
    public  noticeShowMsg(notification:any){

    }  
     
    public  noticeVmgMsgSureViewshow(notification:any){

    }  
     
    public  noticeUpdateAreaLock(notification:any){

    }  
     
     
     
    protected get model():BattleModel{ 
        return ns.models.battle 
    } 
 
    /*---------------------------------[views]------------------------------------*/ 
    protected  get battleView():BattleView{ 
        return ns.views.battle
    }  
     
    protected  get lockView():LockView{ 
        return ns.views.lock
    }  
     
    protected  get mapBigView():MapBigView{ 
        return ns.views.mapBig
    }  
     
    protected  get msgView():MsgView{ 
        return ns.views.msg
    }  
     
 
} 
 
 
 
 
 
 
