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




     /**
     * 数组去重，并创建一个新数组返回
     * @param arr  源数组
     */
     static noRepeated(arr: any[]) {
        var res = [arr[0]];
        for (var i = 1; i < arr.length; i++) {
            var repeat = false;
            for (var j = 0; j < res.length; j++) {
                if (arr[i] == res[j]) {
                    repeat = true;
                    break;
                }
            }

            if (!repeat) {
                res.push(arr[i]);
            }
        }
        return res;
    }

    /**
     * 复制二维数组
     * @param array 目标数组 
     */
    static copy2DArray(array: any[][]): any[][] {
        let newArray: any[][] = [];
        for (let i = 0; i < array.length; i++) {
            newArray.push(array[i].concat());
        }
        return newArray;
    }

    /**
     * Fisher-Yates Shuffle 随机置乱算法
     * @param array 目标数组
     */
    static fisherYatesShuffle(array: any[]): any[] {
        let count = array.length;
        while (count) {
            let index = Math.floor(Math.random() * count--);
            let temp = array[count];
            array[count] = array[index];
            array[index] = temp;
        }
        return array;
    }

    /**
     * 混淆数组
     * @param array 目标数组
     */
    static confound(array: []): any[] {
        let result = array.slice().sort(() => Math.random() - .5);
        return result;
    }

    /**
     * 数组扁平化
     * @param array 目标数组
     */
    static flattening(array: any[]) {
        for (; array.some(v => Array.isArray(v));) {    // 判断 array 中是否有数组
            array = [].concat.apply([], array); // 压扁数组
        }
        return array;
    }

    /** 删除数组中指定项 */
    public static removeItem(list: Array<any>, item: any) {
        let index = list.indexOf(item);
        if (index > -1) {
            list.splice(index, 1);
        }
    }

    /**
     * 合并数组
     * @param array1 目标数组1
     * @param array2 目标数组2
     */
    static combineArrays(array1: any[], array2: any[]): any[] {
        let newArray = [...array1, ...array2];
        return newArray;
    }

    /**
     * 获取随机数组成员
     * @param array 目标数组
     */
    static getRandomValueInArray(array: any[]): any {
        let newArray = array[Math.floor(Math.random() * array.length)];
        return newArray;
    }
  
 }

