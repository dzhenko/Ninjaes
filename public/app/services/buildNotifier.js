app.factory('buildNotifier', ['$q', function($q) {
    'use strict';

    var holder = $('<div />').css('position','absolute').css('top','255px').css('color','white').width('300px')
        .css('left',(screen.availWidth / 2 - 165) + 'px').css('background-size','strech').css('z-index', 100).css('color', '#aaa')
        .height('300px').width('300px').addClass('text-center').css('color', 'white');

    var title = $('<p />').css('position','absolute').css('top','50px').css('left','50px').css('z-index', 100).appendTo(holder);
    var buildingName = $('<p />').css('position','absolute').css('top','100px').css('left','50px').css('z-index', 100).appendTo(holder);
    var priceText = $('<p />').css('position','absolute').css('top','150px').css('left','50px').css('z-index', 100).appendTo(holder);

    var okBtn = $('<div />').css('position','absolute').width('60px').height('30px')
        .css('bottom','25px').css('left','82px').css('z-index', 100).appendTo(holder);

    var cnclBtn = $('<div />').css('position','absolute').width('60px').height('30px')
        .css('bottom','25px').css('right','80px').css('z-index', 100).appendTo(holder);

    return {
        showBuyWindow: function(name, price, havePrevBuilding) {
            var deferred = $q.defer();

            if (price > 0 && havePrevBuilding){
                title.text('Are you sure you want to buy ');
                buildingName.text(name);
                priceText.text('for ' + price + ' gold?');
                cnclBtn.click(function() {holder.hide(); deferred.reject()});
                okBtn.click(function() {holder.hide(); deferred.resolve()});
            }
            else if (price > 0 && !havePrevBuilding) {
                title.text(' You cant build ');
                buildingName.text(name ? name : ' this ');
                priceText.text(' for now! ');
                cnclBtn.click(function() {holder.hide(); deferred.reject()});
                okBtn.click(function() {holder.hide(); deferred.reject()});
            }
            else if (price < 0) {
                title.text(' You have successfully ');
                buildingName.text(name ? name : ' built ');
                priceText.text(' this building! ');
                cnclBtn.click(function() {holder.hide(); deferred.resolve()});
                okBtn.click(function() {holder.hide(); deferred.resolve()});
            }
            else {
                title.text('You already built ');
                buildingName.text(name);
                priceText.text(' pick something else!');
                cnclBtn.click(function() {holder.hide(); deferred.reject()});
                okBtn.click(function() {holder.hide(); deferred.reject()});
            }

            holder.css('background-image', 'url("../../img/confirm-window.png")');
            holder.appendTo($('#build-panel')).hide().fadeIn();

            return deferred.promise;
        }
    }
}]);