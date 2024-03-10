/**
 * 游戏mvc模块定义文件
 * 用于生成代码
 * events 模块监听的事件
 * views　有哪些视图
 * services 服务　
 */

_module_configs ={}

// // //登陆
// _module_configs["Login"] = {
//     events : [
//                "SdkLogin_View_Show","Native_View_Show", "Official_Web_View_Show", "Official_Native_Login_View_Show",
//                "Login_View_Show","Account_View_Show","CreateRole_View_show","GetPassword_View_Show",
//              ],
//     views :  ["NativeLogin","SdkLogin","OfficialWebLogin","OfficialNativeLogin","Login", "Account", "CreateRole", "GetPassword", "UpdateAssets"],
// }


// //角色
// _module_configs["Role"] = {
//     events : [
               
//              ],
//     views :  ["Role"],
// }

// //大厅 经典玩法
// _module_configs["Hall"] = {
//     events : [
//               "Hall_View_Show","Marquee_View_Show"
//              ],
//     views :  ["Hall","Marquee"],
// }

// //排行榜
// _module_configs["Rank"] = {
//     events : ["Rank_View_Show"
//             ],
//     views :  ["Rank"],
// }




// //sdk
// _module_configs["Sdk"] = {
//     events : ["Sdk_Init","Sdk_Login","Sdk_Logout","Sdk_Switch_Login","Sdk_Pay","Sdk_Exit","Get_RealName",
//     "Share_Wechat","Share_Friend_Page","Install_Apk","Sdk_submit", "Sdk_Report","Sdk_Open_Service", "Close_All_Window"],
//     views :  [],
// }



// //邮件
// _module_configs["Mail"] = {
//     events : ["Get_All_Mails_Status","Read_Mail","Get_Attach","Del_Mail","Show_Del_Mail_View","Get_All_Attach","Mail_View_Show",
//                 "Check_Mail_Red", "Close_All_Window",
//                 "Update_Gold", "Update_Treasure", "Update_Diamond",
//             ],
//     views :  ["Mail","DeleteMail"],
// }

// //聊天
// _module_configs["Chat"] = {
//     events : ["Chat_Receive_Msg", "Chat_Send_Msg", "Chat_View_Show"
//             ],
//     views :  ["Chat"],
// }



// //商城
// _module_configs["Shop"] = {
//     events : [
//                 "Shop_View_Show"
//             ],
//     views :  ["Shop"],
// }

// //设置
// _module_configs["Settings"] = {
//     events : [
//                 "Show_Settings_View"
//             ],
//     views :  ["Settings"],
//         }




// //道具
// _module_configs["Bag"] = {
//     events : [
//                 "Show_Bag_View"
//             ],
//     views :  ["Bag"],
// }




// //任务
// _module_configs["Task"] = {
//     events : [
//         "Show_Task_View", "Receive_Task_Reward", "Receive_Live_Reward","Show_Hall_Task_View", "Update_Task","Show_TaskNew_View","Update_New_Task",
//         "Task_DoWard_Total","Reset_SetTask","Pay_Succ","Recharge_Succ","Get_unlockGun_task","Show_GoodsAni_Task",
//         "Task_Jump", "Show_Active_Task_View", "Receive_Active_Task_Reward", "Receive_All_Active_Reward", "Show_CollectScore_Task_View",
//         "Receive_Collect_Task_Reward", "Receive_Collect_Score_Reward", "Check_Task_Red", "Show_HappyFishery_View", "Save_FisheryTask_Data", "Get_Fishery_Reward",
//         "Get_HuntTask_Reward", "Update_Nmcard_State", "Check_CollectTask_Red", "Close_All_Window", "Receive_AchieveTask_Reward", "Receive_AllAchieveTask_Reward",
//         "Receive_Achieve_Reward", "Check_HappyFishery_Red", "Show_NewYear_Task_View", "Receive_NewYear_Task_Reward", "Receive_NewYear_Score_Reward", 
//         "Check_NewYearTask_Red", "Show_Lantern_Task_View", "Receive_Lantern_Task_Reward", "Receive_Lantern_Score_Reward", "Check_LanternTask_Red",
//         "Update_Gold", "Update_Treasure", "Update_Diamond",
//     ],
//     views :  ["Task","TaskNew", "ActiveTask", "CollectScoreTask", "HappyFishery", "NewYearTask", "LanternTask"],
// }



