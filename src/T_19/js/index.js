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
    for (let i = 0; i < configData.source.AnList.length; i++) {
        $('.list_ever').eq(i).find('.glass').html('<img src="'+configData.source.AnList[i].img+'"/>')
    }
    let fontCon = '';
    for (let j = 0; j<configData.source.font.length; j++) {
        if (configData.source.font[j].hasOwnProperty('attributes') && configData.source.font[j].attributes.hasOwnProperty('underline')) {
            fontCon += `...`
        } else {
            fontCon += configData.source.font[j].insert
        }
    }
    $('.font span').html(fontCon);
    // 改变字体大小
    let fontW = $('.font .c_span').width() / window.base;
    if (fontW>=2.5) {
        $('.font .main_span').css('font-size','.4rem')
    }
    window.onload = function () {
        let chooseIndexArr = ['1','3','5','2','4','6']; // 选择的顺序
        let arrIndex = 0;
        let endNum = chooseIndexArr[arrIndex]*1; // 停止的index值
        let circleNum = 2; // 旋转圈数
        let startNum = 0;
        let itemClick = true;
        $('.button').on('click touchstart', function (e) {
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
                    syncName: 'buttonClick',
                    otherInfor: {
                        startNum_msg: startNum,
                        arrIndex_msg: arrIndex,
                        endNum_msg: endNum,
                        circleNum_msg: circleNum
                    },
                    recoveryMode: '1'
                });
                // }
            }
        })
        $('.button').on('buttonClick', function (e,message) {
            if (isSync && message.operate== '5') {
                var otherInfor = message.data[0].value.syncAction.otherInfor;
                startNum = otherInfor.startNum_msg;
                arrIndex = otherInfor.arrIndex_msg;
                endNum = otherInfor.endNum_msg;
                circleNum = otherInfor.circleNum_msg;
            } else {
                startNum = startNum;
                arrIndex = arrIndex;
                endNum = endNum;
                circleNum = circleNum;
            }
            $('.hand').hide();
            let chooseNum = 0;
            let time = setInterval(function () {
                if(startNum>5) {
                    chooseNum = startNum%6;
                } else {
                    chooseNum = startNum;
                }
                $('.list_ever').eq(chooseNum).find('.light').addClass('choose');
                $('.list_ever').eq(chooseNum).siblings().find('.light').removeClass('choose');
                $('.list_ever').eq(chooseNum).addClass('max').siblings().removeClass('max');
                $('.list_ever').eq(chooseNum).find('audio').get(0).play();
                startNum ++;
                if (startNum>endNum+(circleNum*6)) {
                    arrIndex++;
                    if (arrIndex>=chooseIndexArr.length) {
                        itemClick = false;
                    } else {
                        console.log(circleNum)
                        endNum = chooseIndexArr[arrIndex]*1;
                        circleNum  = circleNum + 2
                        itemClick = true;
                    }
                    clearInterval(time);
                    SDK.setEventLock();
                }
            },400); 
        })
    }
})
