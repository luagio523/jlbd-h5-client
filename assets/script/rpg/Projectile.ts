import { _decorator,  Vec3,bezierByTime   } from 'cc';
import { UnitTargetFlags, UnitTargetTeam, UnitTargetType } from './Type';
import { BaseAbility } from './BaseAbility';
const { ccclass, property } = _decorator;

export class CreateBaseProjectileOptions {
    EffectName?: string;
    Ability?: BaseAbility;
    Source?: any;//CDOTA_BaseNPC

    bProvidesVision?: boolean;
    iVisionRadius?: number;
    iVisionTeamNumber?: UnitTargetTeam;


    bCurze?:boolean; //是否是曲线
    curzeControlPoints?:Array<Vec3>;//适用于曲线
    curzeTime?:number  //曲线运动的时间


    bDrawsOnMinimap?: boolean;
    bVisibleToEnemies?: boolean;

    ExtraData?: object;
}


export class CreateLinearProjectileOptions extends CreateBaseProjectileOptions {
    vSpawnOrigin: Vec3; //起始点
    vTargetLoc:Vec3  //目标点，用于确定方向
    
    vAcceleration?: Vec3; //加速度
    iMoveSpeed?: number; //初始速度
    fMaxSpeed?: number; //最大速度

    fDistance?: number; //直线距离
    fExpireTime?: number; //超时时间

    fStartRadius?: number; //起始半径
    fEndRadius?: number; //结束半径
   
    iUnitTargetTeam?: UnitTargetTeam;
    iUnitTargetFlags?: UnitTargetFlags;
    iUnitTargetType?: UnitTargetType;

    bIgnoreSource?: boolean;
    bHasFrontalCone?: boolean; //扇形检测
    
}

export class CreateTrackingProjectileOptions extends CreateBaseProjectileOptions {
    vSourceLoc?: Vec3;
    vTarget?:any
    iMoveSpeed?: number;
    flExpireTime?: number;
    bDodgeable?: boolean;
    bIsAttack?: boolean;
  
    bReplaceExisting?: boolean;
    bIgnoreObstructions?: boolean;
    bSuppressTargetCheck?: boolean;
   
}



export class Projectile {
    protected _options:CreateBaseProjectileOptions
    public position: Vec3 //当前位置
    public velocity: Vec3 //当前速度
    protected elapsedTime: number //已经过去的时间
    protected distance: number //已经走的距离
    protected maxSpeedSqr: number//最大速度平方
    protected isMaxSpeed:boolean //是否是极限速度

    protected totalCurveDistance:number //曲线距离
    protected curveDistance:number //当前曲线距离

    protected onProjectileFlying:()=>{}
    protected onProjectileEnd:()=>{}

    public constructor(options :CreateBaseProjectileOptions){
        this._options = options
        this.velocity = Vec3.ZERO
    }
    public get options():CreateBaseProjectileOptions{
        return this._options 
    }


    // 计算点到线段的最短距离的函数
    public pointToLineDistance(A, B, P) {
        // 构建线段向量和点向量
        let AB = Vec3.subtract(new Vec3(), B, A);
        let AP = Vec3.subtract(new Vec3(), P, A);
    
        // 计算投影长度t的系数
        let ABAPproduct = Vec3.dot(AP, AB);
        let magnitudeAB = AB.lengthSqr(); // AB向量的长度平方
        let t = ABAPproduct / magnitudeAB;
    
        // 限制t的值位于0和1之间，确保投影点在线段A和B之间
        t = Math.max(0, Math.min(1, t));
    
        // 计算投影点的坐标
        let projection = Vec3.add(new Vec3(), A, AB.multiplyScalar(t));
    
        // 计算投影点到点P的距离
        let distance = Vec3.distance(projection, P);
    
        return distance;
    }
}


export class LinearProjectile extends Projectile{

    protected hitRadius:number
    
    protected onProjectile:(radius:number)=>{}

    lerp(start: number, end: number, t: number): number {
        return start + (end - start) * t;
    }

    constructor(options: CreateLinearProjectileOptions) {
        super(options)
        if (options.fMaxSpeed) {
            this.maxSpeedSqr = options.fMaxSpeed * options.fMaxSpeed;
        }
        if(options.iMoveSpeed){
            this.velocity = options.vTargetLoc.subtract(options.vSpawnOrigin).multiplyScalar(options.iMoveSpeed)
        }
        if(options.bCurze){ //是曲线
            if(options.curzeControlPoints.length<1 || options.curzeControlPoints.length>2){
                throw new Error("bezier controlPoints should be (1 or 2) point")
            }
            if(options.curzeTime ==0){
                this.totalCurveDistance = this.CalculeteEstimateCurveLength()
            }
        }

        if(options.fStartRadius){
            this.hitRadius = options.fStartRadius
        }
        
    }

    protected calculateRadius(t:number){
        let options = this.options
        if(options.fStartRadius != options.fEndRadius){//会变化
            this.hitRadius = this.lerp(options.fStartRadius,options.fEndRadius,t)
        }
    }

