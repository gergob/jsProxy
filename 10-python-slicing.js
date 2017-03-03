// 10 - Python-like array slicing

function pythonIndex(array) {

    function parse(value, defaultValue, resolveNegative) {
        if (value === undefined || isNaN(value)) {
            value = defaultValue;
        } else if (resolveNegative && value < 0) {
            value += array.length;
        }
        return value;
    }
    
    function slice(prop) {
        if (typeof prop === 'string' && prop.match(/^[+-\d:]+$/)) {
            // no ':', return a single item
            if (prop.indexOf(':') === -1) {
                let index = parse(parseInt(prop, 10), 0, true);
                console.log(prop, '\t\t', array[index]);
                return array[index];
            }                
            // otherwise: parse the slice string
            let [start, end, step] = prop.split(':').map(part => parseInt(part, 10));
            step = parse(step, 1, false);
            if (step === 0) {
                throw new RangeError('Step can\'t be zero');
            }
            if (step > 0) {
                start = parse(start, 0, true);
                end = parse(end, array.length, true);
            } else {
                start = parse(start, array.length - 1, true);
                end = parse(end, -1, true);
            }
            // slicing
            let result = [];
            for (let i = start; start <= end ? i < end : i > end; i += step) {
                result.push(array[i]);
            }
            console.log(prop, '\t', JSON.stringify(result));
            return result;
        }
    }

    const handler = {
        get (arr, prop) {
            return slice(prop) || Reflect.get(array, prop);
        }
    };
    return new Proxy(array, handler);
}


// try it out
let values = [0,1,2,3,4,5,6,7,8,9],
    pyValues = pythonIndex(values);

console.log(JSON.stringify(values));

pyValues['-1'];      // 9
pyValues['0:3'];     // [0,1,2]    
pyValues['8:5:-1'];  // [8,7,6]
pyValues['-8::-1'];  // [2,1,0]
pyValues['::-1'];    // [9,8,7,6,5,4,3,2,1,0]
pyValues['4::2'];    // [4,6,8]

// and normal indexing still works
pyValues[3];         // 3
