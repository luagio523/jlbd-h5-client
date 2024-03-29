
export class ResPathUtil {
	public static DEFAULT_SHADOW = "images/shadow/1";
	public static ANIM_PATH =  "anim/" // 角色躯体

    // 获取地图资源路径
	public static GetTileImagePath(name: string, x: number, y: number): string {
		return "map/" + name + "/image/" + y + "_" + x + ".jpg";
	}

	public static GetMapThumbnailPath(name: string) {
		return "map/" + name + "/small.jpg";
	}

	public static GetMapMiniPath(name: string) {
		return "map/" + name + "/pk_preview.jpg";
	}
	
	public static GetMap(mapId:string){
		return "map/"+mapId+"/"+mapId+".tmx"
	}




		/**
	 * 获取技能特效
	 * @param effName 
	 * @returns 
	 */
		public static GetSkillEffPath(effName: string = ""): string {
			return ResPathUtil.ANIM_PATH + "skillEff/" + effName 
		}
	
		/**
		 * 获取ui特效
		 * @param effeName 
		 * @returns 
		 */
		public static GetUIEffPath(effeName: string = ""): string {
			return ResPathUtil.ANIM_PATH + "eff/" + effeName
		}
	
	
		/**
		 * 获取龙骨身体
		 * @param name 
		 * @returns 
		 */
		public static GetDragonBodyPath(name:string){
			return ResPathUtil.ANIM_PATH + "dragonbody/" + name
		}
	
		/**
		 * 获取序列帧身体
		 * @param name 
		 * @returns 
		 */
		 public static GetBodyPath(name:string){
			return ResPathUtil.ANIM_PATH + "body/" + name
		}
	
		/**
		 * 获取动画
		 * @param skinId 
		 */
		public static GetBodyAnimId(configId:number,action:ActType = ActType.ACT_STAND):string{
			let actionID:number;
			switch(action) {
				case ActType.ACT_ATTACK: actionID = 1; break;
				case ActType.ACT_CAST: actionID = 2; break;
				case ActType.ACT_STAND: actionID = 3; break;
				case ActType.ACT_RUN: actionID = 4; break;
				case ActType.ACT_DEATH: actionID = 5; break;
				case ActType.ACT_JUMP: actionID = 6; break;
				default: actionID = 3; break;
			}
			return tostring(actionID * 1000 + configId);
		}
	



}