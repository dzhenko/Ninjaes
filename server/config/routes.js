'use strict';

var auth = require('./auth'),
    sampleController = require('../controllers/sampleController');

module.exports = function(app, config) {
    // try with postman - http://localhost:9999/sample will enter this route
    app.get('/sample', sampleController);

    // this returns the partial name - angular requests them as partialUrl
    app.get('/partials/:partialArea/:partialName', function (req, res) {
        res.render(config.rootPath + '/public/app/' + req.params.partialArea+ '/' + req.params.partialName);
    });

    // any undefined api request is forbidden
    app.get('/api/*', function(req, res) {
        res.render('index');
        res.status(404);
        res.end();
    });

    // in all cases return and render index
    app.get('*', function (req, res) {
        res.render('index', {currentUser: req.user});
    });
};