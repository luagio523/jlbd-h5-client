import { RoomPlayType, ClassicType, ClassicGrade, OSType } from "./GameConsts";
import { platform_config, config, useSdk } from '../config/GlobalConfig';


// 120.77.210.209:8081  旧的地址
// 120.79.158.200



// "changel_vivo_id": 10010, //这些放到 android的 manifest文件去读
// "changel_oppo_id": 10020,

export  class GameGlobal{

    public static INIT_DOWNLOAD_MAX_CONCURRENT = 20

    public static GAME_DOWNLOAD_MAX_CONCURRENT = 8


    public static GAME_NAME = "击杀宙斯"

    public static PID = platform_config.pid //一级渠道
    public static CHANNEL_ID = platform_config.channel_id //二级渠道
    

    public static VERSION = "1.4.0"   //版本
    public static VERSION_CODE = 140    //版本号 apk 决定是否更新整个apk,重新下载安装
    public static VERSION_URL = config.authUrl +  "api.php"	//更新版本問價數據請求地址
    public static AvatarImgUrl = config.avatarImgUrl;  //头像地址
    public static ISHASLIUHAI = false;
    public static LIUHAIPIXEL = 20;

   
    public static USE_SDK = useSdk     //是否使用sdk

    public static LANG = config.language    //国际化
    public static API_KEY = "123456"       //key

    public static REMOTE_CDN_URL = config.cdnUrl  //远程cdn地址
    public static AUTH_URL = config.authUrl + "api.php"	//登錄等接口請求地址
    
    public static SHOP_URL = config.shopUrl +  "api.php"		//奪寶活動、兌換商城等接口請求地址
    public static AUTH_API = config.authUrl
    public static IMG_URL = config.imgUrl;
    public static UploadImgShow_URL = config.uploadImgShowUrl;  //上传后的图片显示地址
    public static WSS_URL = config.wssUrl; //ws地址格式
    
    public static AUTH_HEARTBEAT_INTERVAL = 15 // 30miao 心跳间隔
    public static AVATAR_NUM = 5								//頭像數量
    public static FREE_GOLD_MAX_LIMIT = 2000					//免費金幣領取限制的金幣數
    public static FRUIT_COST = 3000							//找刺激每次消耗的金幣數
    public static CREATE_VIP_ROOM_COST = 10000					//創建VIP房間需要的金幣
    public static VIP_ROOM_LEVEL_LIMIT = [100, 200, 500, 1000, 2000, 5000]	//創建VIP房間可設置的最小倍率
    public static FIRST_CHARGE_AWARDS = [{goodsId : 1, amount : 30000}, {goodsId : 2, amount : 1}, {icon : "gun_05", name : "极光魅影(1天)"}] //首充獎勵
    public static REPLACE_PACKAGE_AWARD = {goodsId : 1, amount : 5000} //換包獎勵
    public static LUCKY_TICKET_GUESS_COST = 5 					//幸運競猜競猜一次消耗的奪寶卡

    public static SYSTEMGOLDSCALE = 1;  //系统金币缩放系数  //最低值为1 但是当前版本为最低为0.1
    public static GOLDEFFECTSCALE = 100;   //金币特效数量缩放值， 当前为1个金币显示1个金币动画o

    public static MY_USERNAME:string = "用户昵称";  //用户昵称
    public static MOBILECODE_CONTRL:number = 0;  //验证码间隔计时

    public static SupportGoldLimit:number = 1000;




    public static PLATFORM:OSType = OSType.ANDROID;

    public static OPENADAPT:boolean = true;


    public static OPEN_TRADITIONAL:boolean = false;

    public static HOTVERSION:string = "3.0.1.3.59";

    public static SHARE_URL = config.shareUrl;  //分享地址



}