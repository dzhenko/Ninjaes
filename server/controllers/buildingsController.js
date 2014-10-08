var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Castle = mongoose.model('Castle'),
    buildingsModel = require('../gameModels/buildingsModel'),
    map = require('../handlers/mapHandler');

module.exports = {
    build: function (req, res) {
        Castle.findOne({owner: req.user._id.toString()}, function (err, origCastle) {
            if (err) {
                console.log('Could not find castle' + err);
                return;
            }

            var user = map.getUser(req.user.coordinates);
            var castle = map.getCastle(origCastle.coordinates);

            if (!user) {
                console.log('!!! Can not find user from map dict');
                return;
            }
            if (!castle) {
                console.log('!!! Can not find castle from map dict');
                return;
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