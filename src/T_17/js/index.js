"use strict"
import '../../common/js/common_1v1.js'

$(function () {
    window.h5Template = {
    	hasPractice: '1' 
    }
    let h5SyncActions = parent.window.h5SyncActions;
    const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;
    /**
    * 创建dom元素
    */
    let cardHtml = '';
    for (let i = 0; i < configData.source.cardList.length; i++) {
        cardHtml += `<li data-syncactions="item_${i}">
            <audio src="./audio/click.mp3"/>
            <img src="${configData.source.cardList[i].img}"/>
            <span class='span ${configData.source.cardList[i].font==""?"hide":""}'>${configData.source.cardList[i].font}</span>
            <span class="font_width">${configData.source.cardList[i].font}</span>
        </li>`
    }
    let fontCon = '';
    for (let j = 0; j<configData.source.font.length; j++) {
        if (configData.source.font[j].hasOwnProperty('attributes') && configData.source.font[j].attributes.hasOwnProperty('underline')) {
            fontCon += `<span></span>`
        } else {
            fontCon += configData.source.font[j].insert
        }
    }
    $('.card_list ul').html(cardHtml);
    $('.font').html(fontCon);
    for (let i = 0; i<$('li').length; i++) {
        if ($('li').eq(i).find('.font_width').width()>$('li').width()) {
            $('li').eq(i).find('.span').css({
                'font-size':'.4rem'
            })
        }
    }
    if (configData.source.cardList.length>3) {
        $('.card_list ul').css({
            'height':'4.2rem'
        })
        $('.card_list ul li').css({
            'width':'3.3rem'
        })
    }
    window.onload = function () {
        let itemIndex = 0;
        let itemClick = true;
        $('.card_list li').on('click touchstart', function (e) {
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
                // if (window.frameElement.getAttribute('user_type') == 'tea') {
                    SDK.bindSyncEvt({
                        index: $(e.currentTarget).data('syncactions'),
                        eventType: 'click',
                        method: 'event',
                        funcType: 'audio',
                        syncName: 'buttonClick'
                    });
                // }
            }
        })
        $('.card_list li').on('buttonClick', function () {
            $(this).find('audio').get(0).play();
            $(this).addClass('changeMax').siblings().removeClass('changeMax');
            itemClick = true;
            SDK.setEventLock();
        })
    }
})
