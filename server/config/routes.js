'use strict';

var auth = require('./auth'),
    controllers = require('../controllers');

module.exports = function(app, config) {
    app.route('/api/users')
        .get(auth.isAuthenticated, controllers.users.getAllUsers)
        .post(controllers.users.createUser)
        .put(auth.isAuthenticated, controllers.users.updateUser);

    app.post('/login', auth.login);
    app.post('/logout', auth.logout);


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