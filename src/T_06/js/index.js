"use strict"
import '../../common/js/common_1v1.js'

$(function () {
    window.h5Template = {
    	hasPractice: '0' 
    }
    

    let h5SyncActions = parent.window.h5SyncActions;
    const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;
    let everLine = 1.8;
    let itemClick = true;
    let anClassName = 'step_'+configData.source.step;
    let className = 'pos_'+configData.source.step;
    if (isSync) {
        if (window.frameElement.getAttribute('user_type') == 'tea') {
            $('.button').css('opacity','1');
            $('.hand').show();
        }
    } else {
        $('.button').css('opacity','1');
        $('.hand').show();
    }
    if (configData.source.step!='1') {
        for (let i = 1; i<=configData.source.step; i++) {
            $('.card_'+(i-1)).hide()
        }
    }
    $('.car').addClass('pos_'+configData.source.step)
    $('.button,.hand').on('click touchstart', function (e) {
        if (e.type == "touchstart") {
            e.preventDefault()
        }
        e.stopPropagation();
        if (itemClick) {
            itemClick = false;
            if (!isSync) {
                $(this).trigger('buttonClick')
                return;
            }
            if (window.frameElement.getAttribute('user_type') == 'tea') {
                SDK.bindSyncEvt({
                    index: $(e.currentTarget).data('syncactions'),
                    eventType: 'click',
                    method: 'event',
                    funcType: 'audio',
                    syncName: 'buttonClick'
                });
            }
        }
    })
    $('.button,.hand').on('buttonClick', function () {
        $('.hand').hide();
        $('.button').addClass('start');
        $('.button').on('animationend webkitAnimationEnd', function () {
            $('.button').removeClass('.start');
            $('.car').removeClass('pos_'+configData.source.step);
            $('.car').addClass('step_'+configData.source.step);
            $('.car').on('animationend webkitAnimationEnd', function () {
                $('.card_'+configData.source.step).hide()
            })
        })
        SDK.setEventLock();
    })
})
