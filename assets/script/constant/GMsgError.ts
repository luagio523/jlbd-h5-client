let httpErrors = {}
function add2(error) {
	if (httpErrors[error.code]) {
		cc.log(cc.js.formatStr("had the same error code[%x], msg[%s]", error.code, error.message))
	}
	httpErrors[error.code] = error.message
	return error.code
}


export function httpErrmsg(ec){
    return httpErrors[ec] || ec
}


export const httpErrorCode = {
	EC_SUCC                         : add2({code : 0x0000, message : "接口成功响应"}),
	EC_PARAM_INVILD                 : add2({code : 0x0001, message : "接口请求参数出错"}),
	EC_SIGN_ERROR                   : add2({code : 0x0002, message : "sign参数出错"}),
	EC_PLATFORM_NOT_EXIST           : add2({code : 0x0003, message : "渠道不存在"}),
	EC_SDK_API_ERROR                : add2({code : 0x0004, message : "请求数据出错"}),
	EC_METHOD_NOT_EXIST             : add2({code : 0x0005, message : "不存在此api方法"}),
	EC_SDK_API_PARAM_ERROR          : add2({code : 0x0006, message : "请求SDK出错参数出错"}),
	EC_MISCCODE_NOT_EXIST           : add2({code : 0x0007, message : "您输入的礼包码有误，请重试"}),
	EC_MISCTYPE_NOT_EXIST           : add2({code : 0x0008, message : "您的礼包码已失效，兑换失败！"}),
	EC_MISCCODE_NOT_IN_USE_TIME     : add2({code : 0x0009, message : "您的礼包码已失效，兑换失败！"}),
	EC_ACTIVE_CODE_NOT_EXIST        : add2({code : 0x000a, message : "礼包码不存在"}),
	EC_ACTIVE_CODE_USED             : add2({code : 0x000b, message : "礼包码已被使用"}),
	EC_USER_NEED_ACTIVE             : add2({code : 0x000c, message : "帐号未激活"}),
	EC_HTTP_METHOD_ERROR            : add2({code : 0x000d, message : "http方法不正确"}),
	EC_MISCCODE_HAD_USED            : add2({code : 0x000e, message : "您的礼包码已经被使用"}),
	EC_ACTIVITY_NO_UPDATE           : add2({code : 0x000f, message : "活动版本号没更新"}),
	EC_PLATFORM_NOT_JOIN            : add2({code : 0x0010, message : "此平台不参与此次测试 "}),
	EC_ACCOUNT_CLOSE                : add2({code : 0x0011, message : "此账号被封禁"}),
	EC_MISCTYPE_HAD_USE             : add2({code : 0x0012, message : "您已领取过同类型的礼包码"}),
	EC_IMEI_OR_IDFA_CLOSE           : add2({code : 0x0013, message : "玩家手机设备被封禁"}),
	EC_FUND_PARM_ERROR              : add2({code : 0x0014, message : "参加夺冠参数错误"}),
	EC_SMS_ERROR_ACTIVE_CODE        : add2({code : 0x0015, message : "手机绑定验证码不对"}),
	EC_FUND_ITEM_CLOSE              : add2({code : 0x0016, message : "夺冠商品已下架"}),
	EC_FUND_NUM_OVER                : add2({code : 0x0017, message : "超过参与夺冠商品上限"}),
	EC_FUND_ROUND_CLOSE             : add2({code : 0x0018, message : "夺冠期数已结束"}),
	EC_FUND_ADDRESS_EMPTY           : add2({code : 0x0019, message : "夺冠地址不完善"}),
	EC_FUND_ADDRESS_ERROR           : add2({code : 0x001a, message : "夺冠地址信息错误"}),
	EC_COUPON_NOT_EXIST             : add2({code : 0x001b, message : "兑奖券码不存在"}),
	EC_COUPON_HAVE_EXCHANGE         : add2({code : 0x001c, message : "兑奖券码已兑换"}),
	EC_COUPON_HAVE_OFF              : add2({code : 0x001d, message : "兑奖券码已核销"}),
	EC_REQUEST_FAIL                 : add2({code : 0x001e, message : "网络请求失败"}),
	EC_COUPON_HAVE_USE              : add2({code : 0x001f, message : "兑奖券码已使用"}),
	EC_SAME_COUPONTYPE_HAVE_USE     : add2({code : 0x0020, message : "已使用过相同类型的兑奖码"}),
	EC_ROLE_HAVE_DONE               : add2({code : 0x0021, message : "用户已赠送过Q币"}),
	EC_ROLE_HAVE_CREATED            : add2({code : 0x0022, message : "邀请人角色已被创建"}),
	EC_INVITE_ROLE_FAIL             : add2({code : 0x0023, message : "邀请人角色创建失败"}),
	EC_GIFT_GET_FAIL                : add2({code : 0x0024, message : "奖品领取失败"}),
	EC_GIFT_NEED_CHECK              : add2({code : 0x0025, message : "奖品领取待审核"}),
	EC_GIFT_HAVE_GET                : add2({code : 0x0026, message : "奖品已经领取"}),
	EC_INVITE_ROLE_EXIST            : add2({code : 0x0027, message : "被邀请人已存在邀请人的上级邀请人里"}),
	EC_DATA_NOT_EXIST               : add2({code : 0x0032, message : "数据不存在"}),
	EC_DATA_IS_FAKE                 : add2({code : 0x0033, message : "请求的数据造假"}),
	EC_ACTIVITY_HAVE_EXPIRED        : add2({code : 0x0034, message : "活动已过期"}),
	EC_HANDLE_FAIL                  : add2({code : 0x0035, message : "操作失败"}),
	EC_ITEM_NOT_EXIST               : add2({code : 0x0036, message : "商品不存在"}),
	EC_ITEM_CLOSE                   : add2({code : 0x0037, message : "商品已下架"}),
	EC_ITEM_NUM_OVER                : add2({code : 0x0038, message : "库存不足"}),
	EC_ADDRESS_EMPTY                : add2({code : 0x003a, message : "地址不完善"}),
	EC_ADDRESS_ERROR                : add2({code : 0x003b, message : "地址信息错误"}),
	EC__LEVEL_ERROE                 : add2({code : 0x003c, message : "大师分等级不足"}),
	EC__BAG_ERROE                   : add2({code : 0x003d, message : "福袋数量不足"}),
	NOT_FIRST_CHARGE                : add2({code : 0x003e, message : "不是首次充值"}),
	DO_ORDER_ERROR                  : add2({code : 0x003f, message : "下单失败"}),
	DIAMOND_BALANCE_NOT_ENOUGH      : add2({code : 0x0040, message : "钻石数量不足"}),
	OVER_BUY_TIMES                  : add2({code : 0x0041, message : "超过限制次数"}),
	OVER_LIMIT_TIME                 : add2({code : 0x0042, message : "超过购买时间"}),
	ITEM_LIMIT_VIP                  : add2({code : 0x0043, message : "此商品限VIP购买"}),
	SMS_NOT_FOUND                   : add2({code : 0x0044, message : "请先发送验证码"}),
	SMS_OVER_TIME                   : add2({code : 0x0045, message : "验证码已失效"}),
	PWD_LENGTH_ERROR                : add2({code : 0x0046, message : "密码长度错误"}),
	MOBILE_INVALID                  : add2({code : 0x0047, message : "手机号不合法"}),
	MOBILE_USED                     : add2({code : 0x0048, message : "该手机号已绑定账号"}),
	CONFIG_NOT_EXIST_OR_CLOSED      : add2({code : 0x0049, message : "该配置项不存在或已关闭"}),
	CONFIG_REFUSED                  : add2({code : 0x004a, message : "该配置项对当前服务器或渠道关闭"}),
	CERTIFICATION_STATUS_FALSE      : add2({code : 0x004b, message : "尚未实名认证"}),
	SERVER_ERROR                    : add2({code : 0x004c, message : "连接游戏服失败"}),
	EC_NOT_IN_CHANNEL_LIST          : add2({code : 0x004d, message : "您的礼包码无法在本平台使用，兑换失败!"}),
	EC_CODE_STATUS_FALSE            : add2({code : 0x004e, message : "您的礼包码已失效，兑换失败！"}),
	EC_REGISTER_IS_ERROR            : add2({code : 0x03e8, message : "注册失败"}),
	EC_TOKEN_IS_ERROR               : add2({code : 0x03e9, message : "Token错误"}),
	EC_USER_IS_EXIST                : add2({code : 0x03ea, message : "用户已存在"}),
	EC_USER_NOT_EXIST               : add2({code : 0x03eb, message : "用户不存在"}),
	EC_PWD_IS_ERROR                 : add2({code : 0x03ec, message : "密码错误"}),
	EC_SERVERlIST_IS_ERROR          : add2({code : 0x03ed, message : "服务器列表错误"}),
	EC_USER_IS_NULL                 : add2({code : 0x03ee, message : "用户名是空值"}),
	EC_PWD_IS_NULL                  : add2({code : 0x03ef, message : "密码是空值"}),
	EC_UNBOUND_MOBLIENUM            : add2({code : 0x03f0, message : "未绑定手机号"}),
	EC_SMS_SEND_FAILED              : add2({code : 0x03f1, message : "短信发送失败"}),
	EC_SMS_SEND_OFTEN               : add2({code : 0x03f2, message : "短信发送太频繁"}),
	EC_TOKEN_OUT_OF_DATE            : add2({code : 0x004f, message : "挂机过久，请重新登录"}),
	EC_PLATFORM_ERROR               : add2({code : 0x0050, message : "平台服务器异常"}),
	EC_TOKEN_VERIFY_ERROR           : add2({code : 0x0051, message : "token验证失败"}),
	EC_NOT_BEGINNER           		: add2({code : 0x0052, message : "不是新手"}),
	EC_DOWNLOAD_URL_NOT_EXIT        : add2({code : 0x0053, message : "下载地址不存在"}),
	EC_EXCHANGE_CLOSED        		: add2({code : 0x0054, message : "兑换商城不在开放期内"}),
	EC_HOT_CUSTOMER_NOT_EXIST       : add2({code : 0x0055, message : "热更公告不存在"}),
	EC_TYPE_FUND_GOT        		: add2({code : 0x0056, message : "已经购买过同类型基金"}),
	EC_CODE_GOT        				: add2({code : 0x0057, message : "您已经兑换过该礼包码！"}),
	EC_JDCARD_NOT_GOT				: add2({code : 0x0058, message : "暂无可兑换的京东卡"}),
}

