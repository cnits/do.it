/**
 * @description Handle file's manipulations
 */
'use strict';
const fs = require('fs'),
    path = require('path');

const
    stream = () => {

    },
    read = (uri) => {
        return fs.readFileSync(uri, { encoding: 'utf8' });
    },
    readAsync = () => {

    },
    write = (uri, buffer) => {
        fs.writeFileSync(uri, buffer);
    };

module.exports = { stream, read, readAsync, write };