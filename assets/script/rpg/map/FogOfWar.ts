import { _decorator, Component, Node, Sprite, UITransform, Vec3, Camera, view, Material, Vec2, Texture2D, SpriteFrame } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('FogOfWar')
export class FogOfWar extends Component {
    private fogNode: Node;
    private fogSprite: Sprite;
    private camera: Camera;
    private mapWidth: number;
    private mapHeight: number;
    private textureSize: number = 1024; // 迷雾纹理大小
    private material: Material = null;
    private pixelData: Uint8Array;

    init(cameraNode: Node, mapWidth: number, mapHeight: number): void {
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;

        // 创建迷雾节点
        this.fogNode = new Node('FogOfWar');
        const uiTransform = this.fogNode.addComponent(UITransform);
        uiTransform.setContentSize(mapWidth, mapHeight);
        cameraNode.addChild(this.fogNode);

        // 创建迷雾精灵
        this.fogSprite = this.fogNode.addComponent(Sprite);

        // 创建纹理
        const texture = new Texture2D();
        texture.setFilters(Texture2D.Filter.LINEAR, Texture2D.Filter.LINEAR);
        texture.setWrapMode(Texture2D.WrapMode.REPEAT, Texture2D.WrapMode.REPEAT);

        // 创建黑色纹理
        this.pixelData = new Uint8Array(this.textureSize * this.textureSize * 4);
        for (let i = 0; i < this.pixelData.length; i += 4) {
            this.pixelData[i] = 0;     // R
            this.pixelData[i + 1] = 0; // G
            this.pixelData[i + 2] = 0; // B
            this.pixelData[i + 3] = 255; // A (完全不透明)
        }

        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = texture;
        this.fogSprite.spriteFrame = spriteFrame;

        // 获取相机组件
        this.camera = cameraNode.getComponent(Camera);
        if (!this.camera) {
            console.error('Camera component not found on the provided node');
        }

        // 获取材质并设置
        this.material = this.fogSprite.getSharedMaterial(0);
        this.material.setProperty('cameraPosition', new Vec2(0, 0)); // 初始化相机位置
        this.material.setProperty('revealInfo', new Vec3(0, 0, 0)); // 初始化揭示区域
        this.fogSprite.setSharedMaterial(this.material,0);

        // 设置迷雾Sprite的大小为屏幕大小加上一些边距
        let size = view.getVisibleSize();
        uiTransform.setContentSize(size.width * 1.2, size.height * 1.2);
    }

    update() {
        // 更新迷雾位置以跟随相机
        const cameraPos = this.camera.node.position;
        this.fogSprite.node.setPosition(cameraPos.x, cameraPos.y);

        // 更新材质中的相机位置
        this.material.setProperty('cameraPosition', new Vec2(cameraPos.x, cameraPos.y));
    }

    public revealArea(center: Vec3, radius: number) {
        // 将揭示区域信息传递给着色器
        this.material.setProperty('revealInfo', new Vec3(center.x, center.y, radius));
    }

    public setVisible(visible: boolean) {
        this.fogSprite.node.active = visible;
    }

    public reset(): void {
        this.pixelData.fill(255); // 重置为完全不透明
    }
}





// import { _decorator, Component, Node, Sprite, UITransform, Vec3, Camera, view, Material, Vec2, Texture2D, SpriteFrame } from 'cc';

// const { ccclass, property } = _decorator;

// @ccclass('FogOfWar')
// export class FogOfWar extends Component {
//     private fogNode: Node;
//     private fogSprite: Sprite;
//     private maskContainer: Node;
//     private camera: Camera;
//     private mapWidth: number;
//     private mapHeight: number;
//     private textureSize: number = 1024; // 迷雾纹理大小
//     private material: Material = null;
//     private visibleSize: Vec2 = new Vec2();

//     init(cameraNode: Node, mapWidth: number, mapHeight: number): void {
//         this.mapWidth = mapWidth;
//         this.mapHeight = mapHeight;

//         // 创建迷雾节点
//         this.fogNode = new Node('FogOfWar');
//         const uiTransform = this.fogNode.addComponent(UITransform);
//         uiTransform.setContentSize(mapWidth, mapHeight);
//         cameraNode.addChild(this.fogNode);

//         // 创建迷雾精灵
//         this.fogSprite = this.fogNode.addComponent(Sprite);

//         // 创建遮罩容器
//         this.maskContainer = new Node('MaskContainer');
//         this.fogNode.addChild(this.maskContainer);

//         // 设置纹理
//         const texture = new Texture2D();
//         texture.setFilters(Texture2D.Filter.LINEAR, Texture2D.Filter.LINEAR);
//         texture.setWrapMode(Texture2D.WrapMode.REPEAT, Texture2D.WrapMode.REPEAT);

