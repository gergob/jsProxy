// 06 - Using the "in" operator like "includes"

function arrayContains(array) {
    const handler = {
        has (array, value) {
            return array.includes(value);
        }
    };
    return new Proxy(array, handler);
}


// try it out
let myArr = arrayContains(['one', 'two']);

console.log('one' in myArr);    // true
console.log('three' in myArr);  // false
