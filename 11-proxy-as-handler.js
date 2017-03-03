// 11 - Proxy as a proxy handler

const logHandler = {
        get (obj, trap) {
            return function (...args) {
                console.log(`${trap}`, args.slice(1));
                const result = Reflect[trap](...args);
                console.log('  result:', JSON.stringify(result));
                console.log('  value:', JSON.stringify(args[0]));
            };
        }
    },
    logProxy = new Proxy({}, logHandler);


// try it out
const myObj = new Proxy({a: 1, b: 2}, logProxy);

myObj.a = 3;      // set(a,3), getOwnPropertyDescriptor(a), defineProperty(a,3)
delete myObj.b;   // deleteProperty(b)
