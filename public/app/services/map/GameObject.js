app.factory('GameObject', ['$q', function ($q) {
    'use strict';

    var GameObject = function (name, type, position) {
        this.name = name;
        this.type = type;
        this.position = position;
        this.width = 0;
        this.height = 0;
        this.image = null;
    };

    GameObject.prototype.loadImage = function (gameObjectImages) {
        this.image = gameObjectImages[this.type];
        this.width = this.image.width;
        this.height = this.image.height;
    };

    GameObject.prototype.isInMapRange = function (map) {
        if (this.position.x + this.width >= -map.position.x &&
            this.position.x <= -map.position.x + map.width() &&
            this.position.y + this.height >= -map.position.y &&
            this.position.y <= -map.position.y + map.height()) {
            return true;
        }

        return false;
    };

    return GameObject;
}]);