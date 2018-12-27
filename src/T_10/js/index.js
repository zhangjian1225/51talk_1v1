"use strict"
import '../../common/js/common_1v1.js'

$(function () {
    window.h5Template = {
    	hasPractice: '1' 
    }
    let h5SyncActions = parent.window.h5SyncActions;
    const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;
    /**
     * 创建花瓣
     */
    let posHtml = '';
    for (let i = 0; i<configData.source.list.length; i++) {
        posHtml += `<div class="pos pos_${i+1} ${configData.source.list[i].end == 'true'? 'end':''}" data-index=${i}>
                <img src="${configData.source.list[i].img}"/>
                <audio src="./audio/chooseEnd.mp3" class="chooseEnd"></audio>
                <audio src="./audio/chooseMove.mp3" class="chooseMove"></audio>
            </div>`
    }
    $('.flower').append(posHtml).addClass(configData.source.pos);
    if (configData.source.font_img) {
        $('.center_img').html('<img src="'+configData.source.font_img+'"/>')
    }
    /**
     * 创建文章
     */
    let initSentance = configData.source.article;//是一个文本描述数组
    let editorHtml = '';
    // 花朵只有在右面时显示文本
    if (configData.source.pos == 'right') {
        if (initSentance) {
            initSentance.forEach(function(item,i){
                let fragment = item.insert;
                fragment = fragment.replace('\n','');
                  if(item.hasOwnProperty('attributes')&&item.attributes.hasOwnProperty('underline')){
                      editorHtml +=`<span >${item.insert}</span>`
                  }else{
                      editorHtml +=item.insert;
                  }
            });
            $('.article_text').html(editorHtml).show();
        }
    }
    
    window.onload = function () {
        $('.button').css({
            'background':'url('+configData.source.btnImg+') no-repeat',
            'background-size': 'contain'
        })
        let chooseIndexArr = ['1','3','5','2','4','6']; // 选择的顺序
        let arrIndex = 0;
        let endNum = chooseIndexArr[arrIndex]*1; // 停止的index值
        let circleNum = 1; // 旋转圈数
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
            $('.mask').hide();
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
            $('.pos').addClass('posCh');
            let time = setInterval(function () {
                if(startNum>5) {
                    chooseNum = startNum%6;
                } else {
                    chooseNum = startNum;
                }
               
                $('.pos').eq(chooseNum).addClass('max').siblings().removeClass('max');
                startNum ++;
                if (startNum>endNum+(circleNum*6)) {
                    $('.pos').eq(chooseNum).find('.chooseEnd').get(0).play();
                    arrIndex++;
                    if (arrIndex>=chooseIndexArr.length) {
                        $('.mask').show();
                        endNum = chooseIndexArr[arrIndex%chooseIndexArr.length]*1;
                        circleNum  = circleNum + 1
                        itemClick = true;
                    } else {
                        $('.mask').show();
                        endNum = chooseIndexArr[arrIndex]*1;
                        circleNum  = circleNum + 1
                        itemClick = true;
                    }
                    clearInterval(time);
                    SDK.setEventLock();
                } else {
                    $('.pos').eq(chooseNum).find('.chooseMove').get(0).play();
                }
            },300); 
        })
    }
})
