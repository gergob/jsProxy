// 07 - Singleton pattern

// makes a singleton proxy for a constructor function
function makeSingleton(func) {
    let instance,
        handler = {
            construct: function (target, args) {
                if (!instance) {
                    instance = new func();
                }
                return instance;
            }
        };
    return new Proxy(func, handler);
}


// we will try it out on this constructor
function Test() {
    this.value = 0;
}

// normal construction
const t1 = new Test(),
    t2 = new Test();
t1.value = 123;
console.log('Normal:', t2.value);  // 0 - because t1 and t2 are separate instances

// using Proxy to trap construction, forcing singleton behaviour
const TestSingleton = makeSingleton(Test),
    s1 = new TestSingleton(),
    s2 = new TestSingleton();
s1.value = 123;
console.log('Singleton:', s2.value);  // 123 - bcause s1 and s2 is the same instance
