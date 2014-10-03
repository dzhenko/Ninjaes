'use strict';

var express = require('express'),
    stylus = require('stylus'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    favicon = require('serve-favicon'),
    methodOverride = require('method-override'),
    passport = require('passport');

module.exports = function(app, config) {
    app.set('port', process.env.PORT || config.port);

    app.set('views', config.rootPath + '/server/views');
    app.set('view engine', 'jade');

    app.use(favicon(config.rootPath + '/public/img/favicon.png'));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(methodOverride('X-HTTP-Method-Override'));

    app.use(session({ secret: 'heroes' }));
    app.use(cookieParser());

    app.use(stylus.middleware({
        src: config.rootPath + '/public',
        compile: function (str, path) {
            return stylus(str).set('filename', path);
        }
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(express.static(config.rootPath + '/public'));
};