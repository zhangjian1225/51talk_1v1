"use strict"
import '../../common/js/common_1v1.js'

$(function () {
    window.h5Template = {
    	hasPractice: '1' 
    }
    let h5SyncActions = parent.window.h5SyncActions;
    const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;
    let emptyHtml = '';
    let choose_html = '';
    let arrs = [];
    let arr = configData.source.list.split(',');
    let letter = ['a','b','c','d','e','f','g','h','i','g','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
    $('.main_img').html('<img src="'+configData.source.img+'"/>')
    for(let i=0; i<configData.source.font.length; i++) {
        emptyHtml+=`<span data-font="${configData.source.font[i]}"></span>`
        arrs.push(configData.source.font[i])
    }
    $('.empty_list').html(emptyHtml);
    arrs = arrs.concat(arr);
    arrs.sort(function (a,b) {
        return a.charCodeAt()-b.charCodeAt();
    })
    for(let i = 0; i<arrs.length; i++) {
        let pos = letter.indexOf(arrs[i])*2;
        choose_html += `<span data-font="${arrs[i]}" data-syncactions='item_${i}' style="background-position:-${pos}rem;"></span>`
    }
    $('.choose_list').html(choose_html);
    window.onload = function () {
        let itemIndex = 0;
        let itemClick = true;
        $('.choose_list span').on('click touchstart', function (e) {
            if (e.type == "touchstart") {
                e.preventDefault()
            }
            e.stopPropagation();
            if (!$(this).hasClass('end')) {
                if (itemClick) {
                    itemClick = false;
                    if (!isSync) {
                        $(this).trigger('textClick')
                        return;
                    }
                    SDK.bindSyncEvt({
                        index: $(e.currentTarget).data('syncactions'),
                        eventType: 'click',
                        method: 'event',
                        funcType: 'audio',
                        syncName: 'textClick'
                    });
                }
            }
        })
        $('.choose_list span').on('textClick', function () {
            let dataFont = $('.empty_list span').eq(itemIndex).attr('data-font');
            let $that = $(this);
            $(this).css('z-index','11');
            if (dataFont == $(this).attr('data-font')) {
                let element = $(this).get(0);
                let target = $('.empty_list span').eq(itemIndex).get(0);
                let parabola = funParabola(element, target, {
                    curvature: '0',
                    speed: 4/window.base,
                    complete: function () {
                        itemIndex = itemIndex +1;
                        $that.addClass('end');
                        if (itemIndex >= $('.empty_list span').length) {
                            itemClick = false;
                            SDK.setEventLock();
                        } else {
                            itemClick = true;
                            SDK.setEventLock();
                        }
                    }
                })
                parabola.init();
            } else {
                $(this).addClass('shake');
                $(this).on('animationend webkitAnimationEnd', function () {
                    $(this).css('z-index','10');
                    $that.removeClass('shake');
                    itemClick = true;
                    SDK.setEventLock();
                })
            }
        })
    }
})
