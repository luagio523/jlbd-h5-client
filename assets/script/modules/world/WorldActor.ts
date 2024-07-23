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
import { EventManager } from "../../rpg/event/EventListenerManager"
import {  RPGEvent } from "../../rpg/event/Event"

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

		SceneManager.getInstance().initialize(app.game.getGameRoot());//初始化场景

		let display = new MapDisplay();
		SceneManager.getInstance().addToLayer(SLayerType.Map,display);

        MapManager.getInstance().initMapDisplay(display);

        MapManager.getInstance().enterMap("map004");

        EventManager.getInstance().registerListener(RPGEvent.EnterMap, function (event) {
            console.log("enter map", event);     
        });
	}

	/*---------------------------------[models]------------------------------------*/

	protected get worldProxy(): WorldProxy {
		return app.facade.retrieveProxy(WorldProxy.NAME) as WorldProxy
	}

	/*---------------------------------[views]------------------------------------*/
}
