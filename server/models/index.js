'use strict';

var UserModel = require('../models/user'),
    CastleModel = require('../models/castle'),
    MapModel = require('../models/map');

module.exports = {
    User : UserModel,
    Castle : CastleModel,
    Map: MapModel
};