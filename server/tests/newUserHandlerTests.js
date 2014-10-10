var expect = require('chai').expect,
    gameData = require('../data/gameData'),
    mapHandler = require('../handlers/newUserHandler'),
    user = {},
    castle = {},
    addPlayerCalled = false,
    addCastleCalled = false;

describe('newUserHandler', function () {
    before(function () {
        gameData.players.add = function () {
            addPlayerCalled = !addPlayerCalled;
        };

        gameData.castles.add = function () {
            addCastleCalled = !addCastleCalled;
        }
    });

    describe('#updateMapWithUserAndCastle()', function () {
        it('is expected to add user and castle', function () {
            mapHandler.updateMapWithUserAndCastle(user, castle, gameData);

            expect(addPlayerCalled).to.be.true;
            expect(addCastleCalled).to.be.true;
        });
    });
});

