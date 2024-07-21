function toPascalCase(str) {
    // 首先将整个字符串转换为小写
    str = str.toLowerCase();
    // 首先分割字符串，但保留大写字母
    const words = str.split(/[_-]|\B(?=[A-Z])/);
    
    // 然后处理每个单词
    return words.map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join('');
}

// 测试
console.log(toPascalCase('CreateRole_View_show')); // 输出: CreateRoleView
console.log(toPascalCase('create_role_view')); // 输出: CreateRoleView
console.log(toPascalCase('create-role-view')); // 输出: CreateRoleView
console.log(toPascalCase('createRoleView')); // 输出: CreateRoleView


console.log(toPascalCase('CREATE_ROLE_VIEW')); // 输出: CreateRoleView

// console.log(toPascalCase('createRoleView')); // 输出: CreateRoleView
function executeCreateRole(...args) {
   console.log(args)
}

executeCreateRole("createRoleView","heelo")