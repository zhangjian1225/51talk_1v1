(function ($) {
    $.fn.snow = function (options) {
        var documentHeight = $(this).height();
        var documentWidth = $(this).width();
        var that = $(this);
        var defaults = {
            base: 1,   /* px 与 各个单位换算 */
            unitType: 'px', /* 单位 */
            minSize: 10,
            maxSize: 20,
            newOn: 1000,
            flakeColor: "#AFDAEF", /* 此处可以定义雪花颜色，若要白色可以改为#FFFFFF */
            showType: 'font', /* 默认为文字 还可以为图片 img*/
            showHtml: '&#10052;', /* 默认为文字 还可以为图片地址*/
            zIndex: '9999', /* z-index值*/
            imgSize: ['', ''] /* 图片大小 宽 高 */
        };
        var options = $.extend({}, defaults, options);
        var unitType = options.unitType;
        var base = options.base;
        var $flake = '';
        if (options.showType == 'font') {
            $flake = $('<div id="snowbox" />').css({
                'position': 'absolute',
                'z-index': options.zIndex,
                'top': -50 / base + unitType
            }).html(options.showHtml);
        } else if (options.showType == 'img') {
            $flake = $('<div id="snowbox" />').css({
                'position': 'absolute',
                'z-index': options.zIndex,
                'top': -50 / base + unitType
            }).html('<img src="' + options.showHtml + '"/>');
        }
        $('.snowbox img').css({
            "width": options.imgSize[0] + unitType,
            "height": options.imgSize[1] + unitType
        })
        var interval = setInterval(function () {
            var startPositionLeft = (Math.random() * documentWidth) / base,
                startOpacity = 0.5 + Math.random(),
                sizeFlake = (options.minSize + Math.random() * options.maxSize) / base,
                endPositionTop = documentHeight / base,
                endPositionLeft = (startPositionLeft - 500 / base + Math.random() * (500 / base)),
                durationFall = documentHeight * 10 + Math.random() * 5000;
            var cloneSnow = $flake.clone();
            cloneSnow.find('img').css({
                'width': (options.minSize + Math.random() * options.maxSize) / base + unitType,
                'height': '100%'
            });
            cloneSnow.appendTo(that).css({
                left: startPositionLeft + unitType,
                opacity: startOpacity,
                'font-size': sizeFlake + unitType,
                color: options.flakeColor
            }).animate({
                top: endPositionTop + unitType,
                left: endPositionLeft + unitType,
                opacity: 0.2
            }, durationFall, 'linear', function () {
                $(this).remove()
            })
        }, options.newOn);
    };
})(jQuery);
