'use strict';

/*globals describe, it*/

var  troopsHandler = require('../handlers/troopsHandler'),
    expect = require('chai').expect;

describe('Check', function() {

    it('if handler returns false when information is an empty object', function() {
        var emptyInformationObj = {};
        var actual = troopsHandler.buyTroops(emptyInformationObj).success;

        expect(actual).to.equal(false);
    });

    it('if handler returns false when information has no request property', function() {
        var informationObjWithoutRequestProp = {  user: { gold: 25000, troops: [10, 15, 2, 1, 3, 4, 0]}, castle: {troopsForSale: [100, 20, 10, 30, 8, 2]}};
        var actual = troopsHandler.buyTroops(informationObjWithoutRequestProp).success;

        expect(actual).to.equal(false);
    });

    it('if handler returns false when information has no user property', function(){
        var informationObjWithoutUserProp = { request: { index: 1, amount: 5}, castle: {troopsForSale: [100, 20, 10, 30, 8, 2]}};
        var actual = troopsHandler.buyTroops(informationObjWithoutUserProp).success;

        expect(actual).to.equal(false);
    });

    it('if handler returns false when information has no castle property', function() {
        var informationWithoutCastleProp = { request: { index: 1, amount: 5}, user: { gold: 25000, troops: [10, 15, 2, 1, 3, 4, 0]}};
        var actual = troopsHandler.buyTroops(informationWithoutCastleProp).success;

        expect(actual).to.equal(false);
    });

    it('if handler returns false when available troops for sale in castle are less than the requested amount', function() {
        var informationWithCastleTroopsLessThanRequestedAmount = { request: { index: 1, amount: 50}, user: { gold: 25000, troops: [10, 15, 2, 1, 3, 4, 0]}, castle: {troopsForSale: [10, 20, 10, 30, 8, 2]}};
        var actual = troopsHandler.buyTroops(informationWithCastleTroopsLessThanRequestedAmount).success;

        expect(actual).to.equal(false);
    });

    it('if handler returns false when user does not have enough money to pay for the units he wants to buy', function() {
        var information = { request: { index: 1, amount: 2}, user: { gold: 250, troops: [10, 15, 2, 1, 3, 4, 0] }, castle: { troopsForSale: [100, 20, 10, 30, 8, 2] }};

        var actual = troopsHandler.buyTroops(information).success;

        expect(actual).to.equal(false);
    });

    it('if handler sets properly the amount of troops for sale left in the castle after user buys certain amount', function(){
        var information = { request: { index: 1, amount: 2}, user: { gold: 25000, troops: [10, 15, 2, 1, 3, 4, 0] }, castle: { troopsForSale: [100, 20, 10, 30, 8, 2] }};

        var expected = information.castle.troopsForSale[information.request.index] - information.request.amount;

        var result = troopsHandler.buyTroops(information);
        var troopsAmountLeftInCastle = result.castle.troopsForSale[information.request.index];

        expect(troopsAmountLeftInCastle).to.equal(expected);
    });

    it('if after buying new troops the amount of certain unit of troops the user owns has been properly increased', function() {
        var information = { request: { index: 1, amount: 2}, user: { gold: 25000, troops: [10, 15, 2, 1, 3, 4, 0] }, castle: { troopsForSale: [100, 20, 10, 30, 8, 2] }};

        var expected = information.user.troops[information.request.index] + information.request.amount;

        var result = troopsHandler.buyTroops(information);
        var amountOfTroopUnitsAfterBuyingNewUnits = result.user.troops[information.request.index];

        expect(amountOfTroopUnitsAfterBuyingNewUnits).to.equal(expected);
    });

    it('if after buying new troop units the amount of gold of the user is reduced and set properly', function() {
        var information = { request: { index: 1, amount: 2}, user: { gold: 25000, troops: [10, 15, 2, 1, 3, 4, 0] }, castle: { troopsForSale: [100, 20, 10, 30, 8, 2] }};

        var expected = information.user.gold - (information.request.amount * 300);

        var result = troopsHandler.buyTroops(information);
        var amountOfGoldLeftAfterPurchase = result.user.gold;

        expect(amountOfGoldLeftAfterPurchase).to.equal(expected);
    });
});