//-------------------------------------------------------------------------------------------------------------------------

export const ErrorCode = {
	EC_SUCCESS: 0,
	EC_PARAM_INVILD: 1,
	EC_NOT_SUPPORT_API_METHOD: 5,
	EC_HTTP_METHOD_ERROR: 13,
	EC_VERIFY_ERROR: 21,
	EC_USER_HAS_INVITE: 34,
	EC_USER_INVITE_FAIL: 35,
	EC_USER_GET_INVITE_AWARD_FAIL: 36,
	EC_TELNUM_MISSMATCHING: 51,
	EC_PWD_CHANGE_FAILD: 53,
	EC_HTTP_USER_IS_EXIST: 1002,
	EC_USER_NOT_EXIST: 1003,
	EC_PWD_IS_ERROR: 1004,
	EC_USERNAME_IS_NULL: 1006,
	EC_PWD_IS_NULL: 1007,
	EC_TELNUM_NOT_BOUND: 1008,
	CERTIFICATION_STATUS_FALSE:75,// 尚未实名认证
	EC_TOKEN_OUT_OF_DATE: 79,
	EC_PLATFORM_ERROR: 80,
	EC_NOT_BEGINNER:82,// 不是新手
	EC_EXCHANGE_CLOSED:84,// 兑换商城不在开放期内
	SERVER_ERROR:76,// 连接游戏服失败
}


