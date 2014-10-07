'use strict';

var env = process.env.NODE_ENV || 'production'; // 'development'; - set if you want local Db
var config = require('./server/config/config')[env];

var express = require('express');

var app = express();
var server = require('http').Server(app);

require('./server/config/express')(app, config);
require('./server/config/mongoose')(config);
require('./server/config/passport')();
require('./server/config/routes')(app, config);

require('./server/config/socket').config(server);

server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});