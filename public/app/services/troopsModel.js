app.factory('troopsModel', [function() {
    'use strict';

    return [
        {
            name: 'Halberdiers',
            attack: 6,
            defense: 5,
            damage: 2,
            health: 10,
            speed: 5,
            growth: 28,
            cost: 130
        },{
            name: 'Marksmen',
            attack: 8,
            defense: 4,
            damage: 4,
            health: 10,
            speed: 6,
            growth: 18,
            cost: 300
        },{
            name: 'Royal Griffins',
            attack: 9,
            defense: 9,
            damage: 6,
            health: 25,
            speed: 9,
            growth: 18,
            cost: 440
        },{
            name: 'Crusaders',
            attack: 12,
            defense: 12,
            damage: 9,
            health: 35,
            speed: 6,
            growth: 8,
            cost: 760
        },{
            name: 'Zealots',
            attack: 12,
            defense: 10,
            damage: 12,
            health: 30,
            speed: 7,
            growth: 6,
            cost: 1000
        },{
            name: 'Champions',
            attack: 16,
            defense: 16,
            damage: 24,
            health: 100,
            speed: 9,
            growth: 4,
            cost: 1500
        },{
            name: 'Archangels',
            attack: 30,
            defense: 30,
            damage: 50,
            health: 250,
            speed: 18,
            growth: 2,
            cost: 5000
        }
    ]
}]);