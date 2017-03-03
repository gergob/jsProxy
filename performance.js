// Performance measurements

const COUNT = 1000000;

function measure(obj, id) {
    const element = document.getElementById(id),
        started = performance.now();
    for (let i = 0; i < COUNT; i += 1) {
        obj[i] = i;
        obj[i];
        i in obj;
        Object.getOwnPropertyDescriptor(obj, i);
        delete obj[i];  
    }
    element.innerText = Math.round(performance.now() - started);
}

const reflectHandler = {
    get: (...args) => Reflect.get(...args),
    set: (...args) => Reflect.set(...args),
    deleteProperty: (...args) => Reflect.deleteProperty(...args),
    ownKeys: (...args) => Reflect.ownKeys(...args),
    has: (...args) => Reflect.has(...args),
    defineProperty: (...args) => Reflect.defineProperty(...args),
    getOwnPropertyDescriptor: (...args) => Reflect.getOwnPropertyDescriptor(...args)
};

const dynReflectHandler = new Proxy({}, {
    get (obj, trap) {
        return function (...args) {
            return Reflect[trap](...args);
        };
    }
});

// run the measurements async
window.setTimeout(function run() {
    measure({}, 'object');
    measure(new Proxy({}, {}), 'noop');
    measure(new Proxy({}, reflectHandler), 'reflect');
    measure(new Proxy({}, dynReflectHandler), 'dynamic');    
}, 0);
