'use strict';

var mongoose = require('mongoose');

var mapSchema = mongoose.Schema({
    field: mongoose.Schema.Types.Mixed
});

var Map = mongoose.model('Map', mapSchema);

module.exports = {
    // nothing yet
};

// 0 - empty
// 1 - gold
// 2- monster
// 3-hero
// 4-castle