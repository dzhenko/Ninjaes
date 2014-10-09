var expect = require('chai').expect,
    gameData = require('../data/gameData'),
    battleHandler = require('../handlers/battleHandler'),
    fakeInfo = {};

describe('battleHandler', function () {
    beforeEach(function () {
        fakeInfo.user = {
            username: 'pesho',
            coordinates: {
                x: 50,
                y: 50
            },
            gold: 5000,
            movement: 2000,
            experience: 100,
            troops: [28, 5, 3, 0, 0, 0]
        };
        fakeInfo.hero = {
            username: 'gosho',
            coordinates: {
                x: 100,
                y: 100
            },
            gold: 5000,
            movement: 2000,
            experience: 50,
            troops: [18, 5, 3, 0, 0, 0]
        };
        fakeInfo.monster = {
            level: 5,
            amount: 5
        };

        gameData.players.get = function () {
            return fakeInfo.user;
        }

    });
//    describe('#fightHero()', function () {
//        it('just for the test', function () {
//            var winner = battleHandler.fightHero(fakeInfo, gameData).user;
//            console.log(winner);
//            expect(true).to.be.true;
//        })
//    })

    describe('#fightMonster()', function () {
        it('win over a monster should gain 1 more experience', function () {
            var initialExperience = gameData.players.get(fakeInfo.user.coordinates).experience;
            var winner = battleHandler.fightMonster(fakeInfo, gameData).user;

            expect(winner.experience).to.be.equal(initialExperience + 1);
        });
        it('fight with not experienced user should be won by the monster', function () {
            fakeInfo.user.experience = 0;
            var winner = battleHandler.fightMonster(fakeInfo, gameData).user;

            expect(winner.experience).to.be.equal(0);
        });
        it("monster should kill player's troops", function () {
            fakeInfo.user.experience = 0;
            var winner = battleHandler.fightMonster(fakeInfo, gameData).user;

            for(var i = 0, len = winner.troops.length; i < len; i+=1) {
                expect(winner.troops[i]).to.be.equal(0);
            }
        });
    });
});