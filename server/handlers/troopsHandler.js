'use strict';

var troopsModel = require('../gameModels/troopsModel'),
    map = require('../handlers/mapHandler');

module.exports = {
    buyTroops : function(information) {
        if (!information || !information.request || !information.user || !information.castle) {
            return {
                success : false
            }
        }

        var castle = map.getCastle(information.castle.coordinates);
        if (!castle) {
            castle = information.castle;
        }

        var user = map.getUser(information.user.coordinates);
        if (!user) {
            user = information.user;
        }

        if (castle.troopsForSale[information.request.index] < information.request.amount) {
            return {
                success : false
            }
        }

        var cost = troopsModel[information.request.index].cost * information.request.amount;

        if (cost <= 0) {
            return {
                success : false
            }
        }

        if (user.gold < cost) {
            return {
                success : false
            }
        }

        castle.troopsForSale[information.request.index] -= information.request.amount;
        user.troops[information.request.index] += information.request.amount;
        user.gold -= cost;

        return {
            success : true,
            user : user,
            castle : castle
        }
    }
};