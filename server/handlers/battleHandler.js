'use strict';

var troopsModel = require('../gameModels/troopsModel'),
    Report = require('mongoose').model('Report'),
    originalGameData = require('../data/gameData'),
    indexConverter = require('../utilities/indexConverter');

module.exports = {
    fightHero: function (information, gameData) {
        gameData = gameData || originalGameData;

        var user = gameData.players.get(information.user.coordinates);
        var target = gameData.players.get(information.hero.coordinates);
        if (!user) {
            user = information.user;
        }

        if (!target) {
            target = information.hero;
        }

        var coef = user.experience / target.experience || 1;
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

        var newTroops = [0,0,0,0,0,0,0];

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
                win: win,
                own: true,
                enemy: target.username,
                enemyId: target._id,
                lostUnits: [],
                killedUnits: []
            },
            defender: {
                owner: target._id,
                win: !win,
                own: false,
                enemy: user.username,
                enemyId: user._id,
                lostUnits: [],
                killedUnits: []
            }
        };

        for (i = 0; i < troopsModel.length; i++) {
            if (win) {
                reports.attacker.lostUnits.push(user.troops[i] - newTroops[i]);
                reports.defender.lostUnits.push(target.troops[i]);

                reports.attacker.killedUnits.push(target.troops[i]);
                reports.defender.killedUnits.push(user.troops[i] - newTroops[i]);

                target.troops[i] = 0;
                user.troops[i] = newTroops[i];
            }
            else {
                reports.attacker.lostUnits.push(user.troops[i]);
                reports.defender.lostUnits.push(target.troops[i] - newTroops[i]);

                reports.attacker.killedUnits.push(target.troops[i] - newTroops[i]);
                reports.defender.killedUnits.push(user.troops[i]);

                target.troops[i] = newTroops[i];
                user.troops[i] = 0;
            }
        }

        // async
        Report.create(reports.attacker, function (err) {
            if (err) {
                console.log('Could not create report ' + err);
            }
        });
        Report.create(reports.defender, function (err) {
            if (err) {
                console.log('Could not create report ' + err);
                return;
            }

            if (require('../config/socket').byId[reports.defender.owner]) {
                require('../config/socket').byId[reports.defender.owner].emit('new report', {win: reports.defender.win, enemy: reports.defender.enemy});
            }
        });

        return {
            success: reports.attacker.win,
            user: user
        }
    },
    fightMonster: function (information, gameData) {
        gameData = gameData || originalGameData;

        var user = gameData.players.get(information.user.coordinates);
        if (!user) {
            user = information.user;
        }

        var monster = gameData.objects.get(indexConverter.getCoordinates(information.monster.index));
        if (!monster) {
            monster = information.monster;
        }

        var amount = monster.amount;
        var lvl = monster.level || 0;

        var monsterCost = (troopsModel[lvl].cost * amount) / (1 + (user.experience / 100));

        for (var i = user.troops.length - 1; i >= 0; i--) {
            if (monsterCost < troopsModel[lvl].cost) {
                break;
            }

            while (troopsModel[i].cost <= monsterCost && user.troops[i] > 0) {
                user.troops[i]--;
                monsterCost -= troopsModel[i].cost;
            }
        }

        var success = user.troops[0] > 0;

        if (success) {
            gameData.objects.remove(indexConverter.getCoordinates(information.monster.index));
            user.experience++;
        }

        return {
            success: success,
            user: user
        }
    }
};