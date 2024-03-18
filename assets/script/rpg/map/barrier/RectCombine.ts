/**
 * Created by zhouxiangyu on 2018/1/23.
 */


 class Node {
    constructor( x,  y) {
        this.x = x;
        this.y = y;
    }

    used:boolean = false;
    x:number;
    y:number;

    public  equals( obj):boolean {
        if (obj == this) return true;
        if (obj == null) return false;
        if (!(obj instanceof Node)) return false;
        let node = <Node> obj;
        return node.x == this.x && node.y == this.y;
    }
}



export class RectCombine {

    private   TAG = "zhouxiangyu";
    private   LEFT = 0;
    private   TOP = 1;
    private   RIGHT = 2;
    private   BOTTOM = 3;

    private  nextDirection = this.LEFT;
    private  isFirstTime = true;
    private  interrupt = false;
    private  quickMode = false;

    private ys = new Array();
    private xs = new Array();

    private  refreshAreas = new Array();
    private  nodes = new Array();
    private  walls = new Array();
    private  areas = new Array();
    private  currentArea = new Array();
    private  childrenToAdd = new Array();


    private currentNode:Node;
    private xs_size:number
    private ys_size:number;
    private  nodesSize;
    private rects:cc.Rect[];



    constructor(rects:cc.Rect[], areaWidth:number, areaHeight:number, quickMode:boolean = false) {
        this.init(rects, areaWidth, areaHeight, quickMode);
    }

    public getResult():Array<cc.Rect>  {
        if (this.refreshAreas.length != 0) {
            return this.refreshAreas;
        }
        return null;
    }

    private  init(rects:cc.Rect[], areaWidth:number, areaHeight:number, quickMode:boolean = false):void {
        this.quickMode = quickMode;
        if (rects.length != 0) {
            this.rects = rects;
        } else {
            cc.log(this.TAG, "Rect can't be null !");
            return;
        }
        for (const rect of rects) {
            // this.xs.push(rect.left);
            // this.xs.push(rect.right);
            // this.ys.push(rect.top);
            // this.ys.push(rect.bottom);

            this.xs.push(rect.x);
            this.xs.push(rect.x+rect.width);
            this.ys.push(rect.y+rect.height);
            this.ys.push(rect.y);
        }

       
        //将区域边框加入排序
        this.ys.push(0);
        this.ys.push(areaWidth);
        this.xs.push(0);
        this.xs.push(areaHeight);
        RectCombine.bubbleSort(this.xs);
        RectCombine.bubbleSort(this.ys);
        this.xs_size = this.xs.length;
        this.ys_size = this.ys.length;
        // long time = System.nanoTime();
        this.initAreas();
        // double delta = (System.nanoTime() - time) / 1000000.0;
        // Log.d(TAG, "Time Cost: " + delta + " ms");
    }

    private  initAreas():void {
        let node:Node;
        
        for ( let i = 0; i < this.ys_size - 1; i++) {
            for (let j = 0; j < this.xs_size - 1; j++) {
                let area = cc.rect(
                    this.xs[j],
                    this.ys[i + 1],
                    this.xs[j + 1] - this.xs[j],
                    this.ys[i] - this.ys[i+1]
                );
                // area.top = this.ys[i];
                // area.bottom = this.ys[i + 1];
                // area.left = this.xs[j];
                // area.right = this.xs[j + 1];
                node = new Node(j, i);
                if (!this.areaInRect(area)) {
                    this.nodes.push(node);
                } else {
                    this.walls.push(node);
                }
            }
        }
        cc.log(this.TAG, "nodes num : " + this.nodes.length);
        //开始合并矩形
        this.nodesSize = this.nodes.length;
        this.combineNearbyAreas();
    }

