app.factory('mapPreloader', ['$q', function ($q) {
    'use strict';

    //http://www.javascriptkit.com/javatutors/preloadimagesplus.shtml
    function preloadImages(arr) {
        var defer = $q.defer();
        var newimages = {},
            loadedimages = 0;
        arr = (Object.prototype.toString.call(arr) === '[object Array]' ) ? arr : [arr];


        function imageloadpost() {
            loadedimages++;
            if (loadedimages == arr.length) {
                defer.resolve(newimages);
            }
        }

        for (var i = 0; i < arr.length; i++) {
            newimages[arr[i].name] = new Image();
            newimages[arr[i].name].src = arr[i].src;
            newimages[arr[i].name].onload = function () {
                defer.notify(loadedimages);
                imageloadpost()
            };
            newimages[arr[i].name].onerror = function () {
                imageloadpost()
            }
        }

        return defer.promise;
    }

    return {
        preloadImages: preloadImages
    }
}]);