    protected calculateVelocity(dt:number){
        if(this.isMaxSpeed){
            return 
        }
        let acceleration = this.options.vAcceleration
        if (acceleration) { //处理加速度
            let accEffect = acceleration.multiplyScalar(dt);
            this.velocity.add(accEffect);
            // 如果超过最大速度，重置为最大速度
            if (this.maxSpeedSqr!=0 && this.velocity.lengthSqr() > this.maxSpeedSqr) {
                this.velocity = this.velocity.normalize().multiplyScalar(this.options.fMaxSpeed);
                this.isMaxSpeed = true
            }
        }
    }

    public get options():CreateLinearProjectileOptions{
        return this.options as CreateLinearProjectileOptions
    }

    update(dt: number) {
        // 更新已经过去的时间
        this.elapsedTime += dt;

        this.calculateVelocity(dt) //计算当前速度

        let bCurze = this.options.bCurze
 
        let ratio = 0 //变化进度

        if(bCurze){ //如果是曲线
            
            if(this.options.curzeTime !=0){ //已经设定了曲线时间
                ratio = this.elapsedTime/this.options.curzeTime
                this.position = this.getBezierPosition(ratio)
            }else{ //性能最差
                ratio = this.curveDistance/this.totalCurveDistance
                this.position = this.getBezierPosition(ratio)
            }
        }else{
            let displacement = this.velocity.multiplyScalar(dt);//计算当前时间段的加速度效应
            this.position.add(displacement); // 通过速度计算位置变化
            this.distance = Vec3.distance(this.position, this.getSourcePosition())
            ratio = this.distance/this.options.fDistance
        }

        if(this.elapsedTime > this.options.fExpireTime){
            if(this.onProjectileEnd){
                this.onProjectileEnd()
            }
            return 
        }

        if (ratio > 1) { //进度大于1了说明已经达到
            if(this.onProjectileEnd){
                this.onProjectileEnd()
            }
            return 
        }
        
        this.calculateRadius(ratio) //计算当前碰撞半径
        if(this.onProjectileFlying){
            this.onProjectileFlying()
        }
        //搜寻碰撞的逻辑
    }

    //计算curve长度
    public CalculeteEstimateCurveLength(): number {
        let totalLength = 0;
        let steps = 10; // 分割的段数，可根据需要调整以获得更高的精度
        let t = 0;
        let lastPosition = this.getBezierPosition(t);
        let newPosition:Vec3;
        for (let i = 1; i <= steps; i++) {
            t = i / steps;
            newPosition = this.getBezierPosition(t);
            totalLength += Vec3.distance(lastPosition, newPosition);
            lastPosition = newPosition;
        }
        return totalLength;
    }

    public UpdateDirection(direction: Vec3, speed: number){
        this.velocity = direction.multiplyScalar(speed)
    }

    //获取目标位置
    protected getTargetPosition():Vec3{
        return this.options.vTargetLoc
    }
    //获取起始位置
    protected getSourcePosition():Vec3{
        return this.options.vSpawnOrigin
    }

    protected getLerpT(speed:number):number{
        let t = this.elapsedTime / (this.distance/speed);
        if (t > 1) {
            t = 1;
        }
        return t 
    }

    protected getBezierPosition(t:number):Vec3{
        let controlPoints = this.options.curzeControlPoints
        if(controlPoints.length == 1){
            this.position = this.calculateBezierPoint2(t, this.getSourcePosition(), controlPoints[0], this.getTargetPosition());
        }else{
            this.position = this.calculateBezierPoint3(t, this.getSourcePosition(), controlPoints[0],controlPoints[1], this.getTargetPosition());
        }
        return this.position
    }

    calculateBezierPoint2(t: number, p0: Vec3, p1: Vec3, p2: Vec3): Vec3 {
        const oneMinusT = 1 - t;
        return p0.multiplyScalar(oneMinusT * oneMinusT)
            .add(p1.multiplyScalar(2 * oneMinusT * t))
            .add(p2.multiplyScalar(t * t));
    }

    calculateBezierPoint3(t: number, p0: Vec3, p1: Vec3, p2: Vec3, p3: Vec3): Vec3 {
        const oneMinusT = 1 - t;
        return p0.multiplyScalar(oneMinusT * oneMinusT * oneMinusT)
            .add(p1.multiplyScalar(3 * oneMinusT * oneMinusT * t))
            .add(p2.multiplyScalar(3 * oneMinusT * t * t))
            .add(p3.multiplyScalar(t * t * t));
    }

        // 二次贝塞尔曲线计算函数
    bezier2(p0:number, p1:number, p2:number, t:number) {
        const oneMinusT = 1 - t;
        return oneMinusT * oneMinusT * p0
            + 2 * oneMinusT * t * p1
            + t * t * p2;
    }

    //三次贝塞尔曲线计算函数
    bezier3(p0:number, p1:number, p2:number, p3:number, t:number) {
        const oneMinusT = 1 - t;
        return oneMinusT * oneMinusT * oneMinusT * p0
            + 3 * oneMinusT * oneMinusT * t * p1
            + 3 * oneMinusT * t * t * p2
            + t * t * t * p3;
    }