    private combineNearbyAreas():void {
        //初始时解的最小矩形数目为未使用区域数
        let minNum:number = this.nodesSize;
        for (let i = 0; i < 1; i++) {
            this.interrupt = false;
            //初始化解列表
            // this.areas.clear();
            this.areas.length = 0
            //初始化所有节点为未使用状态
            this.changeToNotUsed();
            //初始化当前需合并矩形列表
            this.currentArea.length = 0
            // this.currentArea.clear();
            //将第一个节点作为初始节点
            this.currentNode = this.nodes[i];
            //将初始节点存入矩形列表
            this.currentArea.push(this.currentNode);
            //如果已使用节点数小于所有节点数，则循环在当前矩形列表基础上扩充矩形
            while (this.getUsedNodeNum() <= this.nodesSize && this.currentNode != null) {

                //当前解已经大于当前最优解，清除当前数据，结束剩余循环
                if (this.areas.length > minNum) {
                    this.currentNode = null;
                    this.interrupt = true;
                    break;
                }

                //判断初始节点有无左孩子，如果有则进行深度遍历，然后纵向扩展矩形列表使其包含的矩形最多
                if ( this.nextDirection == this.LEFT) {
                    if ( this.hasChild(this.currentNode,  this.LEFT)) {
                        this.getAndSaveNode( this.LEFT);
                    } else {
                        //如果当前方向不可扩展，切换方向
                        if ( this.isFirstTime) {
                            this.nextDirection =  this.RIGHT;
                        } else {
                            //纵向扩展矩形列表
                            this.getChildren(this.currentArea,  this.TOP);
                            this.getChildren(this.currentArea,  this.BOTTOM);
                            //当前矩形已最大，将currentNode置为未使用的第一个矩形,清除矩形列表
                            //遍历方向变为左，重置相关标志位，开始新一轮循环
                            this.initNode();
                        }
                    }
                } else if ( this.nextDirection ==  this.RIGHT) {
                    if ( this.hasChild(this.currentNode,  this.RIGHT)) {
                        this.getAndSaveNode( this.RIGHT);
                    } else {
                        if ( this.isFirstTime) {
                            this.nextDirection =  this.TOP;
                        } else {
                            this.getChildren( this.currentArea,  this.TOP);
                            this.getChildren( this.currentArea,  this.BOTTOM);
                            this.initNode();
                        }
                    }
                } else if ( this.nextDirection ==  this.TOP) {
                    if ( this.hasChild( this.currentNode,  this.TOP)) {
                        this.getAndSaveNode( this.TOP);
                    } else {
                        if ( this.isFirstTime) {
                            this.nextDirection =  this.BOTTOM;
                        } else {
                            this.getChildren( this.currentArea,  this.LEFT);
                            this.getChildren( this.currentArea,  this.RIGHT);
                            this.initNode();
                        }
                    }

                } else if ( this.nextDirection ==  this.BOTTOM) {
                    if ( this.hasChild(this.currentNode,  this.BOTTOM)) {
                        this.getAndSaveNode( this.BOTTOM);
                    } else {
                        //如果初始节点的四个方向都不可扩充，则将其作为一个成功和并的区域存入解列表
                        if ( this.isFirstTime) {
                            this.nextDirection =  this.LEFT;
                            this.currentNode.used = true;
                            this.areas.push(this.getRect(this.currentArea));
                            this.currentNode =  this.getFirstUnUsedNode();
                        } else {
                            this.getChildren(this.currentArea,  this.LEFT);
                            this.getChildren(this.currentArea,  this.RIGHT);
                            this.initNode();
                        }
                    }
                }

            }
            if (! this.interrupt) {
                //一次循环结束，当前解为最优解
                minNum =  this.areas.length;
                this.refreshAreas.length = 0;
                this.refreshAreas.push( ...this.areas);
            }
        }
        cc.log(this.TAG, "areas num : " + this.areas.length);
    }

      // area.top = this.ys[i];
                // area.bottom = this.ys[i + 1];
                // area.left = this.xs[j];
                // area.right = this.xs[j + 1];

