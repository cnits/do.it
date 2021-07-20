/**
 * @description Handle file's manipulations
 */
'use strict';
const fs = require('fs'),
    path = require('path');

const
    stream = () => {

    },
    read = uri => {
        return fs.readFileSync(uri, { encoding: 'utf8' });
    },
    readAsync = uri => {
        return new Promise(resolve => {
            fs.readFile(uri, { encoding: 'utf8' }, (err, data) => {
                if (err) resolve({ msg: err });
                else resolve(data);
            });
        });
    },
    write = (uri, buffer) => {
        fs.writeFileSync(uri, buffer);
    };

module.exports = { stream, read, readAsync, write };