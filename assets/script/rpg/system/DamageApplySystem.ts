import { CombatCalculator } from "../CombatCalculator";
import { AttackComponent } from "../component/AttackComponent";
import { AttributeComponent } from "../component/AttributeComponent";
import { BuffComponent } from "../component/BuffComponent";
import { DefenseComponent } from "../component/DefenseComponent";
import { EquipmentComponent } from "../component/EquipmentComponent";
import { HealthComponent } from "../component/HealthComponent";
import { ECSEntity } from "../ecs/ECSEntity";
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
            let victim = damageEvent.victim
            let damage = damageEvent.damage * this.calculateArmorMultiplier(victim)
            this.handleHealth(victim,damage)
        }
        
    }

    //处理生命值
    handleHealth(entity: ECSEntity,damage:number):void{
        const health = entity.getComponent(HealthComponent);
        if (!health.isInvulnerable && !health.isDead) {
            health.currentHealth -= damage;
            if (health.currentHealth <= 0) {
                this.handleDeath(entity);
            }
        }
    }

    // 该方法处理实体的死亡逻辑
    handleDeath(entity: ECSEntity) {
        const health = entity.getComponent(HealthComponent);
        health.isDead = true;
        health.currentHealth = 0;
        // 执行死亡逻辑，比如播放动画、发出通知等
    }


    //计算护甲系数
    private calculateArmorMultiplier(target:ECSEntity):number{
        let defenceComponent =target.getComponent(DefenseComponent)
        let attributeComponent = target.getComponent(AttributeComponent)
        let equipmentComponent = target.getComponent(EquipmentComponent)
        let buffComponent = target.getComponent(BuffComponent)
        let armorMultiplier = CombatCalculator.calculateArmorMultiplier(defenceComponent,attributeComponent,equipmentComponent,buffComponent)
        return armorMultiplier
    }

   
}