        // void	union(int left, int top, int right, int bottom)
        // Update this Rect to enclose itself and the specified rectangle.
        // void	union( Rect r)
        // Update this Rect to enclose itself and the specified rectangle.


    private  getRect( currentArea:Array<Node>):cc.Rect {
        let refreshArea:cc.Rect = cc.rect();

        for (const node of currentArea) {

            let area = cc.rect(
                this.xs[node.x],
                this.ys[node.y + 1],
                this.xs[node.x + 1] - this.xs[node.x],
                this.ys[node.y] - this.ys[node.y + 1]
            );

            // refreshArea.union(this.xs[node.x], this.ys[node.y], this.xs[node.x + 1], this.ys[node.y + 1]);
            var union = new cc.Rect();
            refreshArea.union(union, area); // union {x: 0, y: 10, width: 20, height: 20};

            refreshArea = union
        }
        
        return refreshArea;
    }

    private  initNode():void {
        this.currentArea.push(...this.childrenToAdd)
        this.areas.push(this.getRect(this.currentArea));
        this.changeToUsed(this.currentArea);
        this.currentArea.length = 0;
        this.childrenToAdd.length = 0;
        this.currentNode =  this.getFirstUnUsedNode();
        if ( this.currentNode != null) {
            this.currentArea.push( this.currentNode);
            this.currentNode.used = true;
        }
        this.nextDirection =  this.LEFT;
        this.isFirstTime = true;
    }

    private  getAndSaveNode(direction:number):void {
        this.currentNode = this.getChild(this.currentNode, direction);
        this.currentArea.push(this.currentNode);
        this.currentNode.used = true;
        this.isFirstTime = false;
    }

    private  getChildren( currentArea:Array<Node>,  direction:number):void {
        let children:Array<Node> = new Array();
        let oneChild:Node;

        for (const node of currentArea) {
            if (direction == this.LEFT) {
                oneChild = new Node(node.x - 1, node.y);
            } else if (direction == this.RIGHT) {
                oneChild = new Node(node.x + 1, node.y);
            } else if (direction == this.TOP) {
                oneChild = new Node(node.x, node.y - 1);
            } else if (direction == this.BOTTOM) {
                oneChild = new Node(node.x, node.y + 1);
            } else {
                oneChild = null;
            }
            if (oneChild != null && !((node.x < 0 || node.x > this.xs_size - 2) || (node.y < 0 || node.y > this.ys_size - 2))) {
                if (this.nodeInNodeList(oneChild)) {
                    children.push(oneChild);
                } else {
                    break;
                }
            } else {
                break;
            }
        }
       
        if (children.length == currentArea.length) {
            this.childrenToAdd.push(...children);
            this.changeToUsed(children);
            this.getChildren(children, direction);
        }
    }

    private  getUsedNodeNum():number {
        let num:number = 0;
        for (let i = 0; i < this.nodesSize; i++) {
            if (this.nodes[i].used) {
                num++;
            }
        }
        return num;
    }

    private  nodeInNodeList(node:Node ):boolean {
        let size = this.walls.length;
        for (let i = 0; i < size; i++) {
            //由于区域的设置可重叠，并且最后设置的矩形越少越好，所以可将已使用区域用于扩充
            //这样一定概率可以提前消耗未使用矩形，快速得到数量最少的解
            if ((node.equals(this.walls[i]))
                    || (node.x < 0 || node.x > this.xs_size - 2)
                    || (node.y < 0 || node.y > this.ys_size - 2)) {
                return false;
            }
        }
        if (!this.quickMode){
            for (let i = 0; i < this.nodesSize; i++) {
                if(this.nodes[i].equals(node)){
                    if(this.nodes[i].used) {
                        return false;
                    }
                }
            }
        }
            return true;
    }

    private  getFirstUnUsedNode():Node {
        for (let i = 0; i < this.nodesSize; i++) {
            if (!this.nodes[i].used) {
                return this.nodes[i];
            }
        }
        return null;
    }