export const SpecialErrorCode = {
	SUCCESS: 0,
	PARAM_INVILD: 1,
	SIGN_ERROR: 2,
	METHOD_NOT_EXIST: 3,
	SYSTEM_ERROR: 4,
	ACCOUNT_NOT_EXIST: 5,
	NOT_BIND_MOBILE: 6,
	HTTP_METHOD_ERROR: 7,
	SESSION_TIMEOUT: 8
}



///////////////////////////////////////////////////////////////////////////////////////////////////////


let errors = {}

export function errmsg(ec){
    return errors[ec] || ec
}
	

function add(error){
    if(errors[error.code] ){
        cc.log(cc.js.formatStr("had the same error code[%x], msg[%s]", error.code, error.message))
    }
	errors[error.code] = error.message
	return error.code
}

  

//系统错误码
export const SystemError = {
	success 				: add({code : 0x0000, message : "成功"}),
	forward 				: add({code : 0x0001, message : "重定向"}),
	unknown 				: add({code : 0x0002, message : "未知错误"}),
	timeout 				: add({code : 0x0003, message : "请求超时"}),
	serialize 				: add({code : 0x0004, message : "序列化错误"}),
	argument				: add({code : 0x0005, message : "参数错误"}),
	notImplement   			: add({code : 0x0006, message : "协议未实现"}),
	illegalOperation		: add({code : 0x0007, message : "非法操作"}),
	db						: add({code : 0x0008, message : "数据库操作失败"}),
	messageTooLong			: add({code : 0x0009, message : "消息包太长"}),
	protoNotExisits			: add({code : 0x000a, message : "不存在此协议"}),
	notLogin				: add({code : 0x000b, message : "未登录"}),
	serviceIsStoped			: add({code : 0x000c, message : "服务故障"}),
	busy					: add({code : 0x000d, message : "服务忙"}),
	logined					: add({code : 0x000e, message : "已登录"}),
	network					: add({code : 0x000f, message : "网络异常"}),
	ServerMaintenance		: add({code : 0x0010, message : "服务器维护"}),
	config					: add({code : 0x0011, message : "配置错误"}),
	roleIsSeal				: add({code : 0x0012, message : "您的账号已被封,请与客服联系"}),
	loginExpetion			: add({code : 0x0013, message : "账号登录受限"}),
}

