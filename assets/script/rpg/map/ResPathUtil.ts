
export class ResPathUtil {
	public static DEFAULT_SHADOW = "images/shadow/1";


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




}