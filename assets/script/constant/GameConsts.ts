//游戏本地化变量
export const Game = {
    SoundVol: "SoundVol",
    SoundMute: "SoundMute",
    MusicVol: "MusicVol",
}

//游戏状态
export enum GameStatus {
    START = 'START',
    GAME_OVER = 'GAME_OVER',
    FINISH = 'FINISH',
}

export const ReqType = {
    HTTP: "HTTP",
    WS : "WS",
}

export const ResPath = {
    CONFIG:"config/",
    PB:"pb/",
    UI:"UI/",
    UI_APP:"UI_APP/",
}

export const FGUIResPath = {
    ICON: "ui://PublicIcon/"
}

export enum ViewType{
    PANEL ,
    EFFECT,
    STATUS,
    DIALOG,
    TIP,
    GUIDE,
    LOADING
}

// export enum ViewType{
//     PANEL = "PANEL",
//     STATUS = "STATUS",
//     DIALOG = "DIALOG",
//     ALERT = "ALERT",
//     TIP = "TIP",
//     GUIDE = "GUIDE",
//     LOADING = "LOADING",
// }

/**经典场 9个玩法 */
export enum ClassicType {
    Default = -1,
    JINCHANNAFU,
    ZHAOCHAIJUBAO,
    DEPUTIAOZHAN,
    BIHAICHAOSHENG,
    LONGGONGBAOZANG,
    DASHENGGUILAI,
    SHUANGSHAQUNDAO,

    BOSS1 = 11,
    BOSS2 = 12,
    BOMB = 13,
    HUNTING_CHUJI = 14,
    HUNTING_GAOJI = 15,
    DRAGON = 50,
    FIERYDRAGON = 51,
    Guide = 1300,
    MOREN = 1301,
}

export enum ClassicGrade {
    LOW,
    CENTER,
    HIGHT
}

export enum ClassicRank {
    FIRST,
    SECOND,
    THIRD
}

export const ClassicTypeName = {
    0:"金蟾纳福",
    1:"招财聚宝",
    2:"龙珠之争",
    3:"碧海潮声",
    4:"黄金岛",
    5:"大圣归来",
    6:"双鲨群岛",
    11:"蓝色风暴",
    12:"紫气东来",
    13:"炸弹场",
    14:"初级猎妖场",
    15:"高级猎妖场",
    50:"蟹大厨来袭",
    51:"讨伐火龙王",
};

export const ClassicRankName = [
    "",
    "新手场",
    "进阶场",
    "大师场"
];

export const ClassicPlayName = {
    0:"金蟾觉醒",
    1:"财神赐福",
    2:"龙珠宝库",
    3:"人鱼宝藏",
    4:"龙珠宝藏",
    5:"宝藏山",
    6:"双鲨宝库",
    11:"蓝色风暴",
    12:"紫气东来",
    14:"猎妖石矿",
    15:"猎妖石矿",
    50:"蟹大厨来袭",
    51:"熔岩大奖",
}

export const Effect = {
    PLAYER_JOIN_EFFECT_ID : 602
}


export enum Switch {
    ON,
    OFF,
}

export enum GoodsIDType {
    Default,
    GOLD,
    TREASURE,
    DIAMOND
}


export enum RedTop {
    NO,
    HAS
}

export enum LoginType {
    WX = 1,
    QQ = 2,
}


export const ToolEventPre:string = "ToolEventPre_";


/**
 * 房间类型   对应不同的玩法
 */
export const RoomPlayType = {
    HALL    : 0,//大厅
    CLASSIC : 1,//普通场
    VIP     : 2,//自建场
    ARENA   : 3,//比赛场
    BOSS    : 4,//boss场
    BOMB    : 5,//炸弹场
    GUIDE   : 6,
    HUNT    : 7,//猎妖场
    XIEDACHU: 8,//蟹大厨
    HUOLONG: 9,//火龙赛季
    MINGAME :10,//小游戏
}

export enum RoomLimitType {
    CLASSIC,
    ARENA,
    BOMB,
    BOSS,
    HUNT,
    Dragon,
    FieryDragon,
    VIP,
}

export enum RoomLimitId {
    LongZhu = 2,
    LongZhuSai = 103,
}