//         // 创建一个黑色的纹理
//         const pixelData = new Uint8Array(this.textureSize * this.textureSize * 4);
//         for (let i = 0; i < pixelData.length; i += 4) {
//             pixelData[i] = 0;     // R
//             pixelData[i + 1] = 0; // G
//             pixelData[i + 2] = 0; // B
//             pixelData[i + 3] = 200; // A (半透明)
//         }
//         texture.uploadData(pixelData);

//         const spriteFrame = new SpriteFrame();
//         spriteFrame.texture = texture;
//         this.fogSprite.spriteFrame = spriteFrame;

//         // 获取相机组件
//         this.camera = cameraNode.getComponent(Camera);
//         if (!this.camera) {
//             console.error('Camera component not found on the provided node');
//         }

//         // 使用 getSharedMaterial 替代 getMaterial
//         this.material = this.fogSprite.getSharedMaterial(0);
//         if (!this.material) {
//             console.error('No material found on fogSprite');
//             return;
//         }

//         let size = view.getVisibleSize();
//         this.visibleSize.set(size.width, size.height);


//         // 设置迷雾Sprite的大小为屏幕大小加上一些边距
//         uiTransform.setContentSize(this.visibleSize.x * 1.2, this.visibleSize.y * 1.2);

//         // 初始化迷雾材质
//         this.updateFogTexture();
//     }

//     update() {
//         // 更新迷雾位置以跟随相机
//         const cameraPos = this.camera.node.position;
//         this.fogSprite.node.setPosition(cameraPos.x, cameraPos.y);

//         // 更新迷雾纹理（这里可以根据需要降低更新频率）
//         this.updateFogTexture();
//     }

//     private updateFogTexture() {
//         if (!this.material) return;

//         // 更新材质中的相机位置
//         const cameraPos = this.camera.node.position;
//         this.material.setProperty('cameraPosition', new Vec2(cameraPos.x, cameraPos.y));
//     }

//     public revealArea(center: Vec3, radius: number) {
//         if (!this.material) return;

//         // 将揭示区域信息传递给着色器
//         const revealInfo = new Vec3(center.x, center.y, radius);
//         this.material.setProperty('revealInfo', revealInfo);
//     }

//     public setVisible(visible: boolean) {
//         this.fogSprite.node.active = visible;
//     }

//     public reset(): void {
//         this.maskContainer.removeAllChildren();
//     }
// }



// @ccclass('FogOfWar')
// export class FogOfWar {
//     private fogNode: Node;
//     private fogSprite: Sprite;
//     private maskContainer: Node;
//     private camera: Camera;
//     private mapWidth: number;
//     private mapHeight: number;
//     private textureSize: number = 1024; // 迷雾纹理大小

//     init(cameraNode: Node, mapWidth: number, mapHeight: number): void {
//         this.mapWidth = mapWidth;
//         this.mapHeight = mapHeight;

//         // 创建迷雾节点
//         this.fogNode = new Node('FogOfWar');
//         const uiTransform = this.fogNode.addComponent(UITransform);
//         uiTransform.setContentSize(mapWidth, mapHeight);

//         // 创建迷雾精灵
//         this.fogSprite = this.fogNode.addComponent(Sprite);
        
//         // 创建遮罩容器
//         this.maskContainer = new Node('MaskContainer');
//         this.fogNode.addChild(this.maskContainer);

//         // 设置纹理
//         const texture = new Texture2D();
//         texture.setFilters(Texture2D.Filter.LINEAR, Texture2D.Filter.LINEAR);
//         texture.setWrapMode(Texture2D.WrapMode.REPEAT, Texture2D.WrapMode.REPEAT);
        
//         const pixelData = new Uint8Array(this.textureSize * this.textureSize * 4);
//         for (let i = 0; i < pixelData.length; i += 4) {
//             pixelData[i] = 0;     // R
//             pixelData[i + 1] = 0; // G
//             pixelData[i + 2] = 0; // B
//             pixelData[i + 3] = 200; // A (半透明)
//         }
        
//         // 使用正确的 uploadData 方法
//         texture.uploadData(pixelData);

//         const spriteFrame = new SpriteFrame();
//         spriteFrame.texture = texture;
//         this.fogSprite.spriteFrame = spriteFrame;

//         // 获取相机组件
//         this.camera = cameraNode.getComponent(Camera);
//         if (!this.camera) {
//             console.error('Camera component not found on the provided node');
//         }

//         // 初始化整个地图为黑色
//         this.updateSpriteTiling();
//     }

//     private updateSpriteTiling(): void {
//         if (!this.camera) return;

//         const cameraPos = this.camera.node.position;
//         const uiTransform = this.fogSprite.getComponent(UITransform);
//         const width = uiTransform.width;
//         const height = uiTransform.height;

