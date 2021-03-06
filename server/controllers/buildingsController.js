var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Castle = mongoose.model('Castle'),
    buildingsModel = require('../gameModels/buildingsModel'),
    gameData = require('../data/gameData');

module.exports = {
    build: function (req, res) {
        Castle.findOne({owner: req.user._id.toString()}, function (err, origCastle) {
            if (err) {
                console.log('Could not find castle' + err);
                return;
            }

            var user = gameData.players.get(req.user.coordinates);
            var castle = gameData.castles.get(origCastle.coordinates);

            if (!user) {
                user = req.user;
            }
            if (!castle) {
                castle = origCastle;
            }

            var success = false;

            if (req.body.building === 'troops') {
                if (!castle.buildings.troops[req.body.index]) {
                    var troopsBuildingCost = buildingsModel.troops[req.body.index].cost;

                    if (user.gold >= troopsBuildingCost) {
                        user.gold -= troopsBuildingCost;
                        castle.buildings.troops[req.body.index] = 1;
                        success = true;
                    }
                }
            }
            else if (castle.buildings[req.body.building] < 3) {
                var hallCastleCost = buildingsModel[req.body.building].cost[castle.buildings[req.body.building] + 1];

                if (user.gold >= hallCastleCost) {
                    user.gold -= hallCastleCost;
                    castle.buildings[req.body.building]++;
                    success = true;
                }
            }

            res.send({
                success: success,
                castle : castle
            })
        })
    }
};