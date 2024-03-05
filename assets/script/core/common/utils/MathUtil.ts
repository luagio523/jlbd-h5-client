import { Vec2, macro, v2 } from "cc"

/**
 * 数学计算工具类
 */
export  class MathUtil {

    
     // x0= (x - rx0)*cos(a) - (y - ry0)*sin(a) + rx0 ;
    // y0= (x - rx0)*sin(a) + (y - ry0)*cos(a) + ry0 ;
    //图片上任意点(x,y)，绕一个坐标点(rx0,ry0)逆时针旋转a角度后的新的坐标设为(x0, y0)
    public static getRotatePoint(x:number,y:number,rx0:number,ry0:number,radian:number){
        let x0= (x - rx0)*Math.cos(radian) - (y - ry0)*Math.sin(radian) + rx0 
        let y0= (x - rx0)*Math.sin(radian) + (y - ry0)*Math.cos(radian) + ry0
        return v2(x0,y0)
    }

    //判断介于2个数之间
     // x >min(x1,x2) x<max(x1,x2)
    public static between(x:number,x1:number,x2:number){
        if(x1 < x2){
            return x>x1 && x <x2
        }else{
            return x>x2 && x <x1
        }
    }

    //判断介于两个数之外
    // x <min(x1,x2) x>max(x1,x2)
    public static out(x:number,x1:number,x2:number){
        if(x1 < x2){
            return x<x1 || x >x2
        }else{
            return x<x2 || x >x1
        }
    }

    /**
	 * 位比较: 与 &
	 * exp>> 11100:10100==10100
	 */
	public static bit(actions, done): boolean {
		return (actions & done) == done;
	}
     
    /**
     * 弧度制转换为角度值
     * @param radian 弧度制
     * @returns {number}
     */
    public static getAngle(radian) {

        return macro.DEG*radian

        // return 180 * radian / Math.PI;
    };
    /**
     * 角度值转换为弧度制
     * @param angle
     */
    public static getRadian(angle) {
        return angle / 180 * Math.PI;
    };
    /**
     * 获取两点间弧度
     * @param p1X
     * @param p1Y
     * @param p2X
     * @param p2Y
     * @returns {number}
     */
    public static getRadian2(p1X, p1Y, p2X, p2Y) {
        var xdis = p2X - p1X;
        var ydis = p2Y - p1Y;
        return Math.atan2(ydis, xdis);
    };
    /**
     * 获取两点间距离
     * @param p1X
     * @param p1Y
     * @param p2X
     * @param p2Y
     * @returns {number}
     */
    public static getDistance(p1X, p1Y, p2X, p2Y) {
        var disX = p2X - p1X;
        var disY = p2Y - p1Y;
        var disQ = disX * disX + disY * disY;
        return Math.sqrt(disQ);
    };

    public static getDistance2(p1X, p1Y, p2X, p2Y) {
        var disX = p2X - p1X;
        var disY = p2Y - p1Y;
        var disQ = disX * disX + disY * disY;
        return disQ;
    };

    /** 角度移动点 */
    public static getDirMove(angle, distance, p?: Vec2) {
        p = p || v2();
        p.x = Math.cos(angle * Math.PI / 180) * distance;
        p.y = Math.sin(angle * Math.PI / 180) * distance;
        return p;
    };
    /**
     * 获取一个区间的随机数
     * @param $from 最小值
     * @param $end 最大值
     * @returns {number}
     */
    public static limit($from, $end) {
        $from = Math.min($from, $end);
        $end = Math.max($from, $end);
        var range = $end - $from;
        return $from + Math.random() * range;
    };
    /**
     * 获取一个区间的随机数(帧数)
     * @param $from 最小值
     * @param $end 最大值
     * @returns {number}
     */
    public static limitInteger($from, $end) {
        return Math.round(this.limit($from, $end));
    };
    /**
     * 在一个数组中随机获取一个元素
     * @param arr 数组
     * @returns {any} 随机出来的结果
     */
    public static randomArray(arr) {
        var index = Math.floor(Math.random() * arr.length);
        return arr[index];
    };

    public static Clamp(value: number, min: number, max: number): number {
        if (value < min) {
            return min
        }
        if (value > max) {
            return max
        }
        return value
    }
    
    private static RAN_SIGN = [-1, 1]

    public static GetRandomSign(): number {
        return this.RAN_SIGN[MathUtil.limitInteger(0, 1)]
    }

    //生成uuid
    public static generateUUID(len:number = 26, radix:number = 16) {
        var len = 26;
            var radix = 16;
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
          var uuid = [], i;
        radix = radix || chars.length;
         if (len) {
             // Compact form
             for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
          } else {
             // rfc4122, version 4 form
             var r;
              // rfc4122 requires these characters
             uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
             uuid[14] = '4';
              // Fill in random data. At i==19 set the high bits of clock sequence as
             // per rfc4122, sec. 4.1.5
             for (i = 0; i < 36; i++) {
                  if (!uuid[i]) {
                     r = 0 | Math.random()*16;
                     uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                  }
               }
           }
         return uuid.join('');
    }

    public static generateWord(len:number = 6){
        let nickname = [] , i , r
        let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
        for(i = 0;i< len;i++){
            r = 0 | Math.random()*16
            if(!nickname[i]){
                nickname[i] = chars[(i == 19) ? (r & 0x3) | 0x8 :  r]
            }
        }

        return nickname.join('')
    }
    



    /**
     * Returns 1 if the value is >= 0. Returns -1 if the value is < 0.
     *
     * @method sign
     * @param num {number}
     * @return {number}
     * @example
     *      MathUtil.sign(23);
     *      // 1
     *
     *      MathUtil.sign(-23);
     *      // -1
     */
    public static sign(num:number):number
    {
        if (num < 0)
        {
            return -1
        }
        return 1;
    }

