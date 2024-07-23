import { Vec3, tween, Tween } from 'cc';
import { CameraController } from './CameraController';

/**
 * 基于地图相机控制
 * 提供一个场景巡视
 */
export class SceneTour {
    private cameraController: CameraController;
    private waypoints: Vec3[];
    private currentTween: Tween<Vec3> | null = null;

    constructor(cameraController: CameraController) {
        this.cameraController = cameraController;
        this.waypoints = [];
    }

    public setWaypoints(waypoints: Vec3[]): void {
        this.waypoints = waypoints;
    }

    public startTour(duration: number, onComplete?: () => void): void {
        if (this.waypoints.length < 2) {
            console.error("Need at least 2 waypoints for a tour");
            return;
        }

        this.stopTour();

        const segmentDuration = duration / (this.waypoints.length - 1);
        let currentPosition = this.cameraController.node.worldPosition;

        const tweenSequence = tween(currentPosition);

        for (let i = 0; i < this.waypoints.length; i++) {
            tweenSequence.to(segmentDuration, this.waypoints[i], {
                easing: 'smooth',
                onUpdate: (target: Vec3) => {
                    this.cameraController.setTargetPosition(target);
                }
            });
        }

        if (onComplete) {
            tweenSequence.call(onComplete);
        }

        this.currentTween = tweenSequence.start();
    }

    public stopTour(): void {
        if (this.currentTween) {
            this.currentTween.stop();
            this.currentTween = null;
        }
    }
}
