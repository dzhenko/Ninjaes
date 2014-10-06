'use strict';

module.exports = {
    hall: {
        name: ['Nothing', 'Town Hall', 'City Hall', 'Capitol'],
        produces: [500, 1000, 2000, 4000],
        cost: [0, 2500, 5000, 10000]
    },
    castle: {
        name: ['Nothing', 'Fort', 'Citadel', 'Castle'],
        produces: [1, 1, 1.5, 2],
        cost: [0, 2500, 5000, 10000]
    },
    troops: [
        {
            name: 'Guardhouse',
            produces: 14,
            cost: 2000
        },{
            name: 'Archer\'s Tower',
            produces: 8,
            cost: 3000
        },{
            name: 'Griffin Tower',
            produces: 8,
            cost: 4000
        },{
            name: 'Barracks',
            produces: 4,
            cost: 6000
        },{
            name: 'Monastery',
            produces: 3,
            cost: 9000
        },{
            name: 'Training Grounds',
            produces: 2,
            cost: 12000
        },{
            name: 'Portal of Glory',
            produces: 1,
            cost: 20000
        }
    ]
};