//         // 计算tiling
//         const tilingX = width / this.textureSize;
//         const tilingY = height / this.textureSize;
//         const offsetX = (cameraPos.x % this.textureSize) / this.textureSize;
//         const offsetY = (cameraPos.y % this.textureSize) / this.textureSize;

//         // 使用 rect 和 offset 属性
//         this.fogSprite.spriteFrame.rect = new math.Rect(0, 0, tilingX * this.textureSize, tilingY * this.textureSize);
//         this.fogSprite.spriteFrame.offset = new math.Vec2(offsetX * this.textureSize, offsetY * this.textureSize);
//     }

//     public revealArea(center: Vec3, radius: number): void {
//         const maskNode = new Node('RevealMask');
//         const maskTransform = maskNode.addComponent(UITransform);
//         maskTransform.setContentSize(radius * 2, radius * 2);
        
//         const worldPos = this.maskContainer.getComponent(UITransform).convertToNodeSpaceAR(center);
//         maskNode.setPosition(worldPos);

//         const mask = maskNode.addComponent(Mask);
//         mask.type = Mask.Type.GRAPHICS_ELLIPSE;

//         this.maskContainer.addChild(maskNode);
//     }

//     public setVisible(visible: boolean): void {
//         this.fogNode.active = visible;
//     }

//     public reset(): void {
//         this.maskContainer.removeAllChildren();
//     }

//     update() {
//         this.updateSpriteTiling();
//     }
// }



// @ccclass('FogOfWar')
// export class FogOfWar extends Component {
//     @property(Sprite)
//     fogSprite: Sprite = null;

//     @property(Camera)
//     mainCamera: Camera = null;

//     @property(Node)
//     maskContainer: Node = null;

//     // private mapWidth: number = 40000;
//     // private mapHeight: number = 40000;
//     private textureSize: number = 1024; // 迷雾纹理大小

//     start() {
//         if (!this.fogSprite || !this.mainCamera || !this.maskContainer) {
//             console.error('Required components not set in the inspector');
//             return;
//         }

//         // 设置迷雾Sprite的大小为屏幕大小
//         const screenSize = view.getVisibleSize();
//         const uiTransform = this.fogSprite.getComponent(UITransform);
//         uiTransform.setContentSize(screenSize.width, screenSize.height);

//         // 设置纹理为重复模式
//         const texture = this.fogSprite.spriteFrame.texture;
//         texture.setFilters(Texture2D.Filter.LINEAR, Texture2D.Filter.LINEAR);
//         texture.setWrapMode(Texture2D.WrapMode.REPEAT, Texture2D.WrapMode.REPEAT);

//         // 设置Sprite的tiling
//         this.updateSpriteTiling();
//     }

//     update() {
//         // 更新迷雾位置以跟随相机
//         const cameraPos = this.mainCamera.node.position;
//         this.fogSprite.node.setPosition(cameraPos.x, cameraPos.y);

//         // 更新Sprite的tiling
//         this.updateSpriteTiling();
//     }

//     private updateSpriteTiling() {
//         const cameraPos = this.mainCamera.node.position;
//         const uiTransform = this.fogSprite.getComponent(UITransform);
//         const width = uiTransform.width;
//         const height = uiTransform.height;

//         // 计算tiling
//         const tilingX = width / this.textureSize;
//         const tilingY = height / this.textureSize;
//         const offsetX = (cameraPos.x % this.textureSize) / this.textureSize;
//         const offsetY = (cameraPos.y % this.textureSize) / this.textureSize;

//         // 使用 rect 和 offset 属性
//         this.fogSprite.spriteFrame.rect = new math.Rect(0, 0, tilingX * this.textureSize, tilingY * this.textureSize);
//         this.fogSprite.spriteFrame.offset = new math.Vec2(offsetX * this.textureSize, offsetY * this.textureSize);
//     }

//     public revealArea(center: Vec3, radius: number): void {
//         const maskNode = new Node('RevealMask');
//         const maskTransform = maskNode.addComponent(UITransform);
//         maskTransform.setContentSize(radius * 2, radius * 2);
        
//         const worldPos = this.maskContainer.getComponent(UITransform).convertToNodeSpaceAR(center);
//         maskNode.setPosition(worldPos);

//         const mask = maskNode.addComponent(Mask);
//         mask.type = Mask.Type.GRAPHICS_ELLIPSE;  // 使用 Mask.Type 而不是 MaskType

//         this.maskContainer.addChild(maskNode);
//     }

//     public setVisible(visible: boolean): void {
//         this.fogSprite.node.active = visible;
//     }

//     public reset(): void {
//         this.maskContainer.removeAllChildren();
//     }
// }
