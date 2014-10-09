'use strict';

var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
    development: {
        rootPath: rootPath,
        db: 'mongodb://localhost:27017/ninjaes',
        port: process.env.PORT || 9999
    },
    production: {
        rootPath: rootPath,
        db: 'mongodb://admin:qwerty@ds063929.mongolab.com:63929/ninjaes',
        port: process.env.PORT || 9999
    }
};