// //Night 写在夜晚 创建房间  maybe .etc
// _module_configs["Night"] = {
// 	events : [
//                 "Show_HappyHall_View",
//                 "Get_Vip_Room_List","Enter_Vip_Room","Register_Vip_Room","Unregister_Vip_Room","Create_Vip_Room",
//                 "Update_Room_List","Show_CreateRoom_View","Show_keyBoard_View","Show_HappyHallMessage_View","Update_HappyHallVip_Data",
//                 "Update_Gold", "Update_Treasure", "Update_Diamond",
//         ],
//     views :  ["HappyHall","HappyHallCreate","HappyKeyBoard","HappyHallMessage"],
// }
// //VIP
// _module_configs["Vip"] = {
//     events : ["Vip_View_Show","Update_vip_Data", "Vip_LoginAward_View", "Vip_Level_Reward","Show_VipLogin", "ArenaFreeRank", "Request_Vip_Data",
//               "Recharge_Succ", "Quit_Game","Vip_Buy_Succ", "Check_Vip_Red",
//               "Update_Gold", "Update_Treasure", "Update_Diamond",
//                 ],
//     views :  ["Vip", "VipLogin"],
// }


//剧情
_module_configs["Story"] = {
    events : ["PLOT_STEP","LOGIN"
                ],
    views :  ["Story","StoryGuide"],
}

// //引导
// _module_configs["Guide"] = {
//     events : [
//             "Plot_view_Show", "Plot_Step"
//                 ],
//     views :  ["Guide", "Plot"],
// }


// //战斗模块
// _module_configs["Battle"] = {
//     events : [
//             "Battle_View_Show","Show_Blood","Show_Drop_Item","Update_CharRoleInfo", "Update_Gold", "Update_Equip", "Receive_Item",  "Update_Statistic",
//             "Lock_View_Show", "MapBig_View_Show", "Send_Chat_Msg", "Boss_Borth", "Show_Tombstone", "Hide_Tombstone", "Enter_Area", "Leave_Area", "Boss_Hp_Update",
//             "Role_Resurrection", "Show_Msg", "Vmg_MsgSure_View_show", "Update_Area_Lock"
//                 ],
//     views :  ["Battle", "Lock", "MapBig", "Msg"],
// }


// //登陆注册
// _module_configs["Login"] = {
//     events : [
//                "SdkLogin_View_Show","Native_View_Show", "Official_Web_View_Show", "Official_Native_Login_View_Show",
//                "Login_View_Show","Account_View_Show","GetPassword_View_Show",
//                "Fast_Register_Account","Update_Account_Pwd","Get_Login_Type","Auth_Login",
//                "Update_Login_Status","Update_Player_Status","Set_New_Password","Get_New_Password_Verify",
//                "Get_Player_Status","Get_Customer_Center","Register_Account",
//                "Quit_Game", "Reset_Login_Staute", "UpdateAssets_View_Show", "Update_Session_View",
//                "Sdk_Auth","Login_Start", "WX_Auth", "WX_Web_Auth","Official_Login_View", "QQ_Web_Auth","Test_Local_Token_Login", 
//              ],
//     views :  ["NativeLogin","SdkLogin","OfficialWebLogin","OfficialNativeLogin","Login", "Account",  "GetPassword", "UpdateAssets"],
// }

// //加载
// _module_configs["Loader"] = {
//     events : [
//             "Loader_View_Show"
//                 ],
//     views :  ["Loader"],
// }

// //角色
// _module_configs["User"] = {
//     events : [
//             "Offline_Award_View_Show", "Create_Role_View_Show", "Create_Role", "Receive_Item", "Up_Lv_Equip","Show_Drop_Item",
//             "Set_RoleInfo","Update_RoleInfo"
//                 ],
//     views :  ["OfflineAward", "CreateRole"],
// }


// //sdk
// _module_configs["Sdk"] = {
//     events : ["Sdk_Init","Sdk_Login","Sdk_Logout","Sdk_Switch_Login","Sdk_Pay","Sdk_Exit","Get_RealName",
//     "Share_Wechat","Share_Friend_Page","Install_Apk","Sdk_submit", "Sdk_Report","Sdk_Open_Service"],
//     views :  [],
// }

// //设置
// _module_configs["Setting"] = {
//     events : [
//             "Setting_View_Show"
//                 ],
//     views :  ["Setting"],
// }

// //排行榜
// _module_configs["Rank"] = {
//     events : [
//             "Rank_View_Show"
//                 ],
//     views :  ["Rank"],
// }
















































module.exports = _module_configs
 