    endProjectile() {
        // 结束投射物，触发相关事件
    }
}






export class TrackingProjectile extends LinearProjectile {
    protected target: any;  // 追踪的目标
    protected isDodgeable: boolean;
    protected isAttack: boolean;
    protected moveSpeed:number

    constructor(options: CreateTrackingProjectileOptions) {
        super(options);
        this.target = options.vTarget;
        this.isDodgeable = options.bDodgeable ?? false;
        this.isAttack = options.bIsAttack ?? false;
        this.expireTime = options.flExpireTime ?? 0; // 设置过期时间，0表示永不过期

        // 如果有设置，应用最大速度平方
        if (this.maxSpeed) {
            this.maxSpeedSqr = this.maxSpeed * this.maxSpeed;
        }
    }

    update(dt: number) {
        // 在调用基类的更新处理之前，更新速度向量指向目标
        if (this.target !== undefined) {
            // 这里需要一个方法来获取目标的当前位置
            const targetPos = this.getTargetPosition();
            // 更新速度方向
            const toTarget = targetPos.subtract(this.position).normalize();
            this.velocity = toTarget.multiplyScalar(this.moveSpeed);
        }

        if(this.controlPoints){//有控制点 说明是弧线，bezier
            let speed = this.velocity.length()
            this.position = this.getBezierPosition(this.target,speed)
        }else{
                // 计算当前时间段的加速度效应
            // 通过速度计算位置变化
            let displacement = this.velocity.multiplyScalar(dt);
            this.position.add(displacement);
        }
        
        // 更新已经过去的时间
        this.elapsedTime += dt;

        // 当超过最大距离或者超过过期时间时，结束投射物
        if (Vec3.distance(this.position, this.getSourcePosition()) > this.distance || this.elapsedTime > this.expireTime) {
            this.endProjectile();
        }

        
    }

    getTargetPosition(): Vec3 {
        return this.target.position;
    }

    
}





// export class Example extends Component {

//     @property(Node)
//     targetNode: Node | null = null;

//     start() {
//         if (this.targetNode) {
//             // 贝塞尔曲线控制点
//             const startPoint = new Vec3(0, 0, 0);
//             const controlPoints1 = new Vec3(100, 200, 0);
//             const controlPoints2 = new Vec3(200, -100, 0);
//             const endPoint = new Vec3(300, 0, 0);

//             tween(this.targetNode)
//                 .to(3, { position: endPoint }, {
//                     easing: 'quadInOut', // 缓动效果
//                     onUpdate: (target, ratio) => {
//                         //计算贝塞尔曲线当前点位置
//                         const x = this.bezier3(startPoint.x, controlPoints1.x, controlPoints2.x, endPoint.x, ratio);
//                         const y = this.bezier3(startPoint.y, controlPoints1.y, controlPoints2.y, endPoint.y, ratio);
                        
//                         // 更新节点位置
//                         this.targetNode!.setPosition(x, y, 0);
//                     }
//                 })
//                 .start();
//         }
//     }


//     // 二次贝塞尔曲线计算函数
//     bezier2(p0:number, p1:number, p2:number, t:number) {
//         const oneMinusT = 1 - t;
//         return oneMinusT * oneMinusT * p0
//             + 2 * oneMinusT * t * p1
//             + t * t * p2;
//     }

//     //三次贝塞尔曲线计算函数
//     bezier3(p0:number, p1:number, p2:number, p3:number, t:number) {
//         const oneMinusT = 1 - t;
//         return oneMinusT * oneMinusT * oneMinusT * p0
//             + 3 * oneMinusT * oneMinusT * t * p1
//             + 3 * oneMinusT * t * t * p2
//             + t * t * t * p3;
//     }

//      // 使用三个点计算二次贝塞尔曲线上的点
//     //  const position = this.bezier(startPoint, controlPoints, endPoint, ratio);
//     // 二次贝塞尔曲线计算函数，使用 Vec3
//     bezierV2(p0: Vec3, p1: Vec3, p2: Vec3, t: number): Vec3 {
//         const q0 = Vec3.lerp(new Vec3(), p0, p1, t);
//         const q1 = Vec3.lerp(new Vec3(), p1, p2, t);
//         return Vec3.lerp(new Vec3(), q0, q1, t);
//     }

//     // 三次贝塞尔曲线计算函数，使用 Vec3
//     //const position = this.bezier(startPoint, controlPoints1,controlPoints2, endPoint, ratio);
//     bezierV3(p0: Vec3, p1: Vec3, p2: Vec3, p3: Vec3, t: number): Vec3 {
//         // 第一层插值
//         const q0 = Vec3.lerp(new Vec3(), p0, p1, t);
//         const q1 = Vec3.lerp(new Vec3(), p1, p2, t);
//         const q2 = Vec3.lerp(new Vec3(), p2, p3, t);
//         // 第二层插值
//         const r0 = Vec3.lerp(new Vec3(), q0, q1, t);
//         const r1 = Vec3.lerp(new Vec3(), q1, q2, t);
//         // 最终插值得到曲线上的点
//         return Vec3.lerp(new Vec3(), r0, r1, t);
//     }
// }




