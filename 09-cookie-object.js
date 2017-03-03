// 09 - Cookie object

function cookieObject() {
    // load current cookies
    const cookies = {}; 
    document.cookie.split(';').forEach(item => { 
        const i = item.indexOf('='),
              key = item.substr(0, i).trim(),
              value = item.substr(i + 1);
        cookies[key] = value;
    });
    // proxy to persist props to cookies
    const handler = {
        set (obj, prop, value) {
            document.cookie = `${prop}=${value}`;
            Reflect.set(obj, prop, value);
        },
        deleteProperty (obj, prop) {
            document.cookie = `${prop}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
            return Reflect.deleteProperty(obj, prop);
        }
    };
    return new Proxy(cookies, handler);
}


// simulate previously saved/missing cookies (create one & two, delete three)
document.cookie = 'ONE=1';
document.cookie = 'TWO=234';
document.cookie = 'THREE=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

// try the cookies proxy
const myCookies = cookieObject();
console.log('loaded:', myCookies);  // loaded: Proxy {ONE: "1", TWO: "234"}

// adding a new value
myCookies.THREE = 'hello';
console.log(document.cookie);  // ONE=1; TWO=234; THREE=hello

// removing a value
delete myCookies.TWO;
console.log(document.cookie);  // ONE=1; THREE=hello