    /**
     * Check if number is positive (zero is positive).
     *
     * @method isPositive
     * @param num {number} The number.
     * @return {boolean}
     * @example
     *      MathUtil.isPositive(23);
     *      // true
     *
     *      MathUtil.isPositive(-23);
     *      // false
     */
    public static isPositive(num:number):boolean
    {
        return (num >= 0);
    }

    /**
     * Check if number is negative.
     *
     * @method isNegative
     * @param num {number} The
     * @return {boolean}
     * @example
     *      MathUtil.isNegative(23);
     *      // false
     *
     *      MathUtil.isNegative(-23);
     *      // true
     */
    public static isNegative(num:number):boolean
    {
        return (num < 0);
    }

    /**
     * Check if number is odd (convert to Integer if necessary).
     *
     * @method isOdd
     * @param num {number} The number.
     * @return {boolean}
     * @example
     *      MathUtil.isOdd(2);
     *      // false
     *
     *      MathUtil.isOdd(3);
     *      // true
     */
    public static isOdd(num:number):boolean
    {
        const i:number = num;
        const e:number = 2;
        return Boolean(i % e);
    }

    /**
     * Check if number is even (convert to Integer if necessary).
     *
     * @method isEven
     * @param num {number} The number.
     * @return {boolean}
     * @example
     *      MathUtil.isEven(2);
     *      // true
     *
     *      MathUtil.isEven(3);
     *      // false
     */
    public static isEven(num:number):boolean
    {
        const int:number = num;
        const e:number = 2;
        return (int % e == 0);
    }

    /**
     * Check if number is Prime (divisible only by itself and one).
     *
     * @method isPrime
     * @param num {number} The number.
     * @return {boolean}
     * @example
     *      MathUtil.isPrime(4);
     *      // false
     *
     *      MathUtil.isPrime(5);
     *      // true
     */
    public static isPrime(num:number):boolean
    {
        if (num > 2 && num % 2 == 0)
        {
            return false;
        }
        const l:number = Math.sqrt(num);
        let i:number = 3;
        for (i; i <= l; i += 2)
        {
            if (num % i == 0)
            {
                return false;
            }
        }
        return true;
    }

    /**
     * Calculate the factorial of the integer.
     *
     * @method factorial
     * @param num {number} The number.
     * @return {number}
     * @example
     *      MathUtil.factorial(5);
     *      // 120
     *
     *      MathUtil.factorial(9);
     *      // 362880
     */
    public static factorial(num:number):number
    {
        if (num == 0)
        {
            return 1;
        }
        let d:number = <number>num.valueOf();
        let i:number = d - 1;
        while (i)
        {
            d = d * i;
            i--;
        }
        return d;
    }

    /**
     * Return an array of divisors of the integer.
     *
     * @method getDivisors
     * @param num {number} The number.
     * @return {Array.<number>}
     * @example
     *
     */
    public static getDivisors(num:number):Array<number>
    {
        const r:Array<number> = [];

        for (let i:number = 1, e:number = num / 2; i <= e; i++)
        {
            if (num % i == 0)
            {
                r.push(i);
            }
        }

        if (num != 0)
        {
            r.push(<number>num.valueOf());
        }

        return r;
    }

        /**
     * Returns a number constrained between min and max.
     *
     * @method constrain
     * @param num {number}
     * @param min {number}
     * @param  max {number}
     * @return  {number}
     * @example
     *      MathUtil.constrain(12, 3, 20);
     *      // 12
     *
     *      MathUtil.constrain(22, 3, 20);
     *      // 20
     *
     *      MathUtil.constrain(0, 3, 20);
     *      // 3
     */
    public static constrain(num:number, min:number = 0, max:number = 1):number
    {
        if (num < min)
        {
            return min;
        }
        if (num > max)
        {
            return max;
        }
        return num;
    }


    /**
     * Returns a random number between min and max.
     *
     * @method randomRange
     * @param min {number}
     * @param max {number}
     * @param [wholeNumber=true] {number}
     * @return {number}
     * @example
     *
     */
    public static randomRange(min:number, max:number, wholeNumber:boolean = true):number
    {
        const num:number = (min + Math.random() * (max - min));

        if (wholeNumber)
        {
            return Math.round(num);
        }
        return num;
    }


    /**
     * Returns the percentage of a number in a given range.
     * Example: num = 15 range 10 to 20 // outputs 0.5
     *
     * @method rangeToPercent
     * @param num {number}
     * @param min {number}
     * @param max {number}
     * @param constrainMin {boolean}        Returns 0 if num < min.
     * @param constrainMax {boolean}        Returns 1 if num > max.
     * @return {number}
     * @example
     *      MathUtil.rangeToPercent(15, 10, 20);
     *      // 0.5
     */
    public static rangeToPercent(num:number, min:number, max:number, constrainMin:boolean = false, constrainMax:boolean = false):number
    {
        if (constrainMin && num < min)
        {
            return 0;
        }
        if (constrainMax && num > max)
        {
            return 1;
        }
        return (num - min) / (max - min);
    }


    /**
     * Returns the number that corresponds to the percentage in a given range.
     * Example: percent = 0.5 range 10 to 20 // outputs 15
     *
     * @method percentToRange
     * @param percent {number}
     * @param min {number}
     * @param max {number}
     * @return {number}
     * @example
     *      MathUtil.percentToRange(0.5, 10, 20);
     *      // 15
     */
    public static percentToRange(percent:number, min:number, max:number):number
    {
        return (percent * (max - min)) + min;
    }

    
}