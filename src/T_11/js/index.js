"use strict"
import '../../common/js/common_1v1.js'

$(function () {
    window.h5Template = {
    	hasPractice: '1' 
    }
    let h5SyncActions = parent.window.h5SyncActions;
    const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;
    window.onload = function () {
        let itemClick = true;
        $('.init_box').on('click touchstart', function (e) {
            if (e.type == "touchstart") {
                e.preventDefault()
            }
            e.stopPropagation();
            if (!$(this).hasClass('end')) {
                if (itemClick) {
                    itemClick = false;
                    if (!isSync) {
                        $(this).trigger('boxClick')
                        return;
                    }
                    SDK.bindSyncEvt({
                        index: $(e.currentTarget).data('syncactions'),
                        eventType: 'click',
                        method: 'event',
                        funcType: 'audio',
                        syncName: 'boxClick'
                    });
                }
            }
        })
        $('.init_box').on('boxClick', function () {
            let $that = $(this);
            $(this).parents('.box').addClass('box_animate').on('animationend webkitAnimationEnd', function () {
                $that.hide();
                $that.siblings('.open_box').show();
                $that.siblings('.open_box').find('.star_1').addClass('star_change');
                setTimeout(function() {
                    $that.siblings('img').addClass('light_animate');
                    $that.siblings('.open_box').find('.star_2').addClass('star_change');
                    setTimeout(function() {
                        $that.siblings('.open_box').find('.star_3').addClass('star_change');
                    },600)
                },500)
                $that.siblings('img').show();
            })
            itemClick = true;
            SDK.setEventLock();
        })
        // $('.box_init').addClass('minToMax');
        // $('.box_init').on('animationend webkitAnimationEnd', function () {
        //     $('.box_init').addClass('rotate');
        //     $('.box_init').on('animationend webkitAnimationEnd', function () {
        //         $('.box_init').hide();
        //         $('.box_open').show();
        //         setTimeout(function () {
        //             $('.light').fadeOut();
        //             $('.light_show').fadeIn().addClass('light_animate');
        //             setTimeout(function () {
        //                 $('.star_1').addClass('star_change');
        //                 setTimeout(function () {
        //                     $('.star_2').addClass('star_change');
        //                     setTimeout(function () {
        //                         $('.star_3').addClass('star_change');
        //                     },500)
        //                 },500)
        //             },500)
        //         },300)
        //     })
        // })
    }
})
