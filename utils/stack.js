/**
 * Define Stack - a data structure - in javascript
 */
'use strict';
module.exports = class Stack {
    constructor() {
        this.data = [];
        this.len = 0;
    }
    pop() {
        if (this.len) {
            --this.len;
            const item = this.data.splice(this.len, 1);
            return item[0];
        }
        return null;
    }
    push(item) {
        this.data.push(item);
        this.len++;
    }
    toArray() {
        return this.data;
    }
    isEmpty() {
        return this.len || !this.data.length;
    }
    release() {
        this.data = [];
        this.len = 0;
    }
}