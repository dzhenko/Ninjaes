'use strict';

module.exports = {
    hall: {
        Name: ['Nothing', 'Town Hall', 'City Hall', 'Capitol'],
        Produces: [500, 1000, 2000, 4000],
        Cost: [0, 2500, 5000, 10000]
    },
    castle: {
        Name: ['Nothing', 'Fort', 'Citadel', 'Castle'],
        Produces: [1, 1, 1.5, 2],
        Cost: [0, 2500, 5000, 10000]
    },
    troops: [
        {
            Name: 'Guardhouse',
            Produces: 14,
            Cost: 2000
        },{
            Name: 'Archer\'s Tower',
            Produces: 8,
            Cost: 3000
        },{
            Name: 'Griffin Tower',
            Produces: 8,
            Cost: 4000
        },{
            Name: 'Barracks',
            Produces: 4,
            Cost: 6000
        },{
            Name: 'Monastery',
            Produces: 3,
            Cost: 9000
        },{
            Name: 'Training Grounds',
            Produces: 2,
            Cost: 12000
        },{
            Name: 'Portal of Glory',
            Produces: 1,
            Cost: 20000
        }
    ]
};