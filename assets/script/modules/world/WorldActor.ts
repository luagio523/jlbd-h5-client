import { _decorator } from "cc"
import { BaseActor } from "../../mvc/BaseActor"
import { Notification } from "../../mvc/Notification"
import { IActionHandler } from "../../core/mvc/init"
import app from "../../App"
import { mvc } from "../../core/mvc/__private"
import WorldProxy from "./WorldProxy"
import { SLayerType, SceneManager } from "../../rpg/manager/SceneManager"
import MapManager from "../../rpg/manager/MapManager"
import { MapDisplay } from "../../rpg/map/MapDisplay"
import { EventManager } from "../../rpg/event/EventManager"
import {  EnterMapEvent, InitRoleEvent, RPGEvent } from "../../rpg/event/Event"

@mvc.component("WorldActor")
export class WorldActor extends BaseActor {
	public listInterests(): [string, IActionHandler][] {
		return [[Notification.ENTER_WORLD, this.executeEnterWorld]]
	}

	public onRegister() {
		// 注册逻辑
	}

	/*---------------------------------[notices]------------------------------------*/

	public executeEnterWorld(role:any) {
		console.log(`WorldActor enter world ${role}`)

		//load role data

		role.position = {x:100,y:100}

		app.game.getGameWorld().start()
		EventManager.getInstance().dispatchEvent(new EnterMapEvent("map004",role.position))
		EventManager.getInstance().dispatchEvent(new InitRoleEvent(1,"Thief",role.position))
	}

	/*---------------------------------[models]------------------------------------*/

	protected get worldProxy(): WorldProxy {
		return app.facade.retrieveProxy(WorldProxy.NAME) as WorldProxy
	}

	/*---------------------------------[views]------------------------------------*/
}