//游戏公用错误码
export const GameError = {
	resourceNotEnough 		: add({code : 0x00a1, message : "资源不足"}),
	goldNotEnough 			: add({code : 0x00a2, message : "金币不足"}),
	treasureNotEnough 		: add({code : 0x00a3, message : "福袋不足"}),
	luckyBagNotEnough 		: add({code : 0x00a4, message : "福袋不足"}),
	bagNotEnough			: add({code : 0x00a5, message : "背包空间不够"}),
	openHoleResLimit        : add({code : 0x00a6, message : "打孔材料不足"}),
	petGemNotEnough			: add({code : 0x00a7, message : "宠物晶石不够"}),
	starCoreNotEnough       : add({code : 0x00a8, message : "星核不够"}),
	petCoinNotEnough    	: add({code : 0x00a9, message : "宠物币不够"}),
	upmaterialNotEnough     : add({code : 0x00aa, message : "强化材料不够"}),
	resourceNotExist		: add({code : 0x00ab, message : "资源不存在"}),
	unionResNotEnough       : add({code : 0x00ac, message : "公会资源不够"}),
	goodsNotEnough 			: add({code : 0x00ad, message : "道具数量不足"}),
	goodsNotExist 			: add({code : 0x00ae, message : "道具不存在"}),
	roleLevelNotEnough 		: add({code : 0x00af, message : "角色等级不足"}),
	fightPointNotEnough		: add({code : 0x00b0, message : "战力不足"}),
	diamondNotEnough 		: add({code : 0x00b1, message : "钻石不足"}),
	confNotExist            : add({code : 0x00b2, message : "奖励不存在"}),
	awardRecved             : add({code : 0x00b3, message : "已领取奖励"}),
	seasonScoreNotEnough    : add({code : 0x00b4, message : "积分不足"}),
	boxOutTimed    			: add({code : 0x00b5, message : "宝箱已经过期了"}),
	boxNotExist             : add({code : 0x00b6, message : "本组宝藏已全部购买"}),
	recvCondNotEnough    	: add({code : 0x00b7, message : "领取条件不足"}),
	notAwards               : add({code : 0x00b8, message : "没有奖励可以领取"}),
	awardsTimesNotEnought   : add({code : 0x00b9, message : "次数不足"}),
	huntingNotEnough 		: add({code : 0x00c1, message : "猎妖石不足"}),
	awardsSending           : add({code : 0x00c2, message : "已领取"}),
	huntTaskScoreNotEnought : add({code : 0x00c3, message : "号角不足"}),
}


