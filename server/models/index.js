'use strict';

var UserModel = require('../models/user'),
    CastleModel = require('../models/castle'),
    GameObjectModel = require('../models/gameObject');

module.exports = {
    User : UserModel,
    Castle : CastleModel,
    GameObject: GameObjectModel
};