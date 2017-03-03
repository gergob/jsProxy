// 00 - Basic example of using a Proxy

const values = {a:1, b:2},
    handler = {
        get (obj, prop) {
            const value = obj[prop];
            console.log(`GET ${prop} = ${value}`);
            return value;
        }
    },
    proxy = new Proxy(values, handler);


// trying it out
console.log(proxy.a); // GET a = 1
                      // 1
console.log(proxy.c); // GET c = undefined
                      // undefined
