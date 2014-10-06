'use strict';

var mongoose = require('mongoose');

var gameObjectSchema = mongoose.Schema({
    index : Number,
    type: Number,
    amount: Number,
    obj: {}
});

var GameObject = mongoose.model('GameObject', gameObjectSchema);

module.exports = {
    // nothing yet
};

// 0 - empty - undefined ?
// 1 - gold
// 2- monster
// 3-hero
// 4-castle