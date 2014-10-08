app.factory('massNotifier', [function() {
    'use strict';

    var body = $(document.body);

    var holder = $('<div />').css('position','absolute').css('top','120px').css('color','white').width('375px')
        .css('left',(screen.availWidth / 2 - 132) + 'px').css('background-size','strech').css('z-index', 100);

    var text = $('<p />').css('position','absolute').css('left','13px').css('font-size','2em')
        .css('top','35px').css('z-index', 101).appendTo(holder);

    return {
        show: function(message) {
            text.text(message);
            holder.css('background-image', 'url("../../img/gameNotifier/adminNotifier.jpg")').height('105px');
            holder.hide().appendTo(body).fadeIn(5000).fadeOut(5000);
        }
    }
}]);