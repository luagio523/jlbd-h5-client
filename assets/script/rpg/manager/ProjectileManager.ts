import { Vec2 } from "cc";
import { CreateLinearProjectileOptions, CreateTrackingProjectileOptions, LinearProjectile, Projectile, ProjectileID, TrackingProjectile } from "../base/Projectile";

//设置拖尾
// const motionStreak = projectile.addComponent(MotionStreak);
        
// // 设置MotionStreak的属性
// motionStreak.texture = this.TrailTexture;
// motionStreak.fadeTime = 1;
// motionStreak.minSeg = 1;
// motionStreak.stroke = 0.1;
// motionStreak.color = color(255,255,255);


export class ProjectileManager {
    private static instance: ProjectileManager;
    private projectileMap: { [id: number]: Projectile } = {};
    private projectileIDCounter: number = 0;

    private constructor() {}

    public static getInstance(): ProjectileManager {
        if (!ProjectileManager.instance) {
            ProjectileManager.instance = new ProjectileManager();
        }
        return ProjectileManager.instance;
    }

    private genProjectileID(): number {
        this.projectileIDCounter += 1;
        return this.projectileIDCounter;
    }

    public CreateLinearProjectile(options: CreateLinearProjectileOptions): ProjectileID {
        const projectile = new LinearProjectile(options);
        let projectileID = this.genProjectileID();
        projectile.projectileID = projectileID;
        this.projectileMap[projectileID] = projectile;

        projectile.onProjectileEnd = (projectile: Projectile) => {
            this.DestroyLinearProjectile(projectile.projectileID);
        };

        return projectileID;
    }

    public CreateTrackingProjectile(options: CreateTrackingProjectileOptions): ProjectileID {
        const projectile = new TrackingProjectile(options);
       
        let projectileID = this.genProjectileID();
        projectile.projectileID = projectileID;
        this.projectileMap[projectileID] = projectile;

        projectile.onProjectileEnd = (projectile: Projectile) => {
            this.DestroyLinearProjectile(projectile.projectileID);
        };

        return projectileID;
    }

    public DestroyLinearProjectile(projectileID: ProjectileID): void {
        delete this.projectileMap[projectileID];
    }

    public DestroyTrackingProjectile(projectileID: ProjectileID): void {
        delete this.projectileMap[projectileID];
    }

    public GetLinearProjectileLocation(projectileID: ProjectileID): Vec2 {
        let projectile = this.projectileMap[projectileID];
        return projectile.position;
    }

    public GetLinearProjectileRadius(projectile: ProjectileID): number {
        return 0;
    }

    public GetLinearProjectileVelocity(projectileID: ProjectileID): Vec2 {
        let projectile = this.projectileMap[projectileID];
        return projectile.velocity;
    }

    public GetTrackingProjectileLocation(projectileID: ProjectileID): Vec2 {
        let projectile = this.projectileMap[projectileID];
        return projectile.position;
    }

    public IsValidProjectile(value: number): boolean {
        let projectile = this.projectileMap[value];
        return projectile != null;
    }

    public UpdateLinearProjectileDirection(projectileID: ProjectileID, direction: Vec2, speed: number): void {
        let projectile = this.projectileMap[projectileID] as LinearProjectile;
        projectile.UpdateDirection(direction, speed);
    }
}
