app.factory('overviewNotifier', ['$q', function($q) {
    'use strict';

    var mapHolder = $('#overview-panel');

    var holder = $('<div />').css('position','absolute').css('top','100px').css('color','white').width('484px')
        .css('left', '150px').css('background-size','strech').css('z-index', 100);

    var title = $('<p />').css('position','absolute').css('top','20px').css('left','27px').css('z-index', 100).appendTo(holder);

    var text = $('<p />').css('position','absolute').css('left','13px').css('z-index', 100).appendTo(holder);

    var image = $('<img>').css('position', 'absolute').css('left', '191px').css('top', '65px').css('z-index', '1500');

//    var okBtn = $('<div />').css('position','absolute').width('32px').height('16px')
//        .css('bottom','15px').css('left','42px').css('z-index', 100).appendTo(holder);
//
//    var cnclBtn = $('<div />').css('position','absolute').width('32px').height('16px')
//        .css('bottom','15px').css('right','42px').css('z-index', 100).appendTo(holder);

    return {
        recruit: function(troop) {
            console.log('======================');
            console.log(troop);
            console.log('======================');
            //amount = 100;
            var deferred = $q.defer();

            image.attr('src', troop.image)
            image.show();
            title.show();
            title.text(troop.name);
            image.appendTo(holder);

            //text.text('Do you want to fight?').css('bottom','25px');
//            cnclBtn.show();
//            okBtn.show();
//            cnclBtn.click(function() {holder.hide(); deferred.reject()});
//            okBtn.click(function() {holder.hide(); deferred.resolve()});
            holder.css('background-image', 'url("../../img/recruit.png")').height('396px');
            holder.appendTo($('#overview-panel')).hide().fadeIn();

            return deferred.promise;
        }
    }
}]);