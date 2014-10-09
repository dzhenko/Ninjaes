var expect = require('chai').expect,
    gameSettings = require('../config/gameSettings'),
    gameData = require('../data/gameData'),
    mapHandler = require('../handlers/mapHandler'),
    fakeInfo = {};

describe('mapHandler', function () {
    describe('#validateCoordinates()', function () {
        it('is expected to return false if no coordinates object is send', function () {
            var result = mapHandler.validateCoordinates();

            expect(result).to.be.false;
        });
        it('is expected to return false with negative X coordinate', function () {
            var coordinates = {
                x: -100,
                y: 100
            };
            var result = mapHandler.validateCoordinates(coordinates);

            expect(result).to.be.false;
        });
        it('is expected to return false with negative Y coordinate', function () {
            var coordinates = {
                x: 100,
                y: -100
            };
            var result = mapHandler.validateCoordinates(coordinates);

            expect(result).to.be.false;
        });
        it('is expected to return false with invalid  coordinates', function () {
            var coordinates = {
                x: 100,
                y: gameSettings.mapSize + 10
            };
            var result = mapHandler.validateCoordinates(coordinates);

            expect(result).to.be.false;
        });
        it('is expected to return false with invalid boundary coordinates', function () {
           var     boundaryCoordinates = {
                    x: gameSettings.mapSize,
                    y: gameSettings.mapSize
                };

            var result = mapHandler.validateCoordinates(boundaryCoordinates);

            expect(result).to.be.false;
        });
        it('is expected to return true with valid  coordinates', function () {
            var coordinates = {
                x: gameSettings.mapSize - 1,
                y: gameSettings.mapSize - 1
            };
            var result = mapHandler.validateCoordinates(coordinates);

            expect(result).to.be.true;
        });
    });
});