//认证
export const AuthError = {
	tokenIsInvalid	 		: add({code : 0x0101, message : "token不合法"}),
	tokenIsTimeout			: add({code : 0x0102, message : "挂机过久，请重新登录"}),
	nicknameIsInvalid		: add({code : 0x0103, message : "昵称含有非法字符"}),
	nicknameIsExists		: add({code : 0x0104, message : "昵称已经存在"}),
	hasRole					: add({code : 0x0105, message : "该账户已经存在角色"}),
	banAccount				: add({code : 0x0106, message : "该账号已被暂停服务"}),
	imeiIsInvalid			: add({code : 0x0107, message : "异常的设备号"}),
	nicknameLengthInvalid   : add({code : 0x0108, message : "昵称长度超出限制"}),
}

//捕鱼
export const CatchFishError = {
	noHaveGunType			: add({code : 0x0201, message : "你还没有该炮塔类型"}),
	passwordWrong			: add({code : 0x0202, message : "密码错误"}),
	gunLevelTooLow			: add({code : 0x0203, message : "您的炮倍未达到房间的下限哦！"}),
	roomNotFound			: add({code : 0x0204, message : "房间不存在"}),
	fireCding				: add({code : 0x0205, message : "发炮太频繁"}),
	roomIsFull				: add({code : 0x0206, message : "房间已满"}),
	lessThenMinGunLevel		: add({code : 0x0207, message : "不能低于房间最低炮倍"}),
	joined					: add({code : 0x0208, message : "你已经报名了当前竞技比赛"}),
	notEnoughMoney			: add({code : 0x0209, message : "您不满足参赛条件"}),
	bulletNotEnough			: add({code : 0x020a, message : "子弹不足"}),
	notStart				: add({code : 0x020b, message : "竞技比赛还未开始,请等待其他玩家"}),
	isInArena				: add({code : 0x020c, message : "已经在竞技比赛中"}),
	arenaIsOver				: add({code : 0x020d, message : "竞技比赛已经结束"}),
	gunLevelUnlock			: add({code : 0x020f, message : "炮倍未解锁"}),
	energyNotFull			: add({code : 0x0210, message : "怒气还未满"}),
	invalidSliceRate		: add({code : 0x0211, message : "别着急慢慢来", describe : "异常的切鱼频率"}),
	goldTooLow              : add({code : 0x0212, message : "金币不够无法进入房间"}),
	notChestExist 			: add({code : 0x0213, message : "没有宝藏"}),
	arenaIsFull 			: add({code : 0x0214, message : "参赛人数已满"}),
	arenaIsNotExist 		: add({code : 0x0215, message : "赛事不存在"}),
	arenaMatchTimesIsFull 	: add({code : 0x0216, message : "挑战次数已满"}),
	arenaHasJoin 			: add({code : 0x0217, message : "比赛已经报名"}),
	arenaNotAvailable       : add({code : 0x0218, message : "比赛还未开始"}),
	arenaPlayerExsit        : add({code : 0x0219, message : "比赛玩家不存在"}),
	GunNumIsFull            : add({code : 0x0220, message : "子弹已满"}),
	gunLevelTooHigh			: add({code : 0x0221, message : "炮倍等级太高"}),
	arenaHasStart			: add({code : 0x0222, message : "比赛已经开始"}),
	masterLevelNotEnough	: add({code : 0x0223, message : "大师赛等级不够"}),
	vipLevelNotEnough	    : add({code : 0x0224, message : "vip等级不够"}),
	vipRoomIsFull       	: add({code : 0x0225, message : "VVIP房间已满"}),
	posIsExistPlayer 		: add({code : 0x0226, message : "该位置已经有人了"}),
	roomPlayerNumIsFull     : add({code : 0x0227, message : "该鱼桌人数已满"}),
	taskNotExist 		    : add({code : 0x1403, message : "任务不存在"}),
	skillTimeNotEnd         : add({code : 0x0228, message : "技能时间还没结束"}),
	autoFrieTimeEnd         : add({code : 0x0229, message : "免费时间已到时"}),
	bossIsExist             : add({code : 0x0230, message : "场上已经有boss了"}),
	pokerIsNotExist         : add({code : 0x0231, message : "没有这张牌"}),
	wildTimesNotEnough      : add({code : 0x0232, message : "次数用完了"}),
}

