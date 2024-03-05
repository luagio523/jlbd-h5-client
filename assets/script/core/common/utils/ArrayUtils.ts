import { MathUtil } from "./MathUtil";

/**
 * 数组工具类
 */

 export class ArrayUtils {

    /**
	 * 去除数组中 相同的元素
	 */
	public static delRepeat(arr: Array<any>): Array<any> {
		let resArr: Array<any> = new Array<any>();

		for (let res of arr) {
			if (resArr.indexOf(res) == -1) {
				resArr.push(res);
			}
		}
		return resArr;
	}

     public static clone(arr: Array<any>): Array<any> {
		let res: Array<any> = new Array<any>();
		res = res.concat(arr);
		return res;
	}
     
    /**
     * 打乱数组顺序
     */
    public static Rush(arr:Array<any>, val:number) {
        let minNum = 0;
        let maxNum = arr.length - 1;
        for(let i=0; i<val; i++) {
            let index0 = MathUtil.randomRange(minNum, maxNum);
            let index1 = MathUtil.randomRange(minNum, maxNum);
            let temp = arr[index0];
            arr[index0] = arr[index1];
            arr[index1] = temp;
        }
    }

    public static swap(list:Array<any>, x, y) {
        let arr = list.slice(0);
        arr.splice(x, 1, ...arr.splice(y, 1, arr[x]))
        return arr;
    }


    public static removeItem(list:Array<any>,item:any){
        let index = list.indexOf(item)
        if(index > -1){
            list.slice(index,1)
        }
       
    }
  
 }

