import { DamageType } from "../enum/Damage";
import {  ApplyDamageEvent, Event,IEvent } from "../event/Event";
import { BaseSystem } from "./BaseSystem";

//战斗状态管理 比如回合制
export class DamageApplySystem extends BaseSystem{

    public constructor(){
        super()

        this.listenEvent(Event.ApplyDamage,this.onApplyDamage.bind(this))
    }


    public udpate(dt:number){
        let events = this.getEvents(Event.ApplyDamage)

        events.forEach(event => {
            this.onApplyDamage(event)
        });

        this.removeEvents(Event.ApplyDamage)
    }
    
    private onApplyDamage(event: IEvent){
        let damageEvent  = event as ApplyDamageEvent

        if (damageEvent.damageType == DamageType.DAMAGE_TYPE_PHYSICAL) {
            let attack = damageEvent.attacker
            let victim = damageEvent.victim
        }
        
    }

    update() {
       
    }
}