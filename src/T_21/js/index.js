"use strict"
import '../../common/js/common_1v1.js'

$(function () {
    window.h5Template = {
        hasPractice: '0'
    }
    $('.left').css({
        'background': 'url('+configData.source.leftImg+') no-repeat',
        'background-size': 'auto 100%'
    })

    $('.right').css({
        'background': 'url('+configData.source.rightImg+') no-repeat',
        'background-size': 'auto 100%'
    })
    if (configData.source.audio) {
        $('.stage').append('<audio class="mus" src="'+configData.source.audio+'"></audio>')
    }
    let h5SyncActions = parent.window.h5SyncActions;
    const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;
    if (isSync) {
        if (window.frameElement.getAttribute('user_type') == 'tea') {
            $('.hand').css('opacity','1');
        } else {
            $('.hand').css('opacity','0');
        }
    } else {
        $('.hand').css('opacity','1');
    }
    window.onload = function () {
        let itemClick = true;
        $('.hand').on('click touchstart', function (e) {
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
        $('.hand').on('buttonClick', function () {
            $(this).hide();
            if ($('.mus').length >0) {
                $('.mus').get(0).play();
            }
            $('.item').addClass('person_animate').on('animationend webkitAnimationEnd', function () {
                $('.item').removeClass('person_animate')
            });
            // itemClick = true;
            SDK.setEventLock();
        })
    }
})
