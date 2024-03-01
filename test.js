Array.prototype.cpush = function (...items) {
    this.length = 0;
    this.push(...items);
  };

function observeArray(obj) {
    if (!Array.isArray(obj)) {
      throw new Error('Expected an array');
    }
    let oldLength = obj.length;
    return new Proxy(obj, {
      set: function(target, key, value) {
        console.log("tttt",target,key,value)
        target[key] = value;
        if (key === 'length' && oldLength !== value) {
          console.log(target);
          console.log(`Array length changed from ${oldLength} to ${value}`);
          oldLength = value;
        }
        return true;
      }
    });
  }
  let arr = observeArray([1, 2, 3]);
//   arr.cpush(4, 5, 6); // 将只打印一次 `Array length changed from 3 to 6`
// arr.length = 0 
arr.push(1,2,3)




// function observeArray(obj) {
//     if (!Array.isArray(obj)) {
//         throw new Error('Expected an array');
//     }
//     var oldLength = obj.length;
//     Object.defineProperty(obj, 'length', {
//         get: function() {
//             return oldLength;
//         },
//         set: function(value) {
//             console.log('Array length changed from ' + oldLength + ' to ' + value);
//             oldLength = value;
//         }
//     });
//     return obj;
// }




//   function observeArray(arr) {
//     if (!Array.isArray(arr)) {
//         throw new Error('Expected an array');
//     }

//     var arrayProto = Object.create(Array.prototype);

//     arrayProto.emptyAndPush = function (...items) {
//         this.length = 0;
//         this.push(...items);
//       };

//     ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function(method) {
//         arrayProto[method] = function() {
//             var oldLength = this.length;
//             Array.prototype[method].apply(this, arguments);
//             if (this.length !== oldLength) {
//                 console.log('Array length changed from ' + oldLength + ' to ' + this.length);
//             }
//         };
//     });

//     var observedArray = arr;
//     observedArray.__proto__ = arrayProto;
//     return observedArray;
// }
// // 










// let arr = observeArray([1, 2, 3]);
// arr.push(4, 5, 6); // 将只打印一次 `Array length changed from 3 to 6`

// arr.emptyAndPush(7,8,9)

// console.log(arr)