import { _decorator, Component, Node, Camera, Vec3, math } from 'cc';
const { ccclass, property } = _decorator;
const { clamp } = math;

@ccclass('DelayedFollow')
export class TrackLookAt extends Component {

    @property(Node)
    target: Node = null;

    @property
    followThreshold: number = 3.0;

    @property
    followSpeed: number = 0.1;

    @property
    minX: number = -100;

    @property
    maxX: number = 100;

    @property
    minY: number = -100;

    @property
    maxY: number = 100;

    private _camera: Camera = null;
    private _tempVec3: Vec3 = new Vec3();

    start () {
        this._camera = this.getComponent(Camera);
        if (!this._camera) {
            console.error('Camera component not found on node.');
        }
    }

    update (dt) {
        if (this.target) {
            const targetPos = this.target.worldPosition;
            const cameraPos = this.node.worldPosition;
            Vec3.subtract(this._tempVec3, targetPos, cameraPos);

              // Add this line
                // this._tempVec3.negative()//如果挂在 地图节点上 跟主角就运动相反

            if (this._tempVec3.length() > this.followThreshold) {
                this._tempVec3.normalize();
                Vec3.scaleAndAdd(this._tempVec3, cameraPos, this._tempVec3, this.followSpeed * dt);

                // Clamp camera position within boundaries
                let x = clamp(this._tempVec3.x, this.minX, this.maxX);
                let y = clamp(this._tempVec3.y, this.minY, this.maxY);
                this._tempVec3.set(x, y, this._tempVec3.z);

                this.node.setWorldPosition(this._tempVec3);
            }
        }
    }
}