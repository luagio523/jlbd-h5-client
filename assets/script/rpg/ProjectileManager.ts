import { Vec2, Vec3 } from "cc";
import { BaseAbility } from "./BaseAbility";
import { UnitTargetTeam } from "./Type";
import { CreateLinearProjectileOptions, CreateTrackingProjectileOptions, LinearProjectile, Projectile, TrackingProjectile } from "./Projectile";

type ProjectileID = number



export class ProjectileManager {

    protected projectileMap:{[id:number]:Projectile}
    private projectileIDCounter: number = 0;
    private genProjectileID(): number {
        this.projectileIDCounter += 1;
        return this.projectileIDCounter
    }

        /**
     * Creates a linear projectile and returns the projectile ID.
     */
    public CreateLinearProjectile(options: CreateLinearProjectileOptions): ProjectileID{
        const projectile = new LinearProjectile(options)
        let projectileID = this.genProjectileID()
        this.projectileMap[projectileID] = projectile
        return projectileID
    }
    

    /**
     * Creates a tracking projectile.
     */
    CreateTrackingProjectile(options: CreateTrackingProjectileOptions): ProjectileID{
        const projectile = new TrackingProjectile(options)
        let projectileID = this.genProjectileID()
        this.projectileMap[projectileID] = projectile
        return projectileID
    }


     /**
     * Destroys the linear projectile matching the argument ID.
     */
    public DestroyLinearProjectile(projectileID: ProjectileID): void{
        delete this.projectileMap[projectileID]
    }
     /**
      * Destroy a tracking projectile early.
      */
    public DestroyTrackingProjectile(projectileID: ProjectileID): void{
        delete this.projectileMap[projectileID]
    }
     /**
      * Returns current location of projectile.
      */
    public GetLinearProjectileLocation(projectileID: ProjectileID): Vec3{
        let projectile = this.projectileMap[projectileID]
        return projectile.position
    }
     /**
      * Returns current radius of projectile.
      */
    public GetLinearProjectileRadius(projectile: ProjectileID): number{
        return 0 
    }
     /**
      * Returns a vector representing the current velocity of the projectile.
      */
    public GetLinearProjectileVelocity(projectileID: ProjectileID): Vec3{
        let projectile = this.projectileMap[projectileID]
        return projectile.velocity
    }
     /**
      * Returns current location of projectile.
      */
    public GetTrackingProjectileLocation(projectileID: ProjectileID): Vec3{
        let projectile = this.projectileMap[projectileID]
        return projectile.position
    }
     /**
      * Is this a valid projectile?
      */
    public IsValidProjectile(value: number):boolean{
        let projectile = this.projectileMap[value]
        return projectile!=null 
    }
    
    public UpdateLinearProjectileDirection(projectileID: ProjectileID, direction: Vec3, speed: number): void{
        let projectile = this.projectileMap[projectileID] as LinearProjectile
        projectile.UpdateDirection(direction,speed)
    }
}

