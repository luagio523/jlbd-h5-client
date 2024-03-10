function addNewFunctionAbove(text, newFunctionText) {
    // 正则表达式匹配第一个符合条件的函数包括它的注释（如果有）
    const functionPattern = /((\/\/.*\n)|(\/\*[\s\S]*?\*\/\s*))?public\s+execute\w*\s*\([^)]*\)\s*{[^}]*}/;
  
    // 替换匹配到的第一个函数，将新函数文本添加到它之前
    const modifiedText = text.replace(functionPattern, `${newFunctionText}\n\n$&`);

    console.log(modifiedText)
  
    return modifiedText;
  }


  //   // 新函数文本
  const newFunction = `// This is a new single line comment for the new method
  public executeNewPlotStep(parameters) {
    // New function body
  }`;
  
  const sampleText = `// This is 2222a comment for the existing function
public executeSomething() {
    // function body
}`;

const newTextWithAddedFunction = addNewFunctionAbove(sampleText, newFunction);
  
//   console.log(newTextWithAddedFunction); // 将输出包含新添加函数的文本


//   function addNewFunctionAbove(text, newFunctionText) {
//     // 正则表达式匹配第一个符合条件的函数及其前面的注释（如果有）
//     // const functionPattern = /((\/\/.*\n)|(\/\*[\s\S]*?\*\/\s*))?(public\s+execute\w*\s*\([^)]*\)\s*{[^}]*})/;

//     // const functionPattern = /((\/\/.*\n)|(\/\*[\s\S]*?\*\/\s*))?(public\s+execute\w*\s*\([^)]*\)\s*{[^}]*})/;

//     // // 替换匹配到的第一个函数及其注释，将新函数文本添加到匹配内容之前
//     // const modifiedText = text.replace(functionPattern, (match, comments, lineComment, blockComment, func) => {
//     //     console.log(match)
//     //     return `${newFunctionText}\n\t${match}`;
//     // });

//     // const matches = text.match(functionPattern);
//     // if (matches) {
//     //     console.log(matches[0]);  // 打印整个匹配内容，包括注释和函数
//     // } else {
//     //     console.log('No matching function found.');
//     // }
//     // modifiedText = text.replace(matches[0],matches[0]+newFunctionText)
//     // return modifiedText;

//         const functionPattern = /((\/\/.*\n)|(\/\*[\s\S]*?\*\/\s*))?(public\s+execute\w*\s*\([^)]*\)\s*{[^}]*})/;

//     // 使用正则表达式检索并打印匹配的内容
//     const matches = text.match(functionPattern);
//     if (matches) {
//         console.log(matches[0]);  // 打印整个匹配内容，包括注释和函数
//     } else {
//         console.log('No matching function found.');
//     }
// }

  
//   // 新函数文本
//   const newFunction = `// This is a new single line comment for the new method
//   public executeNewPlotStep(parameters) {
//     // New function body
//   }`;
  
//   // 示例文本，含有函数和注释
//   const sampleText = `// This is a comment for the existing function
//   // public executeSomething() {
//   //     // function body
//   // }`;

  
// //   在第一个匹配到的函数上面添加新函数
//   const newTextWithAddedFunction = addNewFunctionAbove(sampleText, newFunction);
  
//   console.log(newTextWithAddedFunction); // 将输出包含新添加函数的文本


//   function printMatchedFunctionAndComments(text) {
//     const functionPattern = /((\/\/.*\n)|(\/\*[\s\S]*?\*\/\s*))?(public\s+execute\w*\s*\([^)]*\)\s*{[^}]*})/;

//     // 使用正则表达式检索并打印匹配的内容
//     const matches = text.match(functionPattern);
//     if (matches) {
//         console.log(matches[0]);  // 打印整个匹配内容，包括注释和函数
//     } else {
//         console.log('No matching function found.');
//     }
// }

// // 示例代码
// const code = `// This is a comment for the existing function
// public executeSomething() {
//     // function body
// }`;

// 运行示例，并打印匹配结果
// printMatchedFunctionAndComments(code);



//   function addInterestToArray(text, newInterest) {
//     // 正则表达式匹配特定的函数及其返回的数组
//     // 注意，这个匹配较具体，针对的是你提供的数组格式和行为
//     const arrayPattern = /(public\s+listInterests\(\):\s*\[string,\s*IActionHandler\]\[\]\s*{\s*return\s*\[\s*\[Notification\.PLOT_STEP,\s*this\.executePlotStep\],)(\s*\];\s*}\s*)/;
  
//     // 替换匹配到的数组，将新的数组项添加到现有项之后
//     const modifiedText = text.replace(arrayPattern, `$1\n            ${newInterest},$2`);
  
//     return modifiedText;
//   }
  
//   // 新的数组项文本
//   const newInterest = `[Notification.Login, this.executeLogin]`;
  
//   // 示例文本，含有特定函数和返回的数组
//   const sampleFunctionText = `
//   public listInterests(): [string, IActionHandler][] {




//       return [
//           [Notification.PLOT_STEP,              this.executePlotStep],
//       ];
//   }
//   `;
  
//   // 在数组中添加新的项
//   const newTextWithAddedInterest = addInterestToArray(sampleFunctionText, newInterest);
  
//   console.log(newTextWithAddedInterest); // 将输出数组被添加新项后的函数文本