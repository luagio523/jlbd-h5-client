
let UNIT_SIZE = 32
let COLUMN = 6
let COLUMN_REC = 1/COLUMN
let ROW = 3

/**
 * 通过ID 获取 行列
 * @param id 
 * @returns 
 */
function GetGridRC(id){
    let col = (id-1) % COLUMN + 1
    let row = Math.ceil(id * COLUMN_REC)
    return [row, col]
}
   
/**
 * 根据行列获取id
 * @param row 
 * @param col 
 * @returns 
 */
function GetGridID(row, col){
    return (row - 1) * COLUMN + col
}
    
/**
 * 根据id获取格子所在像素
 * @param row 
 * @param col 
 * @returns 
 */
function GetGridPixel(id){
    let rc = GetGridRC(id)
    let row = rc[0]
    let col = rc[1]
    return [(col-1)*UNIT_SIZE, (row-1)*UNIT_SIZE]
}


class GridArray {
    private data_:any
    private index_:any
    private length_:number

    public constructor(){
        this.init()
    }

    public init(){
        this.data_ = []
        this.index_ = {}
        this.length_ = 0
    }


    public append(node){

        if (this.exist(node)){
            this.remove(node)
        } 

        let index = this.index_[node]
        let last = this.data_[this.length_]
        if (index && last){
            this.data_[index] = last
            this.index_[last] = index
        } 
        this.data_[this.length_] = node
        this.index_[node] = this.length_

        this.length_ = this.length_ + 1

    }
        

    public exist(node){
        let index = this.index_[node]

        if(index == null)  {
            return false 
        }

        if(index >= this.length_ ){
            return false
        }
        return true
    }


    public remove(node){
        let index = this.index_[node]
        if(index == null) return 
        this.removeAt(index)
        return index
    }
   
    public removeAt(index){
        if (index >= this.length_ ) return 

        let node = this.data_[index]
        if(node == null) return 

        // if(!node ) return 

        let last = this.data_[this.length_ - 1]

        this.index_[node] = this.length_ -1
        this.data_[this.length_ - 1] = node

        this.index_[last] = index
        this.data_[index] = last

        this.length_ = this.length_ - 1

        return node
    }

    public recover(length){
        this.length_ = length
    }
    
    public items (){
        let i = 0
        return function(){
            i = i + 1
            return this.item(i)
        }
    }

    public item(idx){
        if (idx >=0 && idx< this.length_){
            return this.data_[idx]
        } 
    }

    public clear(){
        this.data_ = {}
        this.index_ = {}
        this.length_ = 0
    }

    public length(){
        return this.length_
    }

}




class Stack {
    private data_:any
    private top_:number
    public constructor(){
        this.data_ = []
        this.top_ = -1
    }
    public length(){
        return this.top_
    }

    public append(node){
        this.push(node)
    }

    public remove(){
        this.pop()
    }

    public push(node){
        let top = this.top_ + 1
        this.data_[top] = node
        this.top_ = top
    }
    //插入队首（插队）
    public pop(idx?){
        let top = this.top_
        idx = idx || top

        // assert(top>0 and idx>0, "can't pop when stack is empty")
        if (idx<=top){
            let node = this.data_[idx]
            for (let i = idx; i < top; i++) {
                this.data_[i] = this.data_[i+1]
            }

            this.data_[top] = null
            this.top_ = top - 1
            return node
        } 
    }

    public data(){
        return this.data_
    }


    public top(){
        let top = this.top_
        return this.data_[top]
    }
   
    public clear(){
        this.data_ = {}
        this.top_ = -1
    }

}


   


class Block {
    private headId_:number
    private tailId_:number
    private rtCol_:number
    private rtRow_:number
    private lbRow_:number
    private lbCol_:number

    public constructor(headId, tailId?){
        this.headId_ = headId
        this.setTail(tailId || headId)
    }

    public head(){
        return this.headId_
    }

    public tail(){
        return this.tailId_
    }


    public width(){
        return (this.rtCol_ - this.lbCol_ + 1) * UNIT_SIZE
    }
   

    public height(){
        return (this.rtRow_ - this.lbRow_ + 1) * UNIT_SIZE
    }

    public setTail(tailId){
        this.tailId_ = tailId

        let heads = GetGridRC(this.headId_)
        this.lbRow_ = heads[0]
        this.lbCol_ = heads[1]

        let tails = GetGridRC(this.tailId_)
        this.rtRow_ = tails[0]
        this.rtCol_ = tails[1]
    }

    public getRect(){
        let p = GetGridPixel(this.headId_) // 左下角
        let x0 = p[0]
        let y0 = p[1]
        return cc.rect(x0, y0, this.width(), this.height())
    }
    

    public lineUp(){
        let row = this.rtRow_ + 1
        if (row > ROW){
            return []
        } 

        let id0 = GetGridID(row, this.lbCol_)
        let id1 = GetGridID(row, this.rtCol_)

        let i = 0
        return [function(){
            let id = id0 + i
            if (id > id1){
                return null
            } 
            i = i + 1
            return id
            
        }, id0, id1]
    }

    


    public lineDown(){
        let row = this.lbRow_ - 1
        if (row < 1) return []
        let id0 =GetGridID(row, this.lbCol_)
        let id1 = GetGridID(row, this.rtCol_)

        let i = 0
        return [function(){
            let id = id0 + i
            if (id > id1){
                return null
            } 
            i = i + 1
            return id
            
        }, id0, id1]
    }


