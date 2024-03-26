import { Vec2 } from "cc";
import { CreateLinearProjectileOptions, CreateTrackingProjectileOptions, LinearProjectile, Projectile, ProjectileID, TrackingProjectile } from "../base/Projectile";





export class ProjectileManager {

    private static projectileMap: { [id: number]: Projectile }
    private static projectileIDCounter: number = 0;
    private static genProjectileID(): number {
        this.projectileIDCounter += 1;
        return this.projectileIDCounter
    }

    /**
 * Creates a linear projectile and returns the projectile ID.
 */
    public static CreateLinearProjectile(options: CreateLinearProjectileOptions): ProjectileID {
        const projectile = new LinearProjectile(options)
        let projectileID = this.genProjectileID()
        projectile.projectileID = projectileID
        this.projectileMap[projectileID] = projectile

        projectile.onProjectileEnd = (projectile:Projectile)=>{
            this.DestroyLinearProjectile(projectile.projectileID)
        }

        return projectileID
    }


    /**
     * Creates a tracking projectile.
     */
    public static CreateTrackingProjectile(options: CreateTrackingProjectileOptions): ProjectileID {
        const projectile = new TrackingProjectile(options)
       
        let projectileID = this.genProjectileID()
        projectile.projectileID = projectileID
        this.projectileMap[projectileID] = projectile

        projectile.onProjectileEnd = (projectile:Projectile)=>{
            this.DestroyLinearProjectile(projectile.projectileID)
        }

        return projectileID
    }


    /**
    * Destroys the linear projectile matching the argument ID.
    */
    public static DestroyLinearProjectile(projectileID: ProjectileID): void {
        delete this.projectileMap[projectileID]
    }
    /**
     * Destroy a tracking projectile early.
     */
    public static DestroyTrackingProjectile(projectileID: ProjectileID): void {
        delete this.projectileMap[projectileID]
    }
    /**
     * Returns current location of projectile.
     */
    public static GetLinearProjectileLocation(projectileID: ProjectileID): Vec2 {
        let projectile = this.projectileMap[projectileID]
        return projectile.position
    }
    /**
     * Returns current radius of projectile.
     */
    public static GetLinearProjectileRadius(projectile: ProjectileID): number {
        return 0
    }
    /**
     * Returns a vector representing the current velocity of the projectile.
     */
    public static GetLinearProjectileVelocity(projectileID: ProjectileID): Vec2 {
        let projectile = this.projectileMap[projectileID]
        return projectile.velocity
    }
    /**
     * Returns current location of projectile.
     */
    public static GetTrackingProjectileLocation(projectileID: ProjectileID): Vec2 {
        let projectile = this.projectileMap[projectileID]
        return projectile.position
    }
    /**
     * Is this a valid projectile?
     */
    public static IsValidProjectile(value: number): boolean {
        let projectile = this.projectileMap[value]
        return projectile != null
    }

    public static UpdateLinearProjectileDirection(projectileID: ProjectileID, direction: Vec2, speed: number): void {
        let projectile = this.projectileMap[projectileID] as LinearProjectile
        projectile.UpdateDirection(direction, speed)
    }
}

