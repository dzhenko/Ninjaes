app.factory('troopsModel', [function() {
    'use strict';

    return [
        {
            id: 0,
            name: 'Halberdiers',
            image: './img/troops/halberdier.gif',
            attack: 6,
            defense: 5,
            damage: 2,
            health: 10,
            speed: 5,
            growth: 28,
            cost: 130
        },{
            id: 1,
            name: 'Marksmen',
            image: './img/troops/halberdier.gif',
            attack: 8,
            defense: 4,
            damage: 4,
            health: 10,
            speed: 6,
            growth: 18,
            cost: 300
        },{
            id: 2,
            name: 'Royal Griffins',
            image: './img/troops/griffin.gif',
            attack: 9,
            defense: 9,
            damage: 6,
            health: 25,
            speed: 9,
            growth: 18,
            cost: 440
        },{
            id: 3,
            name: 'Crusaders',
            image: './img/troops/crusader.gif',
            attack: 12,
            defense: 12,
            damage: 9,
            health: 35,
            speed: 6,
            growth: 8,
            cost: 760
        },{
            id: 4,
            name: 'Zealots',
            image: './img/troops/zealot.gif',
            attack: 12,
            defense: 10,
            damage: 12,
            health: 30,
            speed: 7,
            growth: 6,
            cost: 1000
        },{
            id: 5,
            name: 'Champions',
            image: './img/troops/champion.gif',
            attack: 16,
            defense: 16,
            damage: 24,
            health: 100,
            speed: 9,
            growth: 4,
            cost: 1500
        },{
            id: 6,
            name: 'Archangels',
            image: './img/troops/archangel.gif',
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