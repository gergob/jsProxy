// 02 - Hiding private properties

function privateProps(obj, filterFunc) {
	const handler = {
    	get (obj, prop) {
			return filterFunc(prop) ? undefined : Reflect.get(obj, prop);
        },
    	set (obj, prop, value) {
	        if (filterFunc(prop)) {
            	throw new TypeError(`Can't set property "${prop}"`);
            }
			return Reflect.set(obj, prop, value);
        },
        has (obj, prop) {
        	return filterFunc(prop) ? false : Reflect.has(obj, prop);
        },
        ownKeys (obj) {
        	return Reflect.ownKeys(obj).filter(prop => !filterFunc(prop));
        },
        getOwnPropertyDescriptor (obj, prop) {
        	return filterFunc(prop) ? undefined : Reflect.getOwnPropertyDescriptor(obj, prop);
        }        
    };
	return new Proxy(obj, handler);
}

const myObj = privateProps({ _private: 'secret', public: 'hello' }, prop => prop.indexOf('_') === 0);


// trying it out
console.log(myObj);								 // chrome somehow logs the private prop, node doesn't
console.log(JSON.stringify(myObj));				 // {"public":"hello"}
console.log(myObj._private);					 // undefined
console.log('_private' in myObj);				 // false
console.log(Object.keys(myObj));				 // ['public']
for (let prop in myObj) { console.log(prop); }   // public 
try {
    myObj._private = 'chicken attack';	         // TypeError: Can't set property "_private" 	    
} catch(ex) {
    console.error(ex);
}
