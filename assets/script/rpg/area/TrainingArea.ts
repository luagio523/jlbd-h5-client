import { Vec2 } from "cc";
import { ECSEntity } from "../ecs/ECSEntity";
import { Area, AreaType } from "./Area";

export enum TrainingType {
    EXPERIENCE,
    GOLD
}

export enum SpawnPattern {
    CONTINUOUS,
    ARC,
    RESPAWN_ON_DEATH,
    BATCH   
}

export class TrainingArea extends Area {
    trainingType: TrainingType;
    spawnPattern: SpawnPattern;
    spawnInterval: number;
    maxMonsters: number;
    monsterType: string;
    lastSpawnTime: number;
    currentMonsters: ECSEntity[];

    constructor(id: string, name: string, boundaries: Vec2[], trainingType: TrainingType, spawnPattern: SpawnPattern, spawnInterval: number, maxMonsters: number, monsterType: string) {
        super(id, name, AreaType.TRAINING, boundaries);
        this.trainingType = trainingType;
        this.spawnPattern = spawnPattern;
        this.spawnInterval = spawnInterval;
        this.maxMonsters = maxMonsters;
        this.monsterType = monsterType;
        this.lastSpawnTime = 0;
        this.currentMonsters = [];
    }

    update(deltaTime: number) {
        const currentTime = Date.now();
        switch (this.spawnPattern) {
            case SpawnPattern.CONTINUOUS:
                this.handleContinuousSpawn(currentTime);
                break;
            case SpawnPattern.ARC:
                this.handleArcSpawn(currentTime);
                break;
            case SpawnPattern.RESPAWN_ON_DEATH:
                this.handleRespawnOnDeath(currentTime);
                break;
            case SpawnPattern.BATCH:
                this.handleBatchSpawn(currentTime);
                break;
        }
    }

    handleContinuousSpawn(currentTime: number) {
        if (currentTime - this.lastSpawnTime >= this.spawnInterval && this.currentMonsters.length < this.maxMonsters) {
            this.spawnMonster(this.getCenter());
            this.lastSpawnTime = currentTime;
        }
    }

    handleArcSpawn(currentTime: number) {
        if (currentTime - this.lastSpawnTime >= this.spawnInterval && this.currentMonsters.length < this.maxMonsters) {
            const angleStep = Math.PI / (this.maxMonsters - 1);
            for (let i = 0; i < this.maxMonsters; i++) {
                const angle = -Math.PI / 2 + i * angleStep;
                const spawnPosition = new Vec2(
                    this.getCenter().x + 5 * Math.cos(angle),
                    this.getCenter().y + 5 * Math.sin(angle)
                );
                this.spawnMonster(spawnPosition);
            }
            this.lastSpawnTime = currentTime;
        }
    }

    handleRespawnOnDeath(currentTime: number) {
        // this.currentMonsters = this.currentMonsters.filter(monster => monster.isAlive());
        // if (this.currentMonsters.length < this.maxMonsters) {
        //     this.spawnMonster(this.getCenter());
        //     this.lastSpawnTime = currentTime;
        // }
    }

    handleBatchSpawn(currentTime: number) {
        if (this.currentMonsters.length === 0) {
            for (let i = 0; i < this.maxMonsters; i++) {
                this.spawnMonster(this.getCenter());
            }
            this.lastSpawnTime = currentTime;
        }
    }

    spawnMonster(position: Vec2) {
        // const monster = new ECSEntity();
        // monster.addComponent('Position', { x: position.x, y: position.y });
        // monster.addComponent('Monster', { type: this.monsterType });
        // monster.addComponent('Health', { current: 100, max: 100 });
        // this.currentMonsters.push(monster);
    }

    getCenter(): Vec2 {
        let sumX = 0, sumY = 0;
        for (const point of this.boundaries) {
            sumX += point.x;
            sumY += point.y;
        }
        return new Vec2(sumX / this.boundaries.length, sumY / this.boundaries.length);
    }

    onEnter(player: ECSEntity) {
        super.onEnter(player);
        console.log(`Player entered ${this.name} training area`);
    }

    onExit(player: ECSEntity) {
        super.onExit(player);
        console.log(`Player exited ${this.name} training area`);
    }
}
