// 05 - Cache with property specific TTL

function cacheObj(ttlFunc) {
	const obj = {},
        handler = {
            get (obj, prop) {
                const data = Reflect.get(obj, prop);
                if (data) {
                    return data.value;
                }
            },
            set (obj, prop, value) {
                const data = {
                    ttl: ttlFunc(prop),
                    value: value
                };
                return Reflect.set(obj, prop, data);
            }
        };
    // decrease TTL and remove prop when it reaches zero
    function invalidate() {
  		for (let prop in obj) {
        	obj[prop].ttl -= 1;
            if (obj[prop].ttl <= 0) {
            	delete obj[prop];
            }
        }
    }
    window.setInterval(invalidate, 1000);
	return new Proxy(obj, handler);
}


// try it out
const cache = cacheObj(prop => 5);

function log() {
    console.log(`${sec}s: a = ${cache.a}`);
}

console.clear();
cache.a = 123;
for (let sec = 0; sec < 6; sec += 1) {
	window.setTimeout(log, sec * 1000);
}
