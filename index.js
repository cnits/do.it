/**
 * 
 */
const memorize = require('./utils/memorize');

function sqrt(num) {
    return Math.sqrt(num);
}

const abc = memorize(sqrt);

console.log(1111, abc(3));
console.log(222, abc(4));
console.log(3333, abc(3));
