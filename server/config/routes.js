'use strict';

var auth = require('./auth'),
    controllers = require('../controllers');

module.exports = function(app, config) {
    app.post('/login', auth.login);
    app.post('/logout', auth.logout);

    app.route('/api/users')
        .get(auth.isAuthenticated, controllers.users.getAllUsers)
        .post(controllers.users.createUser)
        .put(auth.isAuthenticated, controllers.users.updateUser);

    app.route('/api/game-reports')
        .get(auth.isAuthenticated, controllers.reports.getAllReports)
        .put(auth.isAuthenticated, controllers.reports.removeReport);

    app.route('/api/game-messages')
        .get(auth.isAuthenticated, controllers.messages.getAllMessages)
        .post(auth.isAuthenticated, controllers.messages.createMessage)
        .put(auth.isAuthenticated, controllers.messages.removeMessage);

    //req.params.value
    app.get('/api/info/user-id-by-name/:name',auth.isAuthenticated, controllers.info.userIdByName);
    app.get('/api/info/user-name-by-id/:id',auth.isAuthenticated, controllers.info.userNameById);
    app.get('/api/info/top-scores', controllers.info.topScores);

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