// 角色模块错误码
export const RoleError = {
	cantChangName			: add({code : 0x0301, message : "你已经创建过昵称了"}),
	freeGoldNumMax 			: add({code : 0x0302, message : "今天领取上限"}),
	freeGoldZero 			: add({code : 0x0303, message : "金币数量超标"}),
	freeGoldTimeLeft		: add({code : 0x0304, message : "未到领取时间"}),
	mobileNotLock 			: add({code : 0x0305, message : "请先绑定手机号码"}),
	noGoldEnergy 			: add({code : 0x0306, message : "未获得黄金炮"}),
	goldEnergyTooLow 		: add({code : 0x0307, message : "能量不足，无法兑换"}),
	noChangeBag				: add({code : 0x0308, message : "请先换包再领取"}),
	sendCodeTooFrequently	: add({code : 0x0309, message : "获取验证码过于频繁"}),
	forbidLogin				: add({code : 0x030a, message : "您的账号存在异常，请联系客服"}),
	roleNotExist			: add({code : 0x030b, message : "角色不存在"}),
	cantBuyGun              : add({code : 0x030d, message : "不能购买此炮台"}),
	onlineTimeOut			: add({code : 0x0014, message : "防沉迷"}),
	notExistAward			: add({code : 0x0311, message : "没有奖励可以领取"}),
	notBuluVip              : add({code : 0x0312, message : "还不是蓝钻"}),
	notQQHallLogin          : add({code : 0x0313, message : "不是QQ大厅登录"}),
}

// 转盘
export const DiskError = {
	canRoll 			 	: add({code : 0x0401, message : "不能参加转盘"}),
}

//聊天
export const ChatError = {
	contentIsInvalid		: add({code : 0x0601, message : "聊天消息含有非法字符"}),
	speakTooOfen			: add({code : 0x0602, message : "聊天消息发送过快"}),
	forbidSpeak				: add({code : 0x0603, message : "已被禁言"}),
	targetOffline			: add({code : 0x0604, message : "对方已下线"}),
	channelNotExist  		: add({code : 0x0605, message : "频道号不存在"}),
}

// 宝箱
export const BoxError = {
	noOpenNum 				: add({code : 0x0701, message : "无开启次数"}),
}

//夺冠
export const FundError = {
	notbuyFund 				: add({code : 0x0901, message : "没有购买基金"}),
	awardNotExist 			: add({code : 0x0902, message : "没有奖励可以领取"}),
}

