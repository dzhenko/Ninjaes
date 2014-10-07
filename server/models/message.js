'use strict';
var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
    owner: { type: mongoose.Schema.ObjectId, ref: 'User' },
    fromID : { type: mongoose.Schema.ObjectId, ref: 'User' },
    from: String,
    created: { type: Date, default: Date.now },
    text: String
});

var Message = mongoose.model('Message', messageSchema);

// For development
module.exports = {
    // nothing yet
};
