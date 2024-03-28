
export const platform_config=
{
    "pid":101, //默认 一级渠道
    "channel_id":10000, //二级渠道  由我们定义
}
 
export const test_config = {
    "language":"cn",
    "authUrl1":"http:\/\/fish-test.nuoyougame.com:8020\/",
    "shopUrl1":"http:\/\/fish-test.nuoyougame.com:8020\/",
    "authUrl":"http:\/\/fish-test.nuoyougame.com:8020\/",
    "shopUrl":"http:\/\/fish-test.nuoyougame.com:8020\/",
    "imgUrl":"http://fish-test.nuoyougame.com:8023",
    "cdnUrl":"http:\/\/fish-cdn.nuoyougame.com\/h5\/",
    "uploadImgShowUrl": "http:\/\/fish-test.nuoyougame.com:8020",
    "avatarImgUrl":"http://fish-test.nuoyougame.com:8020\/upload\/",
    "authUrls":{},
    "shareUrl":"http://localhost:7456/",
    "wssUrl":"",
}

/**QQ专用 */
export const pub_config = {
    "language":"cn",
    "authUrl1":"http:\/\/fish-platform.nuoyougame.cn:8020\/",
    "shopUrl1":"http:\/\/fish-platform.nuoyougame.cn:8020\/",
    "authUrl":"http:\/\/fish-platform.nuoyougame.cn:8020\/",
    "shopUrl":"http:\/\/fish-platform.nuoyougame.cn:8020\/",
    "imgUrl":"http:\/\/fish-platform.nuoyougame.cn:8023",
    "cdnUrl":"http:\/\/fish-cdn.nuoyougame.cn\/h5\/",
    "uploadImgShowUrl": "http://fish-platform.nuoyougame.cn:8020",
    "avatarImgUrl":"http:\/\/fish-platform.nuoyougame.cn:8020\/upload\/",
    "authUrls":{},
    "shareUrl":"",
    "wssUrl":"",
}

/**官网用 */
export const official_pub_config = {
    "language":"cn",
    "authUrl1":"https:\/\/fish-platform.nuoyougame.cn:8021\/",
    "shopUrl1":"https:\/\/fish-platform.nuoyougame.cn:8021\/",
    "authUrl":"https:\/\/fish-platform.nuoyougame.cn:8021\/",
    "shopUrl":"https:\/\/fish-platform.nuoyougame.cn:8021\/",
    "imgUrl":"https:\/\/fish-admin.nuoyougame.cn:8026\/",
    "cdnUrl":"https:\/\/fish-cdn.nuoyougame.cn\/h5\/",
    "uploadImgShowUrl": "https:\/\/fish-admin.nuoyougame.cn:8021\/",
    "avatarImgUrl":"https:\/\/fish-platform.nuoyougame.cn:8021\/upload\/",
    "authUrls":{},
    "shareUrl":"http://fish-cdn.nuoyougame.cn/h5/fish/3d/index.html",
    "wssUrl":"wss://fish-platform.nuoyougame.cn:8021/ws/",
}

/**大胡子 */
export const dahuzi_config = {
    "language":"cn",
    "authUrl1":"https:\/\/fish-platform.widnen.com\/",
    "shopUrl1":"https:\/\/fish-platform.widnen.com\/",
    "authUrl":"https:\/\/fish-platform.widnen.com\/",
    "shopUrl":"https:\/\/fish-platform.widnen.com\/",
    "imgUrl":"https:\/\/fish-mgr.widnen.com",
    "cdnUrl":"https:\/\/fish-cdn.widnen.com\/h5\/",
    "uploadImgShowUrl": "https:\/\/fish-platform.widnen.com\/",
    "avatarImgUrl":"https:\/\/fish-platform.widnen.com\/upload\/",
    "authUrls":{},
    "shareUrl":"https://fish-cdn.widnen.com/h5/fish/3d/index.html",
    "wssUrl":"wss://fish-platform.widnen.com/ws/",

}

export let useSdk = false    //是否使用sdk
export let config = test_config //配置是哪个


//////////////////////////////////////////////////////////////////////////////////////////////

export default class GlobalConfig {
    private static _ins:GlobalConfig

    public static ins():GlobalConfig{
        return this._ins;
    }

    public static setIns(val):void{
        this._ins = val
    }
    ExpConfig
    NameConfig
    NewRoleConfig
    RoleConfig
    DropGroupConfig
    DropTableConfig
    EffectConfig
    EquipConfig
    ItemConfig
    MonstersConfig_keys: {scale: number; hp: number; animType: number; stunRes: number; skin: number; level: number; tough: number; waitGatherTime: number; type: number; atk: number; def: number; id: number; shield: number; rect: number; name: number; ms: number; as: number; skill: number; crit: number; res: number}
    MonstersConfig: {[key: number]: any[]}
    ZonesConfig
    EffectsConfig_keys: {overlayType: number; type: number; group: number; args: number; id: number; duration: number; interval: number; isBuff: number; effName: number}
    EffectsConfig: {[key: number]: any[]}
    EffectsClientConfig
    SkillsOpenConfig
    SkillsConfig
    SkillsBreakConf
    SkillsBreakClientConfig
    SkillsBreakUpgradeConfig
    SkillsUpgradeConfig
}