// 礼包码兑换
export const MiscError  = {
	miscCodeEmpty			: add({code : 0x0a01, message : "礼包码不能为空"}),
	miscCodeNotExist  		: add({code : 0x0a02, message : "请输入正确的兑换码"}),
	miscCodeHadGet          : add({code : 0x0a03, message : "兑换码已被使用"}),
	miscTypeNotExist		: add({code : 0x0a04, message : "此类型兑换码不存在"}),
	notInUseTime            : add({code : 0x0a05, message : "此兑换码不在使用期间内"}),
	useTheSameTypeMisccode  : add({code : 0x0a06, message : "你已经领取过该类型礼包"}),
	invalidMiscInfo  		: add({code : 0x0a07, message : "异常的兑换信息"}),
	canNotReceive  			: add({code : 0x0a08, message : "还不能领取奖励"}),
}

// 活动
export const ActivityError = {
	diskNoNum 				: add({code : 0x0b01, message : "充值金额不足"}),
	canNotGet 				: add({code : 0x0b02, message : "信息过期，请重新刷新界面"}),
	noRollNum 				: add({code : 0x0b03, message : "转盘次数不够"}),
	diskNotOpen 			: add({code : 0x0b04, message : "活动未开启"}),
	notOpen 				: add({code : 0x0b05, message : "活动暂未开放"}),
}

// 充值错误
export const ChargeError = {
	shopIndexError 			: add({code : 0x0c01, message : "充值物品不存在"}),
}

// 手机绑定
export const MobileError = {
	hadExist 				: add({code : 0x0d01, message : "该号码已被绑定"}),
	httpError 				: add({code : 0x0d02, message : "暂停绑定功能"}),
	notMatch 				: add({code : 0x0d03, message : "验证码错误"}),
	setNewPwdErr 			: add({code : 0x0d04, message : "绑定手机成功，修改密码失败"}),
}

export const ToolError = {
	paramsError             : add({code : 0x2901, message : "参数错误"}),
	toolNumNotEnough        : add({code : 0x2902, message : "道具数量不足"}),
	toolNotExist            : add({code : 0x2903, message : "道具不存在"}),
	prensentError           : add({code : 0x2904, message : "赠送对象不能是自己"}),
	outOfPresent            : add({code : 0x2905, message : "超出赠送限制"}),
	vipLevelTooLow          : add({code : 0x2906, message : "vip等级太低"}),
	notSameChannelId        : add({code : 0x2907, message : "不是同一个渠道"})
}

// 排行榜错误
export const RankError = {
	hadGet 					: add({code : 0x1101, message : "已经领取奖励"}),
	canNotGet				: add({code : 0x1102, message : "不能领取奖励"}),
}

// 邮件
export const MailError = {
	invalidMail				: add({code : 0x1201, message : "请求的邮件信息不存在"}),
	invalidAttach			: add({code : 0x1202, message : "没有可以领取的附件"}),
}

// 在线奖励
export const OnlineError = {
	cannotGet				: add({code : 0x1301, message : "不满足领取条件"}),
	hasGot					: add({code : 0x1302, message : "该奖励已经领取"}),
}

// 每日任务
export const TaskError = {
	canNotGet 				: add({code : 0x1401, message : "未达到领取条件"}),
	hadGet 					: add({code : 0x1402, message : "已经领取奖励"}),
}

// 奖池
export const PotError = {
	timeError 				: add({code : 0x1601, message : "竞猜时间为21:30分至次日20:50分"}),
	codeError 				: add({code : 0x1602, message : "竞猜号码格式错误"}),
}

// 七天登录
export const SevenDayError = {
	notOpen 				: add({code : 0x1701, message : "登录天数未满足"}),
	canNotGet 				: add({code : 0x1702, message : "不能领取"}),
}

//签到抽奖
export const SignDiskError = {
	hadDrawToday			: add({code : 0x1801, message : "今天已经抽奖"}),
	awardCanNotGet			: add({code : 0x1802, message : "未达到领取天数"}),
	awardHadGet				: add({code : 0x1803, message : "奖励已领取"}),
}

