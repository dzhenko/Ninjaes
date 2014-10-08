app.factory('massNotifier', [function() {
    'use strict';

    var mapHolder = $('#mapHolder');

    var holder = $('<div />').css('position','absolute').css('top','120px').css('color','white').width('158px')
        .css('left',(screen.availWidth / 2 - 132) + 'px').css('background-size','strech').css('z-index', 100);

    var text = $('<p />').css('position','absolute').css('left','13px').css('z-index', 100).appendTo(holder);

    return {
        show: function(text) {
            text.text(text);
            holder.css('background-image', 'url("../../img/gameNotifier/goldNotifier.jpg")').height('105px');
            holder.hide().appendTo(mapHolder).fadeIn().fadeOut(2000);
        }
    }
}]);