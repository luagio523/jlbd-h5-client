var gulp = require('gulp');
var fs = require('fs');
var tiny = require('gulp-tinypng-nokey');

const tpath = '../../assets/resources';
// const tpath = '/Users/ddzy2020/gamejob/h5fish/fish-client-build/jsb-default/res'
//排除的文件列表
excludeFileList = [
    
]
//排除的路径列表
excludePathList = [
    "/UI",
    "/landlord_ani",
    "/img",
    "/module",
    // "/anim/"
]


function isInExcludeFileList(name){
   for (let index = 0; index < excludeFileList.length; index++) {
       const element = excludeFileList[index];
       if(name.lastIndexOf(element)>=0){
            return true
        }
   }
   return false
}

function isInExcludePathList(name){
    for (let index = 0; index < excludePathList.length; index++) {
        const element = excludePathList[index];
        if(name.lastIndexOf(element)>=0){
            return true
        }
    }
    return false
 }

fileList = [];
	
function walk(path){
	var dirList = fs.readdirSync(path);
	dirList.forEach(function(item){
		if(fs.statSync(path + '/' + item).isDirectory()){
           
            walk(path + '/' + item);
            
		}else{
            if(item.endsWith(".jpg")||item.endsWith(".png")){
                
                if(!isInExcludePathList(path) && !isInExcludeFileList(item)){
                    // console.log(path)
                    fileList.push(path + '/' + item);
                }
            }
			
		}
	});
}

walk(tpath);


console.log("need handle",fileList)

 

gulp.task('tinypng', function () {
    dealFolder(fileList)
});



function dealFolder(fileList) {
    if(fileList.length <= 0 ){
        return
    }

    let fileName = fileList.shift()
    console.log("start deal ",fileName)
    if(!fileName || fileName.length <=4){
        dealFolder(fileList)
        return 
    }

    let targetFile = fileName.replace(tpath,"./dist")

    if(fs.existsSync(targetFile)){
        console.log(targetFile,"has handle")
        dealFolder(fileList)
        return 
    }

    let targetPath = targetFile.substring(0,targetFile.lastIndexOf("/"))


    console.log(targetPath)

    gulp.src(fileName)
        .pipe(tiny())
        .pipe(gulp.dest(targetPath))
        // .on('error', function(err) {
        //     console.log(' ------------ error',err);
        //     fileList.push(fileName)
        //   })
        .on("end", (ff) => {
            console.log(' ------------ finish deal file ',targetFile);

               if(!fs.existsSync(targetFile)){
                   console.log("push list  agagin",fileName)
                   fileList.push(fileName)
               }

            dealFolder(fileList)
        });
}


