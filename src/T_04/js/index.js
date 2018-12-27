"use strict"
import '../../common/js/common_1v1.js'

$(function () {
    window.h5Template = {
    	hasPractice: '0' 
    }
    let h5SyncActions = parent.window.h5SyncActions;
    const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;
    let everLine = 1.8;
    $('.monkey_one').css('bottom',(configData.source.pos_one[0]*everLine)+'rem');
    $('.monkey_two').css('bottom',(configData.source.pos_two[0]*everLine)+'rem');
    window.onload = function () {
        let itemBoxClick = true;
        $('.monkey').on('click touchstart', function (e) {
            if (e.type == "touchstart") {
                e.preventDefault()
            }
            e.stopPropagation();
            if(!$(this).hasClass('end')) {
                if (itemBoxClick) {
                    itemBoxClick = false;
                    if (!$(this).hasClass('end')) {
                        if (!isSync) {
                            $(this).trigger('boxClick')
                            return;
                        }
                        if (window.frameElement.getAttribute('user_type') == 'tea') {
                            SDK.bindSyncEvt({
                                index: $(e.currentTarget).data('syncactions'),
                                eventType: 'click',
                                method: 'event',
                                funcType: 'audio',
                                syncName: 'boxClick'
                            });
                        }
                    } else {
                        itemBoxClick = true;
                    }
                }
            }
        })
        $('.monkey').on('boxClick', function () {
            if($(this).hasClass('monkey_one')){
                $('.monkey_one').css({
                    'transform':'scale(1.5) translateY('+(-(configData.source.pos_one[1]-configData.source.pos_one[0])*everLine)+'rem)',
                    'transition': 'transform '+(configData.source.pos_one[1] - configData.source.pos_one[0])*everLine+'s',
                    'animation': 'monkeyMove steps(8) 1s '+(configData.source.pos_one[1] - configData.source.pos_one[0])*everLine
                })
            } else {
                $('.monkey_two').css({
                    'transform':'scale(1.5) translateY('+(-(configData.source.pos_two[1]-configData.source.pos_two[0])*everLine)+'rem)',
                    'transition': 'transform '+(configData.source.pos_two[1] - configData.source.pos_two[0])*everLine+'s',
                    'animation': 'monkeyMove steps(8) 1s '+(configData.source.pos_two[1] - configData.source.pos_two[0])*everLine
                })
            }
            $(this).addClass('end');
            SDK.setEventLock();
	        itemBoxClick = true;
        })
    }
})