    private  changeToUsed( areas:Array<Node>):void {
        for (const node of areas) {
            for (const listNode of this.nodes) {
                if (node.equals(listNode)) {
                    listNode.used = true;
                    break;
                }
            }
        }
       
    }

    private  changeToNotUsed():void {
        for (const node of this.nodes) {
            node.used = false;
        }
    }

    private  hasChild(node:Node , direction:number):boolean {
        for (let i = 0; i < this.nodesSize; i++) {
            if (!this.nodes[i].used) {
                if (direction == this.LEFT) {
                    if (this.nodes[i].x == node.x - 1 && this.nodes[i].y == node.y) {
                        return true;
                    }
                } else if (direction == this.RIGHT) {
                    if (this.nodes[i].x == node.x + 1 && this.nodes[i].y == node.y) {
                        return true;
                    }
                } else if (direction == this.TOP) {
                    if (this.nodes[i].x == node.x && this.nodes[i].y == node.y - 1) {
                        return true;
                    }
                } else if (direction == this.BOTTOM) {
                    if (this.nodes[i].x == node.x && this.nodes[i].y == node.y + 1) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private  getChild(node:Node ,direction:number):Node {
        let child:Node;
        if (direction == this.LEFT) {
            child = new Node(node.x - 1, node.y);
            child.used = true;
            return child;
        } else if (direction == this.RIGHT) {
            child = new Node(node.x + 1, node.y);
            child.used = true;
            return child;
        } else if (direction == this.TOP) {
            child = new Node(node.x, node.y - 1);
            child.used = true;
            return child;
        } else if (direction == this.BOTTOM) {
            child = new Node(node.x, node.y + 1);
            child.used = true;
            return child;
        }
        return null;
    }


    private  areaInRect( area:cc.Rect):boolean {
        let contains:boolean = false;
        for (const rect of this.rects) {
            contains = rect.containsRect(area) || contains;
        }
        return contains;
    }

    public static  bubbleSort( list:Array<number>):void {
        let temp;
        let size = list.length;
        for (let i = 0; i < size - 1; i++) {
            for (let j = 0; j < size - 1 - i; j++) {
                if (list[j] > list[j + 1]) {
                    temp = list[j];
                    list[j] = list[j + 1]
                    list[j+1] = temp
                }
            }
        }

        //去重
        let newList:Array<number>  = new Array();

        for (const a of list) {
            if (newList.indexOf(a) == -1) {
                newList.push(a);
            }
        }
        
        list.length = 0;
        list.push(...newList);
    }





    // Rect(int left, int top, int right, int bottom)
    public static test(graphics:cc.Graphics){
        let areaWidth = 1200;
        let areaHeight = 825;

        let rects:cc.Rect[] = [
                this.createRect(100, 100, 200, 200),
                this.createRect(100, 300, 200, 400),
                this.createRect(150, 450, 300, 700),
                this.createRect(200, 200, 300, 300),
                this.createRect(400, 600, 500, 700),
                this.createRect(750, 200, 800, 600),
                this.createRect(650, 350, 700, 450),
                this.createRect(900, 550, 1000, 800),
                this.createRect(1000, 0, 1200, 200)
        ];

        graphics.strokeColor = cc.Color.BLUE
        graphics.lineWidth = 4

        for (const rect of rects) {
            cc.log("orgin:",rect)
            graphics.rect(rect.x,rect.y,rect.width,rect.height)
        }

        graphics.stroke()

        let combine = new RectCombine(rects, areaWidth, areaHeight,false);

        let result = combine.getResult()

        for (const rect of result) {
            graphics.strokeColor = cc.Color.RED
            graphics.rect(rect.x,rect.y,rect.width,rect.height)
            cc.log(rect)
        }

        graphics.stroke()
       
    }


    public static createRect( left:number,  top:number,  right:number,  bottom:number):cc.Rect{
        return cc.rect(
            left,
            bottom,
            right - left ,
            top - bottom
        )
    }
   
}