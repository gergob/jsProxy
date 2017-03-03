// 08 - Validation and revocable access

// library code --------------------------------------------------------------------------------

const options = {},
    optionsRevocable = Proxy.revocable(options, {
        set (obj, prop, value) {
            if (prop === 'name') {
                if (typeof value !== 'string' || value === '') {
                    throw new TypeError('"name" option should be a non-emtpy string');
                }
            } else if (prop === 'age') {
                if (typeof value !== 'number' || value < 0 || value > 200) {
                    throw new TypeError('"age" option should be a number between 0 and 200');
                }
            } else {
                throw new TypeError('The only valid options are "name" and "age"');
            }
            Reflect.set(obj, prop, value);
        }
    });
    

// sending the validated options proxy to the client
clientSetOptionsEventHandler(optionsRevocable.proxy);
// options arrived
console.log(options);
// revoking the client's access
optionsRevocable.revoke();
// simulating client actions afterwards
clientSometimeLater();


// client code --------------------------------------------------------------------------------

var globalOpts;

function clientSetOptionsEventHandler(opts) {
    opts.name = 'Bob';
    opts.age = 25;
    try {
        opts.age = 'old';   // TypeError: "age" option should be a number between 0 and 200
    } catch (ex) {
        console.error(ex);
    }
    try {
        opts.height = 182;  // TypeError: The only valid options are "name" and "age"
    } catch (ex) {
        console.error(ex);
    }
    // keeping the reference for stupid/harmful reasons
    globalOpts = opts;
}

function clientSometimeLater() {
    // trying to change it outside of the event handler
    try {
        globalOpts.name = 'Not Bob';  // TypeError: Cannot perform 'set' on a proxy that has been revoked
    } catch (ex) {
        console.error(ex);
    }
}