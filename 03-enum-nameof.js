// 03 - A better enum (with a nameOf function)

function makeEnum(name, values) {
	function nameOf(value) {	
    	let keys = Object.keys(this);
        for (let index = 0; index < keys.length; index += 1) {
        	let key = keys[index];
        	if (this[key] === value) {
            	return `${name}.${key}`;
            }
        }        
    }
	const handler = {
    	set (obj, prop, value) {
        	throw new TypeError('Enum is read only');
        },
    	get (obj, prop) {
        	if (prop === 'nameOf') {
            	return nameOf.bind(obj);
            }            
        	if (!(prop in obj)) {
            	throw new ReferenceError(`Unknown enum key "${prop}"`);
            }
            return Reflect.get(obj, prop);
        },
        deleteProperty (obj, prop) {
        	throw new TypeError('Enum is read only');
        }
    };
    return new Proxy(values, handler);
}

const someValue = 3;


// using a plain object as enum
console.log('Object');
const myObj = {ONE: 1, TWO: 2};
console.log(myObj.ONE);       // 1 - ok
console.log(myObj.TWWO);      // undefined - typos can lead to silent errors
if (myObj.ONE = someValue) {  // this mistyped condition evaluates to true
	console.log(myObj.ONE);   // 3 - and changes our enum too
}
delete myObj.ONE;			  // deleted


// using a freezed object can prevent by Object.freeze)
console.log('Freezed object');
const myFrObj = Object.freeze({ONE: 1, TWO: 2});
console.log(myFrObj.ONE);       // 1 - ok
console.log(myFrObj.TWWO);      // undefined - typos can lead to silent errors
if (myFrObj.ONE = someValue) {  // still evaluates to true
	console.log(myFrObj.ONE);   // 1 - but at least the modification doesn't happen
}
delete myFrObj.ONE;				// no deletion, but no error either


// using a proxy as enum
console.log('Proxy');
const MyEnum = makeEnum('MyEnum', {ONE: 1, TWO: 2});
console.log(MyEnum.ONE);       // 1 - ok
try {
    console.log(MyEnum.TWWO);      // ReferenceError - typos catched immediately  
} catch(ex) {
    console.error(ex);
}
try {
    if (MyEnum.ONE = someValue) {  // TypeError - can't be modified, doesn't evaluate, catched immediately 
        console.log(MyEnum.ONE);   // (this line never executes)
    }
} catch(ex) {
    console.error(ex);
}
try {
    delete MyEnum.ONE;			   // TypeError
} catch(ex) {
    console.error(ex);
}
// trying out nameOf
console.log('nameOf' in MyEnum);         // false - hidden, but accessible
console.log(MyEnum.nameOf(MyEnum.ONE));  // MyEnum.ONE
console.log(MyEnum.nameOf(1));           // MyEnum.ONE

