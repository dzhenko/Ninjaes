'use strict';

var UserModel = require('../models/user'),
    CastleModel = require('../models/castle'),
    GameObjectModel = require('../models/gameObject'),
    MessageModel = require('../models/message'),
    ReportModel = require('../models/report');

module.exports = {
    User : UserModel,
    Castle : CastleModel,
    GameObject: GameObjectModel,
    Message: MessageModel,
    Report: ReportModel
};