"use strict"
import '../../common/js/common_1v1.js';
import '../../common/js/drag.js'

$(function () {
    window.h5Template = {
        hasPractice: '1'
    }
    let h5SyncActions = parent.window.h5SyncActions;
    const isSync = parent.window.h5SyncActions && parent.window.h5SyncActions.isSync;
    const msg = configData.source;
    const dis = 0.3;


    /**
     * 添加入场动画
    */

    window.onload = function () {
        $('.train').addClass('moveIn');
        if (isSync) {
            var current_user_id = SDK.getClassConf().user.id;
            var frame_id = $(window.frameElement).attr('id');
            var frame_user_id = $(window.frameElement).attr('user_id');
            if (frame_id != 'h5_course_cache_frame' && frame_user_id == current_user_id && frame_id === 'h5_course_self_frame') {
                $('.inOutAudio').get('0').play();
            }
        } else {
            $('.inOutAudio').get('0').play();
        }
    };


    /**
     * 创建元素 
    */

    let cardListHtml = '';
    let trainHtml = '';
    let listArr = [];
    $.each(msg.distracterList, function (index, val) {
        listArr.push(val);
    })
    let nowTrueNum = 0; // 答对的个数

    // 创建火车车厢
    for (let i = 0; i < msg.trainMsg.length; i++) {
        if (msg.type == 'img') {
            if (msg.trainMsg[i].isEmpty == 'true') {
                listArr.push(msg.trainMsg[i]);
            } else {
                nowTrueNum++;
            }
            trainHtml += `
                <div class="trainB_evl pos_${msg.trainMsg[i].pos} ${msg.trainMsg[i].isEmpty == 'true' ? 'hasMask' : ''}">
                    <div class="mask"></div>
                    <div class="box"><img src="${msg.trainMsg[i].img}" class="isShow ${msg.trainMsg[i].isEmpty == 'true' ? 'hide' : ''}"></div>
                </div>
            `
        } else {
            if (msg.trainMsg[i].isEmpty == 'true') {
                listArr.push(msg.trainMsg[i]);
            } else {
                nowTrueNum++;
            }
            trainHtml += `
                <div class="trainB_evl pos_${msg.trainMsg[i].pos} ${msg.trainMsg[i].isEmpty == 'true' ? 'hasMask' : ''}">
                    <div class="mask"></div>
                    <div class="box">
                        <div class="isShow ${msg.trainMsg[i].font.length > 1 ? 'cs' : 'fs'}">
                            <span class="${msg.trainMsg[i].isEmpty == 'true' ? 'hide' : ''}">${msg.trainMsg[i].font}</span>
                        </div>
                    </div>
                </div>
            `
        }

    }
    $('.trainB').html(trainHtml);

    if (configData.source.audio) {
        $('.audioBg').show().append(`<audio src="${configData.source.audio}" class="audio"></audio>`)
    }


    /**
     * 打乱顺序
    */

    let seleList = []; // 打乱顺序后的数组
    let cardObj = {};
    if (listArr.length > 0) {
        if (isSync) {
            if (msg.random) {
                let pages = SDK.getClassConf().h5Course.localPage//页码打乱顺序
                let seleListOne = window.reSort(listArr, pages);
                seleList = window.reSort(seleListOne, msg.random);
            } else {
                let pages = SDK.getClassConf().h5Course.localPage//页码打乱顺序
                seleList = window.reSort(listArr, pages);
            }
        } else {
            if (msg.random) {
                seleList = window.reSort(listArr, msg.random);
            } else {
                seleList = window.reSort(listArr, Math.round(Math.random() * 100));
            }

        }
    }
    let initPOsLe = 0;
    switch (listArr.length) {
        case 1: initPOsLe = 7; break;
        case 2: initPOsLe = 5.2; break;
        case 3: initPOsLe = 4.2; break;
        case 4: initPOsLe = 3; break;
        case 5: initPOsLe = 1.5; break;
        case 6: initPOsLe = 0; break;
    }
    // 创建拖拽选项
    for (let i = 0; i < seleList.length; i++) {
        cardObj["card_ele_" + seleList[i].pos] = false;
        if (msg.type == 'img') {
            cardListHtml += `
                <div class="card_ele imgC card_ele_${seleList[i].pos}" data-syncactions="item_${i}" data-pos="${seleList[i].pos}" data-id="card_ele_${seleList[i].pos}" data-item="pos_${seleList[i].pos}" data-initT = "6.95" data-initL = ${(dis + 2.5) * i + initPOsLe} style="left:${(dis + 2.5) * i + initPOsLe}rem" >
                    <div class="cardBox"><img src="${seleList[i].img}"></div>
                </div>
             `
        } else {
            cardListHtml += `
                <div class="card_ele imgF card_ele_${seleList[i].pos}"  data-syncactions="item_${i}" data-pos="${seleList[i].pos}" data-id="card_ele_${seleList[i].pos}" data-item="pos_${seleList[i].pos}"  data-initT = "6.95" data-initL = "${(dis + 2.5) * i + initPOsLe}" style="left:${(dis + 2.5) * i + initPOsLe}rem">
                    <div class="cardBox  ${seleList[i].font.length > 1 ? 'cs' : 'fs'}">${seleList[i].font}</div>
                </div>
            `
        }

    }
    $('.cardList').html(cardListHtml);


    /**
     * 开始拖拽
    */

    let boxHalf = 1.2;
    let moveHalf = 1.25;
    let breakAre = 1.5; //碰撞的有效面积
    let canDrag = true;
    $('.train').on('animationend webkitAnimationEnd', function () {
        $('.inOutAudio').get('0').pause();
        $('.card_ele').drag({
            before: function (e) {
                $('.hasMask .mask').fadeIn(500);
                $(this).css({
                    "transition": "",
                    "z-index": 21,
                    "transform": "scale(.8)"
                })
            },
            process: function (e) {

            },
            end: function (e) {
                $('.hasMask .mask').fadeOut(500);
                if ($(this).attr('data-pos') == '#') { // 干扰项
                    $(this).css({
                        left: $(this).attr('data-initL') + "rem",
                        top: $(this).attr('data-initT') + "rem",
                        "transition": "all 0.5s",
                        "transform": "scale(1)",
                        "z-index": 20
                    })
                } else {
                    let className = $(this).attr('data-item');
                    // 获取正确车厢中心位置
                    let moveLeft = ($(this).offset().left - $('.container').offset().left) / window.base + moveHalf; //拖拽体的中心left
                    let moveTop = ($(this).offset().top - $('.container').offset().top) / window.base + moveHalf; //拖拽体的中心top
                    let boxLeft = ($('.' + className).offset().left - $('.container').offset().left) / window.base + boxHalf; //拖拽坑的left位置
                    let boxTop = ($('.' + className).offset().top - $('.container').offset().top) / window.base + boxHalf; //拖拽坑的位置
                    let sameLeft = Math.abs(moveLeft - boxLeft);
                    let sameTop = Math.abs(moveTop - boxTop);

                    //判断中心点是否在检测区域
                    if (sameLeft <= breakAre && sameTop <= breakAre) {
                        nowTrueNum++;
                        cardObj[$(this).attr('data-id')] = true;
                        if (canDrag) {
                            canDrag = false;
                            if (!isSync) {
                                $(this).trigger("syncDragEnd");
                                return;
                            }
                            SDK.bindSyncEvt({
                                index: $(this).data('syncactions'),
                                eventType: 'click',
                                method: 'event',
                                syncName: 'syncDragEnd',
                                otherInfor: {
                                    cardObj: cardObj,
                                    nowTrueNum: nowTrueNum,
                                    goOut: false
                                },
                                recoveryMode: '1'
                            });
                        }
                    } else { //答错
                        $(this).css({
                            left: $(this).attr('data-initL') + "rem",
                            top: $(this).attr('data-initT') + "rem",
                            "transition": "all 0.5s",
                            "transform": "scale(1)",
                            "z-index": 20
                        })
                    }
                }
            }
        })
    })
    $('.card_ele').on('syncDragEnd', function (e, message) {
        if (isSync) {
            let otherInfor = message.data[0].value.syncAction.otherInfor;
            cardObj = otherInfor.cardObj;
            nowTrueNum = otherInfor.nowTrueNum;
            if (message.operate == '5') {
                callbackFn(cardObj, otherInfor.goOut);
                return;
            }
        }
        let className = $(this).attr('data-item');
        if (msg.type == 'img') {
            $('.' + className).find('.isShow').show();
        } else {
            $('.' + className).find('.isShow span').show();
        }
        $('.' + className).removeClass('hasMask');
        $(this).hide();
        if (nowTrueNum >= msg.trainMsg.length) {
            $('.redLight').hide();
            $('.greenLight').show();
            $('.trainH .cloud1').fadeIn(1000);
            $('.trainH .cloud2').fadeIn(1500);
            $('.trainH .cloud3').fadeIn(2000);
            if (isSync) {
                if (window.frameElement.getAttribute('user_type') == 'tea') {
                    $('.alertBox').css('opacity', '1');
                }
            } else {
                $('.alertBox').css('opacity', '1');
            }
            canDrag = false;
            setTimeout(function () {
                $('.trueAudio').get('0').play();
                $('.trueAudio').get('0').onended = function () {
                    setTimeout(function () {
                        $('.trueAudio1').get('0').play();
                    }, 500)
                }
            }, 800)
            $('.Allmask').show();
        } else {
            canDrag = true;
        }
        SDK.setEventLock();
    })


    /**
     * 老师提示框
    */

    $('.alertBox').drag();
    let canClick = true;
    $(".btn").on("click touchstart", function (e) {
        if (e.type == "touchstart") {
            e.preventDefault()
        }
        e.stopPropagation();
        if (canClick) {
            canClick = false;
            if (!isSync) {
                $(this).trigger("clickBtn");
                return;
            }
            if (window.frameElement.getAttribute('user_type') == 'tea') {
                SDK.bindSyncEvt({
                    sendUser: '',
                    receiveUser: '',
                    index: $(e.currentTarget).data("syncactions"),
                    eventType: 'click',
                    method: 'event',
                    syncName: 'clickBtn',
                    otherInfor: {
                        cardObj: cardObj,
                        nowTrueNum: nowTrueNum,
                        goOut: true
                    },
                    recoveryMode: '1'
                });
            }
        }
    });
    $(".btn").on('clickBtn', function (e, message) {
        if (isSync) {
            let otherInfor = message.data[0].value.syncAction.otherInfor;
            cardObj = otherInfor.cardObj;
            nowTrueNum = otherInfor.nowTrueNum;
            if (message.operate == '5') {
                callbackFn(cardObj, otherInfor.goOut);
                return;
            }
        }
        $(this).css({
            'background': '#bcbcbc',
            'cursor': 'not-allowed'
        })
        $('.inOutAudio').get('0').play();
        $('.train').addClass('moveOut');
        SDK.setEventLock();
    })

    /**
     * 点击声音按钮
    */

    let audioBgClick = true;
    $('.audioBg').on('click touchstart', function (e) {
        if (e.type == "touchstart") {
            e.preventDefault()
        }
        e.stopPropagation();
        if (audioBgClick) {
            audioBgClick = false;
            // 判断幕布是否开启
            if (!isSync) {
                $(this).trigger('audioBgClick')
                return;
            }
            if (window.frameElement.getAttribute('user_type') == 'tea') {
                SDK.bindSyncEvt({
                    index: $(e.currentTarget).data('syncactions'),
                    eventType: 'click',
                    method: 'event',
                    funcType: 'audio',
                    syncName: 'audioBgClick',
                    otherInfor: {
                        cardObj: cardObj,
                        nowTrueNum: nowTrueNum,
                        goOut: true
                    },
                    recoveryMode: '1'
                });
            }
        }
    })
    $('.audioBg').on('audioBgClick', function (e, message) {
        if (isSync) {
            let otherInfor = message.data[0].value.syncAction.otherInfor;
            cardObj = otherInfor.cardObj;
            nowTrueNum = otherInfor.nowTrueNum;
            if (message.operate == '5') {
                callbackFn(cardObj, otherInfor.goOut);
                return;
            }
        }
        $('.audioInit').hide();
        $('.audioGif').show();
        $('.audio').get(0).play()
        $('.audio').get(0).onended = function () {
            $('.audioInit').show();
            $('.audioGif').hide();
        };
        audioBgClick = true;
        SDK.setEventLock();
    })

    /**
     * 重新进入教室
    */

    function callbackFn(obj, status) {
        $.each(obj, function (key, val) {
            if (val) {
                let className = $('.' + key).attr('data-item');
                if (msg.type == 'img') {
                    $('.' + className).find('.isShow').show();
                } else {
                    $('.' + className).find('.isShow span').show();
                }
                $('.' + className).removeClass('hasMask');
                $('.' + key).hide();
            }
        })
        if (nowTrueNum >= msg.trainMsg.length) {
            $('.Allmask').show();
            $('.redLight').hide();
            $('.greenLight').show();
            $('.trainH .cloud1').fadeIn(1000);
            $('.trainH .cloud2').fadeIn(1500);
            $('.trainH .cloud3').fadeIn(2000);
            if (isSync) {
                if (window.frameElement.getAttribute('user_type') == 'tea') {
                    $('.alertBox').css('opacity', '1');
                }
            } else {
                $('.alertBox').css('opacity', '1');
            }
            canDrag = false;
        } else {
            canDrag = true;
        }
        if (status) {
            $('.train').addClass('moveOut');
            $('.btn').css({
                'background': '#bcbcbc',
                'cursor': 'not-allowed'
            })
        }
        SDK.setEventLock();
    }
})
