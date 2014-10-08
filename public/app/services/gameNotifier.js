app.factory('gameNotifier', ['$q', function($q) {
    'use strict';

    var mapHolder = $('#mapHolder');

    var holder = $('<div />').css('position','absolute').css('top','120px').css('color','white').width('158px')
        .css('left',(screen.availWidth / 2 - 132) + 'px').css('background-size','strech').css('z-index', 100);

    var title = $('<p />').css('position','absolute').css('top','20px').css('left','27px').css('z-index', 100).appendTo(holder);

    var text = $('<p />').css('position','absolute').css('left','13px').css('z-index', 100).appendTo(holder);

    var okBtn = $('<div />').css('position','absolute').width('32px').height('16px')
        .css('bottom','15px').css('left','42px').css('z-index', 100).appendTo(holder);

    var cnclBtn = $('<div />').css('position','absolute').width('32px').height('16px')
        .css('bottom','15px').css('right','42px').css('z-index', 100).appendTo(holder);

    return {
        gold: function(amount) {
            title.hide();
            text.text('You found ' + amount + ' gold!').css('bottom','7px');
            cnclBtn.hide();
            okBtn.hide();
            holder.css('background-image', 'url("../../img/gameNotifier/goldNotifier.jpg")').height('105px');
            holder.hide().appendTo(mapHolder).fadeIn().fadeOut(2000);
        },
        enemy: function(amount) {
            var deferred = $q.defer();

            title.show();
            title.text(amount + ' Halberdiers');
            text.text('Do you want to fight?').css('bottom','25px');
            cnclBtn.show();
            okBtn.show();
            cnclBtn.click(function() {holder.hide(); deferred.reject()});
            okBtn.click(function() {holder.hide(); deferred.resolve()});
            holder.css('background-image', 'url("../../img/gameNotifier/enemyNotifier.jpg")').height('159px');
            holder.appendTo($('#mapHolder')).hide().fadeIn();

            return deferred.promise;
        },
        hero : function(experience) {
            var deferred = $q.defer();

            title.show();
            title.text('Hero xp ' + experience);
            text.text('Do you want to fight?').css('bottom','25px');
            cnclBtn.show();
            okBtn.show();
            cnclBtn.click(function() {holder.hide(); deferred.reject()});
            okBtn.click(function() {holder.hide(); deferred.resolve()});
            holder.css('background-image', 'url("../../img/gameNotifier/heroNotifier.jpg")').height('159px');
            holder.appendTo($('#mapHolder')).hide().fadeIn();

            return deferred.promise;
        },
        message : function(msg) {
            title.hide();
            text.text(msg).css('bottom','7px');
            cnclBtn.hide();
            okBtn.hide();
            holder.css('background-image', 'url("../../img/gameNotifier/troopsNotifier.jpg")').height('105px');
            holder.hide().appendTo(mapHolder).show().fadeOut(4000);
        }
    }
}]);