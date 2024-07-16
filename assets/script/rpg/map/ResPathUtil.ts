
export class ResPathUtil {
	public static DEFAULT_SHADOW = "images/shadow/1";
	public static ANIM_PATH =  "anim/" // 角色躯体

    // 获取地图资源路径
	public static GetTileImagePath(name: string, x: number, y: number): string {
		return "map/" + name + "/image/" + y + "_" + x + ".jpg";
	}

	public static GetMapThumbnailPath(name: string) {
		return "map/" + name + "/small";
	}

	public static GetMapMiniPath(name: string) {
		return "map/" + name + "/pk_preview.jpg";
	}
	
	public static GetMap(mapId:string){
		return "map/"+mapId+"/"+mapId

		// return "map/"+mapId+"/"+mapId+".tmx"
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
	
		



}