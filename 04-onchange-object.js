// 04 - OnChange event for objects and arrays

function trackChange(obj, onChange) {
	const handler = {
    	set (obj, prop, value) {
        	const oldVal = obj[prop];
            Reflect.set(obj, prop, value);
            onChange(obj, prop, oldVal, value);
        },
        deleteProperty (obj, prop) {
            const oldVal = obj[prop];
            Reflect.deleteProperty(obj, prop);
        	onChange(obj, prop, oldVal, undefined);
        }
    };
    return new Proxy(obj, handler);
}


// trying it out on an object
let myObj = trackChange({a: 1, b: 2}, function (obj, prop, oldVal, newVal) {
	console.log(`myObj.${prop} changed from ${oldVal} to ${newVal}`);
});

myObj.a = 5;     // myObj.a changed from 1 to 5
delete myObj.b;  // myObj.b changed from 2 to undefined
myObj.c = 6;     // myObj.c changed from undefined to 6


// trying it out on an array
let myArr = trackChange([1,2,3], function (obj, prop, oldVal, newVal) {
    let propFormat = isNaN(parseInt(prop)) ? `.${prop}` : `[${prop}]`,
        arraySum = myArr.reduce((a,b) => a + b);
	console.log(`myArr${propFormat} changed from ${oldVal} to ${newVal}`);
    console.log(`  sum [${myArr}] = ${arraySum}`);
});

myArr[0] = 4;      // myArr[0] changed from 1 to 4         
                   //   sum [4,2,3] = 9
delete myArr[2];   // myArr[2] changed from 3 to undefined                
                   //   sum [4,2,] = 6
myArr.length = 1;  // myArr.length changed from 3 to 1                
                   //   sum [4] = 4
