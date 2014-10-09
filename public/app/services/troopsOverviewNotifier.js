app.factory('troopsOverviewNotifier', ['$q', function ($q) {
    'use strict';

    var mapHolder = $('#overview-panel');

    var holder = $('<div />')
        .css('position', 'absolute')
        .css('top', '100px')
        .css('color', 'white')
        .css('width', '484px')
        .css('left', '150px')
        .css('background-size', 'strech')
        .css('z-index', 1000);

    var title = $('<p />')
        .css('position', 'absolute')
        .css('top', '15px')
        .css('left', '15px')
        .css('z-index', '1000')
        .css('width', '457px')
        .css('font-size', 'x-large')
        .css('height', '20px')
        .css('text-align', 'center')
        .appendTo(holder);

    var costPerTroopLabel = $('<p />')
        .css('position', 'absolute')
        .css('top', '278px')
        .css('left', '66px')
        .css('font-size', '15px')
        .css('height', '15px')
        .css('text-align', 'center')
        .css('width', '100px')
        .css('z-index', '1000')
        .appendTo(holder);

    var totalCostLabel = $('<p />')
        .css('position', 'absolute')
        .css('top', '278px')
        .css('left', '323px')
        .css('font-size', '15px')
        .css('height', '15px')
        .css('text-align', 'center')
        .css('width', '100px')
        .css('z-index', '1000')
        .appendTo(holder);

    var availableLabel = $('<p />')
        .css('position', 'absolute')
        .css('top', '245px')
        .css('left', '174px')
        .css('font-size', '15px')
        .css('height', '18px')
        .css('text-align', 'center')
        .css('width', '65px')
        .css('z-index', '1000')
        .appendTo(holder);

    var recruitLabel = $('<p />')
        .css('position', 'absolute')
        .css('top', '245px')
        .css('left', '247px')
        .css('font-size', '15px')
        .css('height', '18px')
        .css('text-align', 'center')
        .css('width', '65px')
        .css('z-index', '1000')
        .appendTo(holder);

    var image = $('<img>').css('position', 'absolute').css('left', '191px').css('top', '65px').css('z-index', '1100');

//    var okBtn = $('<div />').css('position','absolute').width('32px').height('16px')
//        .css('bottom','15px').css('left','42px').css('z-index', 100).appendTo(holder);
//
    var cnclBtn = $('<div />').css('position', 'absolute').width('65px').height('35px')
        .css('top', '312px').css('left', '290px').css('z-index', 1000).appendTo(holder);

//    var addBtn = $('<div />').css('position', 'absolute').width('65px').height('35px')
//        .css('top', '273px').css('left', '173px').css('z-index', 1000).appendTo(holder);
//
//    var subtractBtn = $('<div />').css('position', 'absolute').width('65px').height('35px')
//        .css('top', '273px').css('left', '290px').css('z-index', 1000).appendTo(holder);

    var addBtn = $('<div />').css('position', 'absolute').width('65px').height('35px')
        .css('top', '273px').css('left', '245px').css('z-index', 1000).appendTo(holder);

    var subtractBtn = $('<div />').css('position', 'absolute').width('65px').height('35px')
        .css('top', '273px').css('left', '173px').css('z-index', 1000).appendTo(holder);

    var buyMaxBtn = $('<div />').css('position', 'absolute').width('65px').height('35px')
        .css('top', '312px').css('left', '133px').css('z-index', 1000).appendTo(holder);

    var finishBargainBtn = $('<div />').css('position', 'absolute').width('65px').height('35px')
        .css('top', '312px').css('left', '210px').css('z-index', 1000).appendTo(holder);

    return {
        recruit: function (troop, purchaseInfo) {
            var deferred = $q.defer();

            image.attr('src', troop.image)
            title.text(troop.name);
            costPerTroopLabel.text(troop.cost);
            totalCostLabel.text(purchaseInfo.totalCost);
            availableLabel.text(purchaseInfo.available);
            recruitLabel.text(purchaseInfo.recruit);
            image.appendTo(holder);

            cnclBtn.click(function () {
                holder.hide();
                deferred.reject()
            });

            addBtn.click(purchaseInfo, function (purchaseInfo) {
                if (purchaseInfo.data.recruit < purchaseInfo.data.available) {
                    purchaseInfo.data.recruit++;
                    purchaseInfo.data.totalCost = purchaseInfo.data.recruit * troop.cost;
                    deferred.notify(purchaseInfo.data);
                }
            });

            subtractBtn.click(purchaseInfo, function (purchaseInfo) {
                if (purchaseInfo.data.recruit > 0) {
                    purchaseInfo.data.recruit--;
                    purchaseInfo.data.totalCost = purchaseInfo.data.recruit * troop.cost;
                    deferred.notify(purchaseInfo.data);
                }
            });

            buyMaxBtn.click(purchaseInfo, function (purchaseInfo) {
                purchaseInfo.data.recruit = purchaseInfo.data.available;
                purchaseInfo.data.totalCost = purchaseInfo.data.recruit * troop.cost;
                deferred.notify(purchaseInfo.data);
            });

            finishBargainBtn.click(function () {
                holder.hide();
                deferred.resolve(troop.id);
            });

            holder.css('background-image', 'url("../../img/recruit.png")').height('396px');
            holder.appendTo($('#overview-panel')).hide().fadeIn();

            return deferred.promise;
        },
        updateRecruits: function (count, totalCost) {
            recruitLabel.text(count);
            totalCostLabel.text(totalCost);
        }
    }
}]);