'use strict';

var mongoose = require('mongoose');

var castleSchema = mongoose.Schema({
    owner: { type: mongoose.Schema.ObjectId, ref: 'User' },
    coordinates: {
        x: Number,
        y: Number
    },
    buildings: {
        hall: Number,
        castle: Number,
        troops: [Number]
    },
    troopsForSale: [Number],
    troops: [Number]
});

module.exports = mongoose.model('Castle', castleSchema);