'use strict';

var troopsModel = require('../gameModels/troopsModel'),
    Report = require('mongoose').model('Report'),
    map = require('../handlers/mapHandler'),
    indexConverter = require('../utilities/indexConverter');

module.exports = {
    // test with objects user.experience = 999 ; user.troops = [1,2,3,4,5,6,7] target same
    fightHero : function(information) {
        var user = map.getUser(information.user.coordinates);
        var target = map.getUser(information.hero);
        if (!user || !target) {
            console.log('can not get user or hero at fight hero ctrl');
            return;
        }

        var coef = user.experience / target.experience;
        var i;

        var userCost = 0;
        var targetCost = 0;

        for (i = 0; i < troopsModel.length; i++) {
            var unitCost = troopsModel[i].cost;
            userCost += user.troops[i] * unitCost;
            targetCost += target.troops[i] * unitCost;
        }

        var difference = (coef * userCost) - targetCost;
        var win = difference > 0;

        if (!win) {
            difference *= -1;
        }

        var troopsToWorkWith = win ? user.troops : target.troops;

        var newTroops = new Array(7);

        for (i = troopsToWorkWith.length - 1; i >= 0; i--) {
            if (difference < troopsModel[0].cost) {
                break;
            }

            while (troopsModel[i].cost <= difference) {
                newTroops[i]++;
                difference -= troopsModel[i].cost;
            }
        }

        var reports = {
            attacker: {
                owner: user._id,
                win : win,
                own : true,
                enemy: target.username,
                enemyId: target._id,
                lostUnits: [],
                killedUnits: []
            },
            defender: {
                owner: target._id,
                win : !win,
                own : false,
                enemy: user.username,
                enemyId: user._id,
                lostUnits: [],
                killedUnits: []
            }
        };

        for (i = 0; i < troopsModel.length; i++) {
            if (win) {
                reports[0].lostUnits.push(user.troops[i] - newTroops[i]);
                reports[1].lostUnits.push(target.troops[i]);

                reports[0].killedUnits.push(target.troops[i]);
                reports[1].killedUnits.push(user.troops[i] - newTroops[i]);

                target.troops[i] = 0;
                user.troops[i] = newTroops[i];
            }
            else {
                reports[0].lostUnits.push(user.troops[i]);
                reports[1].lostUnits.push(target.troops[i] - newTroops[i]);

                reports[0].killedUnits.push(target.troops[i] - newTroops[i]);
                reports[1].killedUnits.push(user.troops[i]);

                target.troops[i] = newTroops[i];
                user.troops[i] = 0;
            }
        }

        // async
        Report.create(reports.attacker, function(err) {
            if (err) {
                console.log('Could not create report ' + err);
            }
        });
        Report.create(reports.defender, function(err) {
            if (err) {
                console.log('Could not create report ' + err);
                return;
            }

            if (require('../config/socket').byId[reports.defender.owner]) {
                require('../config/socket').byId[reports.defender.owner].emit('new report', {win : reports.defender.win, enemy:reports.defender.enemy});
            }
        });

        return {
            success: reports.attacker.win,
            user : user
        }
    },
    // test with objects user.experience = 999 ; user.troops = [1,2,3,4,5,6,7] lvl = 0 ! amount = 124124124124
    fightMonster: function(information) {
        var user = map.getUser(information.user.coordinates);
        if (!user) {
            return {
                success: false
            }
        }

        var monster = map.getPosition(indexConverter.getCoordinates(information.monster));
        if (!monster) {
            return {
                success: false
            }
        }

        var amount = monster.amount;
        var lvl = monster.level || 0;

        var monsterCost = (troopsModel[lvl].cost * amount) / (1 + user.experience);

        for (var i = user.troops.length - 1; i >= 0; i--) {
            if (monsterCost < troopsModel[0].cost) {
                break;
            }

            while (troopsModel[i].cost <= monsterCost && user.troops[i] > 0) {
                user.troops[i]--;
                monsterCost -= troopsModel[i].cost;
            }
        }

        var success = user.troops[0] > 0;

        if (success) {
            map.removePosition(indexConverter.getCoordinates(information.monster));
            user.experience++;
        }

        return {
            success: success,
            user : user
        }
    }
};