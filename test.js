// function toPascalCase(str) {
//     // 首先将整个字符串转换为小写
//     str = str.toLowerCase();
//     // 首先分割字符串，但保留大写字母
//     const words = str.split(/[_-]|\B(?=[A-Z])/);
    
//     // 然后处理每个单词
//     return words.map(word => 
//         word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
//     ).join('');
// }

// // 测试
// console.log(toPascalCase('CreateRole_View_show')); // 输出: CreateRoleView
// console.log(toPascalCase('create_role_view')); // 输出: CreateRoleView
// console.log(toPascalCase('create-role-view')); // 输出: CreateRoleView
// console.log(toPascalCase('createRoleView')); // 输出: CreateRoleView


// console.log(toPascalCase('CREATE_ROLE_VIEW')); // 输出: CreateRoleView

// // console.log(toPascalCase('createRoleView')); // 输出: CreateRoleView
// function executeCreateRole(...args) {
//    console.log(args)
// }

// executeCreateRole("createRoleView","heelo")


// console.log(1721962693426/1000 -1721962692303/1000 )
// pass time: 1721962692303
// MovieClip.ts:98 =====x=x=x==x=x= 1721962693345
// MovieClip.ts:98 =====x=x=x==x=x= 1721962693377
// MovieClip.ts:98 =====x=x=x==x=x= 1721962693426



function getFileNameWithoutExtension(path) {
    // 1. 获取最后一个 '/' 之后的部分
    const fileName = path.slice(path.lastIndexOf('/') + 1);
    
    // 2. 获取文件名和扩展名的最后一个 '.' 的索引
    const dotIndex = fileName.lastIndexOf('.');
    
    // 3. 如果没有找到 '.', 返回文件名本身; 否则返回去掉扩展名的文件名
    return dotIndex === -1 ? fileName : fileName.slice(0, dotIndex);
}

console.log(getFileNameWithoutExtension('e:/workplace/hope/jlbd-h5-client/test.js')); // 输出: test

console.log(getFileNameWithoutExtension('test')); // 输出: test

console.log(getFileNameWithoutExtension('test.json')); // 输出: test