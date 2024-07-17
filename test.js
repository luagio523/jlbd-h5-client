var s = {width: 2048, height: 1536};
var rw = s.width;
var rh = s.height;
var finalW = rw;
var finalH = rh;

var dr = {width: 1280, height: 720};

if ((rw / rh) > (dr.width / dr.height)) {
    // 如果更长，则用定高
     finalW = finalH * rw / rh;
     console.log("顶宽",finalW, finalH,rw,rh);
}
else {
    // 如果更短，则用定宽
    finalW = dr.width;
    finalH = finalW * rh / rw;
    console.log("更短");
}
console.log(finalW, finalH);

