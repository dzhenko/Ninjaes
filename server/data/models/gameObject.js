'use strict';

var mongoose = require('mongoose');

var gameObjectSchema = mongoose.Schema({
    index : Number,
    type: Number,
    amount: Number,
    obj: {}
});

module.exports = mongoose.model('GameObject', gameObjectSchema);