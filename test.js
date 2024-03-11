// Array.prototype.cpush = function (...items) {
//     this.splice(0, this.length);
//     this.push(...items);

    
//   };

// function observeArray(obj) {
//     if (!Array.isArray(obj)) {
//       throw new Error('Expected an array');
//     }
//     let oldLength = obj.length;
//     return new Proxy(obj, {
//       set: function(target, key, value) {
//         console.log("tttt",target,key,value)
//         target[key] = value;
//         if (key === 'length' && oldLength !== value) {
          
//           console.log(`Array length changed from ${oldLength} to ${value}`);
//           oldLength = value;
//         }
//         return true;
//       }
//     });
//   }
//   let arr = observeArray([1, 2, 3]);
//   arr.cpush(4, 5, 6); // 将只打印一次 `Array length changed from 3 to 6`
// // arr.length = 0 
// arr.push(1,2,3)




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




function observeArray(arr) {
    if (!Array.isArray(arr)) {
        throw new Error('Expected an array');
    }

    const onChange = () => console.log(arr);

    var arrayProto = Object.create(Array.prototype);

    arrayProto.fill = function (...items) {
        this.length = 0;
        this.push(...items);
    };
    arrayProto.clear = function (...items) {
        this.length = 0;
        onChange()
    };
    ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function(method) {
        arrayProto[method] = function() {
            var oldLength = this.length;
            Array.prototype[method].apply(this, arguments);
            if (this.length !== oldLength) {
                onChange()
            }
        };
    });

    var observedArray = arr;
    observedArray['__proto__'] = arrayProto;

    arr.forEach((item, index) => {
        if (item !== null && typeof item === 'object') {
          arr[index] = this.observe(item);
        }
    });

    return observedArray;
}
// let arr = observeArray([1,2,3])

// arr.fill(7,8,9)

// arr[2]=3

// arr.clear()
// // console.log(arr)




function observe(data) {
    if (!data || typeof data !== 'object') return data;
    if (Array.isArray(data)) return data.map(item => observe(item));

    return new Proxy(data, {
        set(target, property, value) {
            // When value is a object, we need to make it observable:
            target[property] = observe(value);
            // When data changes, notify all listeners
            // self._listeners.forEach(listener => listener());
            console.log(data)
            return true;
        },

        get(target, property) {
            const result = Reflect.get(target, property);
            if (result === target) {
                return self;
            }
            return result;
        }
    });
}


let arr = observe([1,2,3])
arr.push(2)
arr[1]=4