/**
 * 玩法ui类型  不同的玩法对应不同的ui
 */
export enum PlayUIType {
    CLASSIC,
    BOMB,
    ARENA,
    GUIDE,
    HUNT,
    Dragon,
}

/**
 * 游戏检测类型
 * 第一次进入游戏，会挨个检测，是否显示对应的窗口
 *  */
export enum GameCheckType {
    Realname,       //实名制
    FieryDragonAD,  //火龙
    VipLogin,       //vip登录
    ServenSign,     //七日签到
    DailySign,      //每日签到
    LightningStorm, //闪电风暴
    TommorrowGift,  //明日豪礼
    DragonBoatAD,   //端午节
    Support,        //援助礼包
    ValuePack,      //超值礼包
    RechargeFirst,  //首冲
    Fund,           //成长基金
    NmCard,         //月卡
    TreasureLuck,   //福袋寻宝
    LoginDailyLuck, //日常登录抽奖
    GradeGiftBag,   //猎手之旅,
    DailyGiftBag,   //每日特惠
    RANK,           //排行榜炫耀页
    HAPPYFISH,      //欢乐渔场
    Hunter,         //猎人之旅
    LUCKYDRAW,      //幸运转盘
    GUNLVUP,        //炮倍直升
    SEVENGROWTH,    //七天成长
    NewYear,        //元旦豪礼
    Notice          //公告

            
            
            
            
            
}

/**
 * 显示界面类型
 * 用来判断是panel还是window
 */
export enum ShowViewType {
    PANEL,
    Window,
}

/**
 * 操作系统
 */
export enum OSType {
    ANDROID = "android",
    IPHONE = "iphone",
    WEB = "web"
}

/**
 *  渠道id
 */
export enum CHANNEL_ID {
    OFFICIAL = 10000,
    VIVO = 10010,
    OPPO = 10020,
    IOS = 10040,
    QUICK = 10050,
    QuickH5 = 10060,
    Boss = 10070,
    QQ = 10090,
    KUAIPAN = 10110,      //快盘
    DAHUZI = 10120,       //大胡子
    MXHL = 10130,         //梦想合力
    MXHLH5 = 10140,       //梦想合力 h5
    DQ = 10150,           //大秦
    SBGDY = 10160,        //世博广电云
    GH = 10170,           //工会
    SHBY_QUICK = 10180,    //深海疯狂捕鱼 quick
    SHBY_OFFICAL = 10190,         //深海疯狂捕鱼 offical
    SBY_OFFICAL = 10200,         //深海疯狂捕鱼 offical
}

/**
 * pid
 */
export enum PIDTYPE {
    HUYA = 109,
}

/**
 * 解锁炮台的途径
 */
export enum UNLOCKGUNLV_CHANNEL {
    ITEM,
    DIAMOND,
}

/**
 * 按钮状态
 */
export enum ButtonStaute {
    Not, //不满足条件，未开始，未完成
    Complete, //完成
    Received, //已领取
}


/**
 * 恭喜获得  界面标题
 * 恭喜获得/恭喜升级/vip登录
 */
export enum GoodsPanelType {
    GOODS,
    UPLV,
    VIPLOGIN
}

export enum MiniGameType {
    HAIDAOTANXIAN = 1001,
    LONGGONGBAOZANG = 1002,
    FENGKUANGXIAOXIAOLE = 1003,
}

export enum MiniGamePlayType {
    HAIDAOTANXIAN = 1,
    LONGGONGBAOZANG =2,
    FENGKUANGXIAOXIAOLE = 3,
}

export const MiniGameName = {
    1001:"海岛探险",
    1002:"龙宫宝藏",
    1003:"疯狂消消乐",
}

export enum MoneyType {
    RMB = 1,
    NT = 4,
    Q = 10,
    YUN = 100,
}

export enum MoneyTypeStr {
    RMB = "元",
    NT = "NT$",
    Q = "Q点",
    YUN = "云币",
}


/*梦想合力quick h5*/
export const QUICKH5_MXHL_CONFIG = {
    "productCode":"72331481937325697337461171795852",
    "productKey":"19623543",
}

/**新官方quick h5*/
export const QUICKH5_CONFIG = {
    "productCode":"28884413538938591700672184944876",
    "productKey":"75510646",
}