    public lineLeft(){
        let col = this.lbCol_ - 1

        if (col < 1) return []

        let id0 = GetGridID(this.lbRow_, col)
        let id1 = GetGridID(this.rtRow_, col)
    
    
        let i = 0
        return [function(){
            let id = id0 + i*COLUMN
            if (id > id1){
                return null
            } 
            i = i + 1
            return id
        }, id0, id1]
    }
   

    public lineRight(){

        let col = this.rtCol_ + 1
        if (col > COLUMN)return []

        let id0 = GetGridID(this.lbRow_, col)
        let id1 = GetGridID(this.rtRow_, col)

        let i = 0
        return [function(){
            let id = id0 + i*COLUMN
            if (id > id1){
                return null
            } 
            i = i + 1
            return id
        }, id0, id1]
    }
           
    
}



export default class RectUnion {
    protected count_:number
    protected cost_:number
    public minResult_:any 
    protected marked_:any
    protected result_:any

    public clear(){
        this.count_ = 0
        this.cost_ = 0
        this.minResult_ = null
        this.marked_ = {}
        this.result_ = new Stack  //for test
    }

    public run (list){
        this.clear()
        let grids = new GridArray

        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            if(element == 1){
                grids.append(index +1)
            }
        }

        this.perm(0, grids, null)
        cc.log("DONE!!!")
    }

    public isMarked(head, tail){
        return this.marked_[head] && this.marked_[head][tail]
    }

    public mark(head, tail){
        this.marked_[head] = this.marked_[head] || {}
        this.marked_[head][tail] = true
    }
    

    public CheckOneMoreLength(hasLeft){
        if(! this.minResult_){
            return true
        }
        let minLength = this.minResult_.length()
        let length = this.result_.length()
    
        if (hasLeft) {
            return length + 2 < minLength
        }
    
        return length + 1 < minLength

    }


    public foundOne(depth, grids, block){
        let isChecked = this.CheckOneMoreLength(grids.length()>0) // 373 0.045

        if(!isChecked){
            return 
        }
        
        this.result_.push(block)
        this.perm(depth, grids, null)
        this.result_.pop()
    }



    public recordResult(){
        this.minResult_ = new Stack

        this.result_.data().forEach(node => {
            this.minResult_.push(node)
        });
        // cc.log("====Calculator:recordResult", this.result_,this.minResult_)
    }


    static SEARCH_DIRECT = [
        [ "lineRight",    true,   ],
        [ "lineUp",       true,   ],
        [ "lineLeft",     false,  ],
        [ "lineDown",     false,  ],
    ]
    

    public perm(depth, grids, block){

        depth = depth + 1

        let length = grids.length()

        if(length > 0){
            if(block){

                //1. 上下左右合并
                let _head = block.head()
                let _tail = block.tail()

                for (const node of RectUnion.SEARCH_DIRECT) {
                    let head = _head
                    let tail = _tail
                    let canMerge = false 
                    let dels = {}

                    let method = node[0]
                    let forward = node[1]

                    let bb = block[method+""].bind(block)() // 376 0.257

                    let iter = bb[0]
                    let id0 = bb[1]
                    let id1 = bb[2]

                    if (forward){
                        tail = id1
                    }else{
                        head = id0
                    } 

                    if(iter &&  !this.isMarked(head, tail)){
                        canMerge = true
                        let id = iter()
                        while(id != null){
                            if(grids.exist(id)){
                                grids.remove(id)
                            }else{
                                canMerge = false
                                break
                            }
                            id = iter()
                        }
                    }

                    if (canMerge){

                        this.mark(head, tail)

                        let newBlock = new Block(head, tail)   // 377 0.130

                        this.perm(depth, grids, newBlock)
                    } 
                    grids.recover(length)

                }

                //2. 不合并
                this.foundOne(depth, grids, block)
            }else{

                let id = grids.item(0)
                let block = new Block(id)  // 377 0.130
                grids.remove(id)
                this.perm(depth, grids, block)
                grids.append(id)
            }
        }else{
            //show result
            if (block){
                this.foundOne(depth, grids, block)
            }else{
                this.recordResult()
            } 
        }

    }


    /******************************************************************************************************* */



    private costStart_:number = 0
    
    public checkCostStart(){
        this.costStart_ = cc.sys.now()
    }

    public checkCostEnd(){
        this.cost_ = cc.sys.now() - this.costStart_
    }



    public static test(graphics:cc.Graphics){

        cc.debug.setDisplayStats(false)

        let ru = new RectUnion()

        let list = [
            1,1,1,0,0,0,
            1,1,0,0,1,1,
            1,1,0,0,0,0,
            // 1,1,1,0,1,1,
            // 1,1,1,0,0,1,
            // 1,1,1,1,1,1,

            // 1,1,1,1,1,1,
            // 1,1,1,1,1,1,
            // 1,1,1,1,1,1,
            // 1,0,0,0,0,0,
            // 0,0,0,0,0,0,
            // 0,0,0,0,0,1,

            // 1,1,1,
            // 0,0,0,
            // 0,0,0,
            // 0,0,0,
            // 1,1,1,
            // 1,1,1,
        ]

        console.time("test")

        ru.run(list)  // 处理

        console.timeEnd("test")


        graphics.strokeColor = cc.Color.BLUE
        graphics.lineWidth = 4
        

        for (const block of ru.minResult_.data()) {
            let rect = block.getRect()
            cc.log("orgin:",rect)
            // graphics.strokeColor = cc.color(MathUtil.randomRange(100,255),MathUtil.randomRange(100,255),255)
            graphics.strokeColor = cc.Color.BLUE
            graphics.rect(rect.x,rect.y,rect.width,rect.height)
            graphics.stroke()
        }

        
    }
}
