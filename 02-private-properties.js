// 02 - Hiding private properties

function privateProps(obj, filterFunc) {
    const handler = {
        get (obj, prop) {
            if (!filterFunc(prop)) {
                let value = Reflect.get(obj, prop);
                // auto-bind the methods to the original object, so they will have unrestricted access to it via 'this'.
                if (typeof value === 'function') {
                    value = value.bind(obj);
                }
                return value;
            }
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

// trying it out
function filterFunc(prop) {
    return prop.indexOf('_') === 0;
}

const myObj = {
        _private: 'secret',
        public: 'hello',
        method: function () {
            console.log(this._private);
        }
    },
    myProxy = privateProps(myObj, propFilter);

console.log(myProxy);                               // chrome somehow logs the private prop, node doesn't
console.log(JSON.stringify(myProxy));               // {"public":"hello"}
console.log(myProxy._private);                      // undefined - not accessible from outside
myProxy.method();                                   // secret - accessible from methods
console.log('_private' in myProxy);                 // false
console.log(Object.keys(myProxy));                  // ["public", "method"]
for (let prop in myProxy) { console.log(prop); }    // public, method
try {
    myProxy._private = 'chicken attack';            // TypeError: Can't set property "_private"
} catch(ex) {
    console.error(ex);
}
