app.factory('buildingsData', [function() {
    'use strict';

    var buildings =
        [
            {
                name: 'Town Hall',
                price: 100
            },
            {
                name: 'Citadel',
                price: 100
            },
            {
                name: 'Brotherhood of the sword',
                price: 100
            },
            {
                name: 'Blacksmith',
                price: 100
            },
            {
                name: 'Market Place',
                price: 100
            },
            {
                name: 'Mage Guild level 2',
                price: 100
            },
            {
                name: 'Shipyard',
                price: 100
            },
            {
                name: 'Stables',
                price: 100
            },
            {
                name: 'Griffin Bastion',
                price: 100
            },
            {
                name: 'Upg. Guardhouse',
                price: 100
            },
            {
                name: 'Upg. Archer\'s Tower',
                price: 100
            },
            {
                name: 'Upg. Griffin Tower',
                price: 100
            },
            {
                name: 'Barracks',
                price: 100
            },
            {
                name: 'Monastery',
                price: 100
            },
            {
                name: 'Training Grounds',
                price: 100
            },
            {
                name: 'Portal Of Glory',
                price: 100
            }
        ];

    return {
        getBuildings: buildings
    }
}]);