//许愿池
export const WishPoolError = {
	overLeftNum             : add({code : 0x1901, message : "剩余奖品不足10次"}),
}

//聚宝盆
export const TreasureBowlError = {
	notLeftTimes            : add({code : 0x1b01, message : "没有剩余次数"}),
}

//聚宝盆
export const CouponError = {
	notLeftTimes            : add({code : 0x1c01, message : "没有剩余次数"}),
	isOpen		            : add({code : 0x1c02, message : "此卡已经刮开"}),
	cannotGet	            : add({code : 0x1c03, message : "未达到领取条件"}),
	hadGot		            : add({code : 0x1c04, message : "该奖励已经领取"}),
}

//祈福
export const BlessError = {
	luckyValueNotFull       : add({code : 0x1d01, message : "幸运值未满"}),
}

//祈福
export const CrazyBoxError = {
	notLeftTimes       		: add({code : 0x1f01, message : "没有剩余次数"}),
	isOpen       			: add({code : 0x1f02, message : "此宝箱已开启"}),
}

//每日充值
export const DailyChargeError = {
	chargeDaysNotEnough     : add({code : 0x2001, message : "充值天数不足"}),
}

//好友邀请
export const InviteError = {
	notInActivityTime     	: add({code : 0x2101, message : "活动时间内创建角色才可领取"}),
	inviteIdNotExist		: add({code : 0x2102, message : "请输入正确的邀请人ID"}),
	hadGot		            : add({code : 0x2103, message : "该奖励已经领取"}),
	inviteNotEnough			: add({code : 0x2104, message : "邀请人数不足"}),
	canNotGet 				: add({code : 0x2105, message : "无奖励可领取"}),
}

//积分抽奖
export const ScoreLotteryError = {
	scoreNotEnough     		: add({code : 0x2201, message : "积分不足"}),
}

//摇钱树
export const MoneyTreeError = {
	leftNumNotEnough     		: add({code : 0x2301, message : "剩余奖品不足10份"}),
}

//龙宫宝藏
export const TreasurePalaceError = {
	openTimesNotEnough     		: add({code : 0x2401, message : "开启次数不足"}),
}

export const EggError = {
	notLeftTimes       		: add({code : 0x2501, message : "没有剩余次数"}),
	isOpen       			: add({code : 0x2502, message : "此金蛋已砸开"}),
}

export const GoldGunError = {
	prizeNotEnough       		: add({code : 0x2601, message : "奖励不足"}),
}

export const QBSignError = {
	notFindConfig       		: add({code : 0x2701, message : "找不到配置"}),
	canNotReceive       		: add({code : 0x2702, message : "领取条件不足"}),
}

export const MorrowGiftError = {
	giftIsReceived       		: add({code : 0x2801, message : "已经领取过奖励了"}),
	invalidReceivedTime       	: add({code : 0x2802, message : "领取时间还未到"}),
}


//兑换错误码
export const ExchangeError = {
	EC_ITEM_NOT_EXIST: add({code:0x0036, message: "商品不存在"}),
	EC_ITEM_CLOSE: add({code:0x0037, message: "商品已下架"}),
	EC_ITEM_NUM_OVER: add({code:0x0038, message: "库存不足"}),
	EC_ADDRESS_EMPTY: add({code:0x003a, message: "地址不完善"}),
	EC_ADDRESS_ERROR: add({code:0x003b, message: "地址信息错误"}),
	EC__LEVEL_ERROE: add({code:0x003c, message: "大师段位不足"}),
	EC__BAG_ERROE: add({code:0x003d, message: "福袋数量不足"}),
	SERVER_ERROR: add({code:0x004c, message: "连接游戏服失败"}),
	EC_NOT_IN_CHANNEL_LIST: add({code:0x004d, message: "礼包码对该渠道不开放"}),
	EC_CODE_STATUS_FALSE: add({code:0x004e, message: "礼包码已下架"}),
}
