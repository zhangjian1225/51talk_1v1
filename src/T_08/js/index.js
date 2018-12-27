"use strict"
import '../../common/js/common_1v1.js'

$(function () {
    window.h5Template = {
    	hasPractice: '1' 
    }
    let h5SyncActions = parent.window.h5SyncActions;
    const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;
    let clickName = configData.source.itemName;
    let listHtml = '';
    $('.text').html(configData.source.text);
    $('.text_show').html(configData.source.text);
    for(let i =0; i<configData.source.list.length; i++){
        listHtml+=`<li class="item" data-name="${configData.source.list[i].name}" data-syncactions="item_${i}">
            <img src="${configData.source.list[i].img}"/>
        </li>`
    }
    $('.box').html(listHtml);
    window.onload = function () {
        $('.mask').fadeIn().find('.text').addClass('textAnimate');
        $('.text').on('animationend webkitAnimationEnd', function () {
            setTimeout( function () {
                $('.text').removeClass('textAnimate')
                $('.mask').fadeOut();
                $('.text_show').fadeIn();
            },1000)
        })
        let itemClick = true;
        $('.item').on('click touchstart', function (e) {
            if (e.type == "touchstart") {
                e.preventDefault()
            }
            e.stopPropagation();
            if (itemClick) {
                itemClick = false;
                if (!isSync) {
                    $(this).trigger('itemClick')
                    return;
                }
                SDK.bindSyncEvt({
                    index: $(e.currentTarget).data('syncactions'),
                    eventType: 'click',
                    method: 'event',
                    funcType: 'audio',
                    syncName: 'itemClick'
                });
            }
        })
        $('.item').on('itemClick', function () {
            if (clickName == $(this).attr('data-name')) {
                $(this).find('img').fadeOut();
            } else {
                $(this).addClass('shake');
                $(this).on('animationend webkitAnimationEnd', function () {
                    $('.item').removeClass('shake');
                })
            }
            itemClick = true;
            SDK.setEventLock();
        })
    }
})
