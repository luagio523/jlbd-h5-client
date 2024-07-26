// interface PathCache {
//     [key: string]: cc.Vec3[];
// }

// let pathCache: PathCache = {};
// function calculatePath(start: cc.Vec3, end: cc.Vec3): cc.Vec3[] {
//     // 这里是你的路径计算逻辑
//     // 返回一个路径点数组
//     return [];
// }
// function getPath(start: cc.Vec3, end: cc.Vec3): cc.Vec3[] {
//     const cacheKey = `${start.toString()}-${end.toString()}`;

//     if (pathCache[cacheKey]) {
//         return pathCache[cacheKey];
//     }

//     const path = calculatePath(start, end);
//     pathCache[cacheKey] = path;
//     return path;
// }
// . 定期清理缓存
// 为了防止缓存过大，我们需要定期清理过时的缓存。可以使用一个简单的定时器来实现。
// function clearCache() {
//     pathCache = {};
// }

// setInterval(clearCache, 10000); // 每10秒清理一次缓存


// 5. 共享路径的实现
// 当多个怪物接近时，可以共享路径。我们可以通过一个简单的距离检查来实现路径共享。
// function getSharedPath(start: cc.Vec3, end: cc.Vec3, threshold: number = 5): cc.Vec3[] {
//     for (const key in pathCache) {
//         const [cachedStart, cachedEnd] = key.split('-').map(str => cc.Vec3.fromString(str));
        
//         if (start.subtract(cachedStart).length() < threshold && end.subtract(cachedEnd).length() < threshold) {
//             return pathCache[key];
//         }
//     }

//     return getPath(start, end);
// }




// class Monster extends cc.Component {
//     target: cc.Vec3;
//     path: cc.Vec3[] = [];
//     currentPathIndex: number = 0;

//     update(dt: number) {
//         if (this.path.length === 0 || this.currentPathIndex >= this.path.length) {
//             this.path = getSharedPath(this.node.position, this.target);
//             this.currentPathIndex = 0;
//         }

//         const nextPoint = this.path[this.currentPathIndex];
//         const direction = nextPoint.subtract(this.node.position).normalize();
//         this.node.position = this.node.position.add(direction.multiplyScalar(dt * this.speed));

//         if (this.node.position.subtract(nextPoint).length() < 0.1) {
//             this.currentPathIndex++;
//         }
//     }
// }
