'use strict';
var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
    owner: { type: mongoose.Schema.ObjectId, ref: 'User' },
    fromID : { type: mongoose.Schema.ObjectId, ref: 'User' },
    from: String,
    created: { type: Date, default: Date.now },
    text: String
});
// For development
module.exports = mongoose.model('Message', messageSchema);
