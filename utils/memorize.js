/**
 * Define a memory function to cache data
 */
module.exports = (fn) => {
    return function () {
        const args = Array.prototype.slice.call(arguments),
            key = JSON.stringify(args);
        fn.cache = fn.cache || {};

        return fn.cache[key] ?
            fn.cache[key] :
            fn.cache[key] = fn.apply(this, args);
    }
}