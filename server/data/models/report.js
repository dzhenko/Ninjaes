'use strict';
var mongoose = require('mongoose');

var reportSchema = mongoose.Schema({
    owner: { type: mongoose.Schema.ObjectId, ref: 'User' },
    created: { type: Date, default: Date.now },
    win: Boolean,
    own: Boolean,
    enemyID : { type: mongoose.Schema.ObjectId, ref: 'User' },
    enemy : String,
    lostUnits: [Number],
    killedUnits: [Number]
});

module.exports = mongoose.model('Report', reportSchema);
